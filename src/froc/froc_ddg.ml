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

let debug = ref ignore

let set_debug f =
  debug := f;
  TS.set_debug f

let handle_exn = ref raise
let set_exn_handler h = handle_exn := h

type 'a result = Value of 'a | Fail of exn

type 'a changeable = {
  id : int;
  eq : 'a -> 'a -> bool;
  mutable state : 'a result;
  mutable deps : ('a result -> unit) Dlist.t;
}

type 'a repr = Constant of int * 'a result | Changeable of 'a changeable

type +'a t
type -'a u

external t_of_repr : 'a repr -> 'a t = "%identity"
external repr_of_t : 'a t -> 'a repr = "%identity"
external u_of_changeable : 'a changeable -> 'a u = "%identity"
external changeable_of_u : 'a u -> 'a changeable = "%identity"

let total_eq v1 v2 = try compare v1 v2 = 0 with _ -> false

let hash t =
  match repr_of_t t with
    | Constant (id, _) -> id
    | Changeable c -> c.id

exception Unset

let next_id =
  let next_id = ref 1 in
  fun () -> let id = !next_id in incr next_id; id

let make_changeable
    ?(eq = total_eq)
    ?(result = Fail Unset)
    () =
  let c = {
    id = next_id ();
    eq = eq;
    state = result;
    deps = Dlist.empty ();
  } in
  t_of_repr (Changeable c), u_of_changeable c

let make_constant result = t_of_repr (Constant (next_id (), result))

let changeable ?eq v = make_changeable ?eq ~result:(Value v) ()
let return v = make_constant (Value v)
let fail e = make_constant (Fail e)

let write_result u r =
  let c = changeable_of_u u in
  let eq =
    match c.state, r with
      | Value v1, Value v2 -> c.eq v1 v2
      | Fail e1, Fail e2 -> e1 == e2 (* XXX ? *)
      | _ -> false in
  if not eq
  then begin
    c.state <- r;
    Dlist.iter (fun f -> try f r with e -> !handle_exn e) c.deps
  end

let write_result_no_eq u r =
  let c = changeable_of_u u in
  c.state <- r;
  Dlist.iter (fun f -> try f r with e -> !handle_exn e) c.deps

let write u v = write_result u (Value v)
let write_exn u e = write_result u (Fail e)

let read_result t =
  match repr_of_t t with
    | Constant (_, r) -> r
    | Changeable c -> c.state

let read t =
  match read_result t with
    | Value v -> v
    | Fail e -> raise e

let add_dep ts t dep =
  match repr_of_t t with
    | Constant _ -> ()
    | Changeable c ->
        let dl = Dlist.add_after c.deps dep in
        let cancel () = Dlist.remove dl in
        TS.add_cleanup ts cancel

let notify t f =
  add_dep (TS.tick ()) t f

let cleanup f =
  TS.add_cleanup (TS.tick ()) f

type reader = {
  read : unit -> unit;
  start : TS.t;
  finish : TS.t;
}

(*
module PQ = Pqueue.Make(struct
  type t = reader
  let compare t1 t2 = TS.compare t1.start t2.start
end)
*)

module PQ : sig
  type elt = reader
  type t
  val empty : t
  val is_empty : t -> bool
  val add : elt -> t -> t
  val find_min : t -> elt
  val remove_min : t -> t
end =
struct
  type elt = reader
  type t = elt Dlist.t
  let empty = Dlist.empty ()
  let is_empty t = t.Dlist.prev == t && t.Dlist.next == t
  let add elt d =
    let rec loop t =
      if t == d || TS.compare elt.start t.Dlist.data.start = -1
      then ignore (Dlist.add_before t elt)
      else loop t.Dlist.next in
    loop d.Dlist.next;
    d
  let find_min t =
    if is_empty t
    then raise Not_found
    else t.Dlist.next.Dlist.data
  let remove_min t =
    if is_empty t
    then ()
    else Dlist.remove t.Dlist.next;
    t
end

let pq = ref (PQ.empty)

let init () =
  TS.init ();
  pq := PQ.empty

let enqueue e _ = pq := PQ.add e !pq

let add_reader t read =
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t (enqueue r)

