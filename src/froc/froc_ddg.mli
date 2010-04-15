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

(** Dynamic dependency graph underlying [Froc] and [Froc_sa]. *)

type +'a t
type -'a u

val changeable : ?eq:('a -> 'a -> bool) -> 'a -> 'a t * 'a u
val return : 'a -> 'a t
val fail : exn -> 'a t

val bind : ?eq:('b -> 'b -> bool) -> 'a t -> ('a -> 'b t) -> 'b t
val (>>=) : 'a t -> ('a -> 'b t) -> 'b t
val lift : ?eq:('b -> 'b -> bool) -> ('a -> 'b) -> 'a t -> 'b t 
val blift : ?eq:('b -> 'b -> bool) -> 'a t -> ('a -> 'b) -> 'b t

val catch : ?eq:('a -> 'a -> bool) -> (unit -> 'a t) -> (exn -> 'a t) -> 'a t
val try_bind : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b t) -> (exn -> 'b t) -> 'b t
val catch_lift : ?eq:('a -> 'a -> bool) -> (unit -> 'a t) -> (exn -> 'a) -> 'a t
val try_bind_lift : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b) -> (exn -> 'b) -> 'b t

type 'a result = Value of 'a | Fail of exn

val read : 'a t -> 'a
val read_result : 'a t -> 'a result
val write : 'a u -> 'a -> unit
val write_exn : 'a u -> exn -> unit
val write_result : 'a u -> 'a result -> unit

val notify : 'a t -> ('a result -> unit) -> unit
val cleanup : (unit -> unit) -> unit

val make_changeable : ?eq:('a -> 'a -> bool) -> ?result:'a result -> unit -> 'a t * 'a u
val make_constant : 'a result -> 'a t

val hash : 'a t -> int

val init : unit -> unit
val propagate : unit -> unit
val set_exn_handler : (exn -> unit) -> unit
val set_debug : (string -> unit) -> unit

val memo :
  ?size:int -> ?hash:('a -> int) -> ?eq:('a -> 'a -> bool) -> unit ->
  ('a -> 'b) ->
  ('a -> 'b)

val bind2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t ->
  ('a1 -> 'a2 -> 'b t) ->
  'b t
val lift2 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'b) ->
  'a1 t -> 'a2 t ->
  'b t
val blift2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t ->
  ('a1 -> 'a2 -> 'b) ->
  'b t

val bind3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  ('a1 -> 'a2 -> 'a3 -> 'b t) ->
  'b t
val lift3 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  'b t
val blift3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'b t

val bind4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b t) ->
  'b t
val lift4 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  'b t
val blift4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'b t

val bind5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b t) ->
  'b t
val lift5 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  'b t
val blift5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'b t

val bind6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b t) ->
  'b t
val lift6 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  'b t
val blift6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'b t

val bind7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b t) ->
  'b t
val lift7 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  'b t
val blift7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'b t

val bindN : ?eq:('b -> 'b -> bool) -> 'a t list -> ('a list -> 'b t) -> 'b t
val liftN : ?eq:('b -> 'b -> bool) -> ('a list -> 'b) -> 'a t list -> 'b t
val bliftN : ?eq:('b -> 'b -> bool) -> 'a t list -> ('a list -> 'b) -> 'b t
