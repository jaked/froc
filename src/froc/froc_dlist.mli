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

(** Double-linked lists. *)

type 'a t = private {
  data : 'a;
  mutable prev : 'a t;
  mutable next : 'a t;
}

val empty : unit -> 'a t
  (** Returns a new list consisting of a dummy element; [data] is invalid. *)

val add_after : 'a t -> 'a -> 'a t
  (** [add_after t v] inserts [v] after [t] and returns the new link. *)

val add_before : 'a t -> 'a -> 'a t
  (** [add_before t v] inserts [v] before [t] and returns the new link. *)

val remove : 'a t -> unit
  (** [remove t] removes [t] from the list it is linked into. *)

val iter : ('a -> unit) -> 'a t -> unit
  (**
     [iter f t] calls [f] on each element of [t]. The first element
     is skipped; it is expected that [iter] is called on the dummy
     element returned from [empty].
  *)