let connect u t' =
  write_result u (read_result t');
  add_dep (TS.tick ()) t' (write_result_no_eq u)

let bind_gen ?eq assign f t =
  let rt, ru = make_changeable ?eq () in
  add_reader t (fun () ->
    match read_result t with
      | Fail e -> write_exn ru e
      | Value v -> try assign ru (f v) with e -> write_exn ru e);
  rt

let bind ?eq t f = bind_gen ?eq connect f t
let (>>=) t f = bind t f
let lift ?eq f = bind_gen ?eq write f
let blift ?eq t f = lift ?eq f t

let try_bind_gen ?eq assign f succ err =
  let t = try f () with e -> fail e in
  let rt, ru = make_changeable ?eq () in
  add_reader t (fun () ->
    try assign ru (match read_result t with Value v -> succ v | Fail e -> err e)
    with e -> write_exn ru e);
  rt

let try_bind ?eq f succ err = try_bind_gen ?eq connect f succ err
let try_bind_lift ?eq f succ err = try_bind_gen ?eq write f succ err

let catch_gen ?eq assign f err =
  let t = try f () with e -> fail e in
  let rt, ru = make_changeable ?eq () in
  add_reader t (fun () ->
    match read_result t with
      | Value _ as r -> write_result ru r
      | Fail e -> try assign ru (err e) with e -> write_exn ru e);
  rt

let catch ?eq f err = catch_gen ?eq connect f err
let catch_lift ?eq f err = catch_gen write ?eq f err

let finish = Stack.create ()

let rec prop ?until () =
  if not (PQ.is_empty !pq)
  then
    let r = PQ.find_min !pq in
    if TS.is_spliced_out r.start
    then begin pq := PQ.remove_min !pq; prop ?until () end
    else
      match until with
        | Some until when TS.compare r.start until = 1 -> ()
        | _ ->
            pq := PQ.remove_min !pq;
            TS.set_now r.start;
            Stack.push r.finish finish;
            r.read ();
            ignore (Stack.pop finish);
            TS.splice_out (TS.get_now ()) r.finish;
            prop ()

let propagate () =
  let now' = TS.get_now () in
  prop ();
  TS.set_now now'

type 'a memo = {
  m_result : 'a result;
  m_start : TS.t;
  m_finish : TS.t;
}

let memo ?size ?hash ?eq () =
  let h = Froc_hashtbl.create ?size ?hash ?eq () in
  fun f k ->
    let result =
      try
        if Stack.is_empty finish then raise Not_found;
        let ok m =
          TS.compare (TS.get_now ()) m.m_start = -1 &&
          TS.compare m.m_finish (Stack.top finish) = -1 in
        let m = Froc_hashtbl.find h k ok in
        TS.splice_out (TS.get_now ()) m.m_start;
        prop ~until:m.m_finish ();
        TS.set_now m.m_finish;
        m.m_result
      with Not_found ->
        let start = TS.tick () in
        let result = try Value (f k) with e -> Fail e in
        let finish = TS.tick () in
        let m = { m_result = result; m_start = start; m_finish = finish } in
        Froc_hashtbl.add h k m;
        let cancel () = Froc_hashtbl.remove h k (fun m' -> m' == m) in
        TS.add_cleanup finish cancel;
        result in
    match result with Value v -> v | Fail e -> raise e

let bind2_gen ?eq assign f t1 t2 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2 with
      | Fail e, _
      | _, Fail e -> write_exn ru e
      | Value v1, Value v2 ->
          try assign ru (f v1 v2)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  rt

let bind2 ?eq t1 t2 f = bind2_gen ?eq connect f t1 t2
let lift2 ?eq f = bind2_gen ?eq write f
let blift2 ?eq t1 t2 f = lift2 ?eq f t1 t2

let bind3_gen ?eq assign f t1 t2 t3 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2, read_result t3 with
      | Fail e, _, _
      | _, Fail e, _
      | _, _, Fail e -> write_exn ru e
      | Value v1, Value v2, Value v3 ->
          try assign ru (f v1 v2 v3)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  add_dep start t3 (enqueue r);
  rt

let bind3 ?eq t1 t2 t3 f = bind3_gen ?eq connect f t1 t2 t3
let lift3 ?eq f = bind3_gen ?eq write f
let blift3 ?eq t1 t2 t3 f = lift3 ?eq f t1 t2 t3

let bind4_gen ?eq assign f t1 t2 t3 t4 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2, read_result t3, read_result t4 with
      | Fail e, _, _, _
      | _, Fail e, _, _
      | _, _, Fail e, _
      | _, _, _, Fail e -> write_exn ru e
      | Value v1, Value v2, Value v3, Value v4 ->
          try assign ru (f v1 v2 v3 v4)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  add_dep start t3 (enqueue r);
  add_dep start t4 (enqueue r);
  rt

