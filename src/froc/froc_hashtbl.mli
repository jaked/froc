(*
 * This file is part of froc, a library for functional reactive programming
 * Copyright (C) 2010 Jacob Donham
 * Based on hashtbl.mli in the OCaml distribution, Copyright (C) INRIA
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

(** Hash tables

    Hash tables are hashed association tables, with in-place modification.

    Froc_hashtbl differs from the stdlib Hashtbl in that [find] and
    [remove] take a predicate on the value, so they can be made to
    apply to specific bindings for a key.
*)

type ('a, 'b) t
  (** The type of hash tables from type ['a] to type ['b]. *)

val create : ?size:int -> ?hash:('a -> int) -> ?eq:('a -> 'a -> bool) -> unit -> ('a, 'b) t
  (**
     [create ()] creates a new, empty hash table. Optionally the
     initial [size] may be specified (default is 17), and [hash] and [eq]
     functions (as with [Hashtbl.make]).
  *)

val add : ('a, 'b) t -> 'a -> 'b -> unit
  (**
     [add tbl x y] adds a binding of [x] to [y] in table [tbl].
     Successive bindings are prepended to the list of previous
     bindings.
  *)

val find : ('a, 'b) t -> 'a -> ('b -> bool) -> 'b
  (**
     [find tbl x p] returns the latest binding of [x] in [tbl] such
     that [f x] is true, or raises [Not_found] if no such binding
     exists.
  *)

val remove : ('a, 'b) t -> 'a -> ('b -> bool) -> unit
  (**
     [remove tbl x] removes the latest binding of [x] in [tbl] such
     that [f x] is true.  It does nothing if [x] is not bound in
     [tbl].
  *)
