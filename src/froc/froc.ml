(*
 * This file is part of froc, a library for functional reactive programming
 * Copyright (C) 2009-2010 Jacob Donham
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 *
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA
 *)

include Froc_ddg

let debug = ref ignore

let set_debug f =
  debug := f;
  set_debug f

type 'a event = 'a t
type 'a event_sender = 'a u

let q = Queue.create ()
let temps = ref []
let running = ref false

let init () =
  init ();
  Queue.clear q;
  temps := [];
  running := false

let run_queue () =
  if not !running then begin
    running := true;
    try
      while not (Queue.is_empty q)
      do Queue.take q () done;
      running := false
    with e ->
      running := false;
      raise e
  end

let with_run_queue f =
  (* don't run the queue until f is done *)
  let running' = !running in
  running := true;
  f ();
  running := running';
  run_queue ()

let write_temp_result u r =
  temps := (fun () -> clear u) :: !temps;
  write_result u r

let send_result s r =
  match !temps with
    | [] ->
        with_run_queue begin fun () ->
          write_temp_result s r;
          propagate ();
          List.iter (fun f -> f ()) !temps;
          temps := []
        end
    | _ -> failwith "already in update loop"

let send s v = send_result s (Value v)
let send_exn s e = send_result s (Fail e)

let send_result_deferred u r =
  Queue.add (fun () -> send_result u r) q;
  run_queue ()

let send_deferred u v = send_result_deferred u (Value v)
let send_exn_deferred u e = send_result_deferred u (Fail e)

let never_eq _ _ = false

let make_event () = make_changeable ~eq:never_eq ()

let never = make_constant (Fail Unset)
let is_never = is_constant

let notify_result_e_cancel t f = notify_result_cancel ~current:false t f
let notify_result_e t f = notify_result ~current:false t f
let notify_e_cancel t f = notify_cancel ~current:false t f
let notify_e t f = notify ~current:false t f

let hash_event = hash

let next t =
  if is_never t then never
  else
    let rt, ru = make_event () in
    let c = ref no_cancel in
    c :=
      notify_result_e_cancel t begin fun r ->
        cancel !c;
        c := no_cancel;
        write_temp_result ru r;
        (* XXX clear deps, don't allow new deps to be added *)
      end;
    rt

let merge ts =
  if List.for_all is_never ts then never
  else
    let rt, ru = make_event () in
    let notify = ref false in
    add_readerN ts begin fun () ->
      if not !notify then notify := true
      else
        let rec loop = function
          | [] -> assert false
          | h :: t ->
              match read_result h with
                | Fail Unset -> loop t
                | r -> r in
        write_temp_result ru (loop ts)
    end;
    rt

let map f t =
  if is_never t then never
  else
    let rt, ru = make_event () in
    notify_result_e t begin fun r ->
      let r =
        match r with
          | Fail e -> Fail e
          | Value v -> try Value (f v) with e -> Fail e in
      write_temp_result ru r
    end;
    rt

let map2 f t1 t2 =
  if is_never t1 && is_never t2 then never
  else
    let rt, ru = make_event () in
    let notify = ref false in
    add_reader2 t1 t2 begin fun () ->
      if not !notify then notify := true
      else
        let r =
          match read_result t1, read_result t2 with
            | Fail Unset, _
            | _, Fail Unset -> None
            | Fail e, _
            | _, Fail e -> Some (Fail e)
            | Value v1, Value v2 ->
                try Some (Value (f v1 v2)) with e -> Some (Fail e) in
        match r with
          | None -> ()
          | Some r -> write_temp_result ru r
    end;
    rt

let filter p t =
  if is_never t then never
  else
    let rt, ru = make_event () in
    notify_result_e t begin fun r ->
      let r =
        match r with
          | Fail _ -> Some r
          | Value v ->
              try if p v then Some (Value v) else None
              with e -> Some (Fail e) in (* ? *)
      match r with Some r -> write_temp_result ru r | _ -> ()
    end;
    rt

let collect f init t =
  if is_never t then never
  else
    let rt, ru = make_event () in
    let st = ref (Value init) in
    notify_result_e t begin fun r ->
      let r =
        match !st, r with
          | Fail _, _ -> None (* ? *)
          | _, Fail e -> Some (Fail e)
          | Value sv, Value v ->
              try Some (Value (f sv v))
              with e -> Some (Fail e) in
      match r with Some r -> st := r; write_temp_result ru r | _ -> ()
    end;
    rt

let join_e ee =
  if is_never ee then never
  else
    let rt, ru = make_event () in
    notify_result_e ee begin function
      | Value e -> notify_result_e e (write_temp_result ru)
      | Fail e -> write_temp_result ru (Fail e)
    end;
    rt

let fix_e ef =
  let t, u = make_event () in
  let e = ef t in
  notify_result_e e (send_result_deferred u);
  e

type 'a behavior = 'a t

let sample = read
let sample_result = read_result

let notify_b = notify
let notify_b_cancel = notify_cancel
let notify_result_b = notify_result
let notify_result_b_cancel = notify_result_cancel

let hash_behavior = hash

let join_b ?eq bb = bind ?eq bb (fun b -> b)

let fix_b ?eq bf =
  let t, u = make_changeable ?eq () in
  let b = bf t in
  notify_result_b b begin fun r ->
    Queue.add (fun () -> write_result u r) q;
    run_queue ()
  end;
  b

let switch ?eq b e =
  if is_never e then b else
    let bt, bu = make_changeable ?eq () in
    notify_result e begin function
      | Fail Unset -> connect bu b
      | Value b -> connect bu b
      | Fail e -> write_exn bu e
    end;
    bt

let until ?eq b e = switch ?eq b (next e)

let hold_result ?eq init e =
  if is_never e then make_constant init else
    let t, u = make_changeable ?eq ~result:init () in
    notify_result_e e (write_result u);
    t

let hold ?eq init e = hold_result ?eq (Value init) e

let changes b =
  if is_constant b then never else
    let t, u = make_event () in
    notify_result_b ~current:false b (write_temp_result u);
    t

let when_true b =
  map (fun b -> ()) (filter (fun b -> b) (changes b))

let count t = hold 0 (collect (fun n _ -> n + 1) 0 t)

let make_cell v =
  let t, u = make_event () in
  (hold v t, send_deferred u)
