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

type ('a, 'b) t

val create : ?size:int -> ?hash:('a -> int) -> ?eq:('a -> 'a -> bool) -> unit -> ('a, 'b) t

val add : ('a, 'b) t -> 'a -> 'b -> unit

val find : ('a, 'b) t -> 'a -> ('b -> bool) -> 'b

val remove : ('a, 'b) t -> 'a -> ('b -> bool) -> unit
