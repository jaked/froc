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

(**
   Timestamps

   Timestamps are ordered abstract values, arranged in a
   timeline. Timestamps can added and removed from the timeline,
   maintaining the order of those already in the timeline.

   The module maintains a global [now] representing the last-added
   timestamp.

   Cleanup functions can be attached to a timestamp, which are run
   when the timestamp is removed from the timeline.
*)

type t
  (** The type of timestamps *)

val init : unit -> unit
  (**
     Initialize the timestamp module. If already initialized,
     re-initialize, running all cleanup functions.
``*)

val tick : unit -> t
  (**
     Adds a new timestamp following [now] and returns it; [now] is
     updated to be the new timestamp.
  *)

val get_now : unit -> t
  (** Returns the current [now] timestamp *)

val set_now : t -> unit
  (**
     Sets the current [now] timestamp. Subsequent calls to [tick] add
     timestamps after [now] and before [now]'s successor.
  *)

val add_cleanup : t -> (unit -> unit) -> unit
  (**
     [add_cleanup t f] attaches a function to [t] which is run when
     [t] is removed.
  *)

val splice_out : t -> t -> unit
  (**
     [splice_out s e] removes the timestamps between [s] and [e], not
     including [s] and [e] themselves. It is an error if [e] occurs
     before [s] or if [e] and [s] are the same timestamp.
  *)

val is_spliced_out : t -> bool
  (**
     [is_spliced_out t] is true if [t] has been removed from the
     timeline.
  *)

val compare : t -> t -> int
  (**
     [compare t1 t2] returns [-1] if [t1] occurs before [t2], [1] if
     [t1] occurs after [t2], or [0] if [t1] and [t2] are the same
     timestamp.
  *)

val eq : t -> t -> bool
  (**
     [eq t1 t2] returns true iff [t1] and [t2] are the same timestamp.
  *)

val set_debug : (string -> unit) -> unit
