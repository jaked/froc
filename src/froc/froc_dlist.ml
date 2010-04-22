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

type 'a t = {
  data : 'a;
  mutable prev : 'a t;
  mutable next : 'a t;
}

let empty () =
  let rec t = { data = Obj.magic None; prev = t; next = t } in
  t

let add_after t d =
  let n = { data = d; prev = t; next = t.next } in
  t.next.prev <- n;
  t.next <- n;
  n

let remove t =
  t.next.prev <- t.prev; t.prev.next <- t.next;
  t.next <- t; t.prev <- t

let iter f d =
  let rec loop t =
    if not (t == d)
    then (let next = t.next in f t.data; loop next) in
  loop d.next

let clear d =
  d.next <- d;
  d.prev <- d
