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

let debug = ref ignore
let set_debug f = debug := f

type t = {
  mutable id : int;
  mutable spliced_out : bool;
  mutable next : t;
  mutable prev : t;
  mutable cleanup : (unit -> unit) list;
}

let is_spliced_out t = t.spliced_out

let check t =
  if t.spliced_out
  then raise (Invalid_argument "spliced out timestamp")

let empty () =
  let rec h = { id = 0; spliced_out = false; next = t; prev = h; cleanup = [] }
  and t = { id = max_int; spliced_out = false; next = t; prev = h; cleanup = [] } in
  h

let timeline = ref (empty ())
let now = ref !timeline

let get_now () = !now
let set_now t = now := t

let init () =
  let rec loop t =
    if t != t.next
    then begin
      List.iter (fun c -> c ()) t.cleanup;
      loop t.next
    end in
  loop !timeline;
  timeline := empty ();
  now := !timeline

(*
  the following implements Bender et al.'s algorithm for order
  maintenance (the one-level version). see
  
    http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.9.198
*)

let tau_factor = 1.41421

let renumber t =
  let rec find_range lo hi mask tau count =
    let lo_id = lo.id land (lnot mask) in
    let hi_id = lo_id lor mask in
    let rec lo_loop lo count =
      let lo_prev = lo.prev in
      if lo_prev.id < lo_id || lo_prev.prev == lo_prev
      then lo, count
      else lo_loop lo_prev (count + 1) in
    let rec hi_loop hi count =
      let hi_next = hi.next in
      if hi_next.id > hi_id || hi_next.next == hi_next
      then hi, count
      else hi_loop hi_next (count + 1) in
    let lo, count = lo_loop lo count in
    let hi, count = hi_loop hi count in
    let size = mask + 1 in
    let density = float_of_int count /. float_of_int size in
    if density < tau
    then (lo, hi, lo_id, count, size)
    else
      let mask = mask * 2 + 1 in
      if mask = max_int then failwith "out of timestamps";
      find_range lo hi mask (tau /. tau_factor) count in
  let (lo, hi, lo_id, count, size) = find_range t t 1 (1. /. tau_factor) 1 in
  let incr = size / count in
  let rec ren_loop t id =
    t.id <- id;
    if t != hi then ren_loop t.next (id + incr) in
  ren_loop lo lo_id

let tick () =
  let t = !now in
  check t;
  let id =  t.id + (t.next.id - t.id) / 2 in
  let t' = { id = id; spliced_out = false; next = t.next; prev = t; cleanup = [] } in
  t.next.prev <- t';
  t.next <- t';
  if id = t.id
  then renumber t;
  now := t';
  t'

let add_cleanup t cleanup =
  check t;
  t.cleanup <- cleanup :: t.cleanup

let splice_out t1 t2 =
  check t1;
  check t2;
  if t1.id >= t2.id then raise (Invalid_argument "t1 >= t2");
  let rec loop t =
    if t == t2 then ()
    else begin
      List.iter (fun c -> c ()) t.cleanup;
      t.cleanup <- [];
      t.spliced_out <- true;
      loop t.next
    end in
  loop t1.next;
  t1.next <- t2;
  t2.prev <- t1

let compare t1 t2 =
  check t1;
  check t2;
  compare t1.id t2.id

let eq t1 t2 =
  check t1;
  check t2;
  t1 == t2
