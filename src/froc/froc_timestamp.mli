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

type t

val init : unit -> unit
val get_now : unit -> t
val set_now : t -> unit
val tick : unit -> t

val set_cleanup : t -> (unit -> unit) -> unit
val add_cleanup : t -> (unit -> unit) -> unit
val splice_out : t -> t -> unit
val is_spliced_out : t -> bool
val compare : t -> t -> int

val set_debug : (string -> unit) -> unit
