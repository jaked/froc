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

let debug = ref ignore
let set_debug f = debug := f

type t = {
  mutable id : int;
  mutable next : t;
  mutable cleanup : unit -> unit;
}

let is_spliced_out t = t.id = -1

let check t =
  if is_spliced_out t
  then raise (Invalid_argument "spliced out timestamp")

let next_id =
  let next_id = ref 1 in
  fun () -> let id = !next_id in incr next_id; id

let empty () =
  let rec s = { id = 0; next = s; cleanup = ignore } in
  { id = next_id (); next = s; cleanup = ignore }

let now = ref (empty ())

let get_now () = !now
let set_now t = now := t

let init () = now := empty ()

let tick () =
  let t = !now in
  check t;
  let t' = { id = next_id (); next = t.next; cleanup = ignore } in
  t.next <- t';
  now := t';
  t'

let set_cleanup t cleanup =
  check t;
  t.cleanup <- cleanup

let add_cleanup t cleanup' =
  check t;
  let cleanup = t.cleanup in
  t.cleanup <- (fun () -> cleanup (); cleanup' ())

let splice_out t1 t2 =
  check t1;
  check t2;
  let rec loop t =
    match t.id with
      | -1 -> assert false
      | 0 -> raise (Invalid_argument "t1 >= t2")
      | id when id = t2.id -> ()
      | _ -> t.id <- -1; t.cleanup (); t.cleanup <- ignore; loop t.next in
  loop t1.next;
  t1.next <- t2

let compare t1 t2 =
  (*
    spliced-out timestamps are less than everything else

    by splicing out timestamps we disturb the heap invariant. I think
    this is benign; a spliced-out timestamp might not be the min of
    the heap when it should, but there's no harm in leaving it around
    since we just ignore it when it is the min.
  *)
  match t1.id, t2.id with
    | id1, id2 when id1 = id2 -> 0
    | -1, _ -> -1
    | _, -1 -> 1
    | _, _ ->
        let rec loop t =
          match t.id with
            | -1 -> assert false
            | 0 -> 1
            | id when id = t2.id -> -1
            | _ -> loop t.next in
        loop t1.next

let eq t1 t2 = t1.id = t2.id