let bind4 ?eq t1 t2 t3 t4 f = bind4_gen ?eq connect f t1 t2 t3 t4
let lift4 ?eq f = bind4_gen ?eq write f
let blift4 ?eq t1 t2 t3 t4 f = lift4 ?eq f t1 t2 t3 t4

let bind5_gen ?eq assign f t1 t2 t3 t4 t5 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2, read_result t3, read_result t4, read_result t5 with
      | Fail e, _, _, _, _
      | _, Fail e, _, _, _
      | _, _, Fail e, _, _
      | _, _, _, Fail e, _
      | _, _, _, _, Fail e -> write_exn ru e
      | Value v1, Value v2, Value v3, Value v4, Value v5 ->
          try assign ru (f v1 v2 v3 v4 v5)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  add_dep start t3 (enqueue r);
  add_dep start t4 (enqueue r);
  add_dep start t5 (enqueue r);
  rt

let bind5 ?eq t1 t2 t3 t4 t5 f = bind5_gen ?eq connect f t1 t2 t3 t4 t5
let lift5 ?eq f = bind5_gen ?eq write f
let blift5 ?eq t1 t2 t3 t4 t5 f = lift5 ?eq f t1 t2 t3 t4 t5

let bind6_gen ?eq assign f t1 t2 t3 t4 t5 t6 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2, read_result t3, read_result t4, read_result t5, read_result t6 with
      | Fail e, _, _, _, _, _
      | _, Fail e, _, _, _, _
      | _, _, Fail e, _, _, _
      | _, _, _, Fail e, _, _
      | _, _, _, _, Fail e, _
      | _, _, _, _, _, Fail e -> write_exn ru e
      | Value v1, Value v2, Value v3, Value v4, Value v5, Value v6 ->
          try assign ru (f v1 v2 v3 v4 v5 v6)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  add_dep start t3 (enqueue r);
  add_dep start t4 (enqueue r);
  add_dep start t5 (enqueue r);
  add_dep start t6 (enqueue r);
  rt

let bind6 ?eq t1 t2 t3 t4 t5 t6 f = bind6_gen ?eq connect f t1 t2 t3 t4 t5 t6
let lift6 ?eq f = bind6_gen ?eq write f
let blift6 ?eq t1 t2 t3 t4 t5 t6 f = lift6 ?eq f t1 t2 t3 t4 t5 t6

let bind7_gen ?eq assign f t1 t2 t3 t4 t5 t6 t7 =
  let rt, ru = make_changeable ?eq () in
  let read () =
    match read_result t1, read_result t2, read_result t3, read_result t4, read_result t5, read_result t6, read_result t7 with
      | Fail e, _, _, _, _, _, _
      | _, Fail e, _, _, _, _, _
      | _, _, Fail e, _, _, _, _
      | _, _, _, Fail e, _, _, _
      | _, _, _, _, Fail e, _, _
      | _, _, _, _, _, Fail e, _
      | _, _, _, _, _, _, Fail e -> write_exn ru e
      | Value v1, Value v2, Value v3, Value v4, Value v5, Value v6, Value v7 ->
          try assign ru (f v1 v2 v3 v4 v5 v6 v7)
          with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  add_dep start t1 (enqueue r);
  add_dep start t2 (enqueue r);
  add_dep start t3 (enqueue r);
  add_dep start t4 (enqueue r);
  add_dep start t5 (enqueue r);
  add_dep start t6 (enqueue r);
  add_dep start t7 (enqueue r);
  rt

let bind7 ?eq t1 t2 t3 t4 t5 t6 t7 f = bind7_gen ?eq connect f t1 t2 t3 t4 t5 t6 t7
let lift7 ?eq f = bind7_gen ?eq write f
let blift7 ?eq t1 t2 t3 t4 t5 t6 t7 f = lift7 ?eq f t1 t2 t3 t4 t5 t6 t7

let bindN_gen ?eq assign f ts =
  let rt, ru = make_changeable ?eq () in
  let read () =
    try
      let vs = List.map read ts in
      assign ru (f vs)
    with e -> write_exn ru e in
  let start = TS.tick () in
  read ();
  let r = { read = read; start = start; finish = TS.tick () } in
  List.iter (fun t -> add_dep start t (enqueue r)) ts;
  rt

let bindN ?eq ts f = bindN_gen ?eq connect f ts
let liftN ?eq f = bindN_gen ?eq write f
let bliftN ?eq ts f = liftN ?eq f ts
