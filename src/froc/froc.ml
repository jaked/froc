(*
 * This file is part of froc, a library for functional reactive programming
 * Copyright (C) 2009 Jacob Donham
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

module Dlist = Froc_dlist
module TS = Froc_timestamp

include Froc_ddg

type 'a event = {
  e_id : int;
  mutable e_deps : ('a result -> unit) Dlist.t;
}

let next_id =
  let next_id = ref 1 in
  fun () -> let id = !next_id in incr next_id; id

let make_event () = {
  e_id = next_id ();
  e_deps = Dlist.empty ();
}

let handle_exn = ref raise

let set_exn_handler h =
  set_exn_handler h;
  handle_exn := h

let send_result t r =
  Dlist.iter (fun f -> try f r with e -> !handle_exn e) t.e_deps

let send t v = send_result t (Value v)
let send_exn t e = send_result t (Fail e)

let notify_e t f =
  let dl = Dlist.add_after t.e_deps f in
  let cancel () = Dlist.remove dl in
  TS.add_cleanup (TS.tick ()) cancel

let merge ts =
  let t = make_event () in
  List.iter (fun t' -> notify_e t' (send_result t)) ts;
  t

let map f t =
  let t' = make_event () in
  notify_e t
    (fun r ->
      let r =
        match r with
          | Fail e -> Fail e
          | Value v ->
              try Value (f v)
              with e -> Fail e in
      send_result t' r);
  t'

let filter p t =
  let t' = make_event () in
  notify_e t
    (fun r ->
      let r =
        match r with
          | Fail _ -> Some r
          | Value v ->
              try if p v then Some (Value v) else None
              with e -> Some (Fail e) in (* ? *)
      match r with Some r -> send_result t' r | _ -> ());
  t'

let collect f init t =
  let t' = make_event () in
  let s = ref (Value init) in
  notify_e t
    (fun r ->
      let r =
        match !s, r with
          | Fail _, _ -> None (* ? *)
          | _, Fail e -> Some (Fail e)
          | Value sv, Value v ->
              try Some (Value (f sv v))
              with e -> Some (Fail e) in
      match r with Some r -> s := r; send_result t' r | _ -> ());
  t'

let q = Queue.create ()

let init () =
  init ();
  Queue.clear q

let running = ref false

let run_queue () =
  running := true;
  while not (Queue.is_empty q) do
    let f = Queue.take q in
    f ();
    propagate ()
  done;
  running := false

let enqueue f =
  Queue.add f q;
  if not !running
  then run_queue ()

let send_result t r = enqueue (fun () -> send_result t r)
let send t v = send_result t (Value v)
let send_exn t e = send_result t (Fail e)

type 'a behavior = 'a t

let notify_b = notify

let switch bb = bb >>= fun b -> b

let hold_result ?eq init e =
  let bt, bu = make_changeable ?eq ~result:init () in
  notify_e e (write_result bu);
  bt

let hold ?eq init e = hold_result ?eq (Value init) e

let changes b =
  let e = make_event () in
  notify b (send_result e);
  e

let when_true b =
  map (fun b -> ()) (filter (fun b -> b) (changes b))

let count e = hold 0 (collect (fun n _ -> n + 1) 0 e)
