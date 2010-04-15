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

(** Self-adjusting computation *)
(**
   {2 Overview}

   [Froc_sa] implements {e self-adjusting computation} following
   Acar et al. Changeable values are presented as a monad, using ideas
   from [Lwt].

   A {e changeable} is a monadic value that can change over
   time. Binding a changeable causes the binder to be made a
   dependency of the changeable, and to be re-executed when the
   changeable changes. A {e writeable} associated with a changeable is
   used to change a changeable.

   Self-adjusting computation proceeds in phases: after an initial
   computation, call [write] to change some inputs, then [propagate]
   to make the result consistent again.
*)

val init : unit -> unit
  (** Initialize the library. Must be called before any other function. *)

(** {2 Changeables} *)

type +'a t
    (** Type of changeables of type ['a]. *)
type -'a u
    (** Type of writeables of type ['a]. *)

val changeable : ?eq:('a -> 'a -> bool) -> 'a -> 'a t * 'a u
  (**
     [changeable v] is a changeable with initial value [v].

     The optional [eq] argument gives an equality function; a
     changeable is considered changed (and its dependencies notified)
     only if its new value is not [eq] to its old one. The default
     equality holds iff the values [compare] to [0] (incomparable
     values are always not equal).
  *)

val return : 'a -> 'a t
  (**
     [return v] is a constant changeable with value [v].
  *)

val fail : exn -> 'a t
  (**
     [fail e] is a constant changeable that fails with the exception [e].
  *)

val bind : ?eq:('b -> 'b -> bool) -> 'a t -> ('a -> 'b t) -> 'b t
  (**
     [bind c f] behaves as [f] applied to the value of [c]. If [c]
     fails, [bind c f] also fails, with the same exception.

     When the value of a changeable changes, all functions [f] bound to
     it are re-executed.
  *)

val (>>=) : 'a t -> ('a -> 'b t) -> 'b t
  (**
     [c >>= f] is an alternative notation for [bind c f].
  *)

val blift : ?eq:('b -> 'b -> bool) -> 'a t -> ('a -> 'b) -> 'b t
  (**
     [blift c ?eq f] is equivalent to [bind c (fun v -> return ?eq (f
     v))], but is slightly more efficient.
  *)

val lift : ?eq:('b -> 'b -> bool) -> ('a -> 'b) -> 'a t -> 'b t
  (**
     [lift ?eq f c] is equivalent to [blift c ?eq f]; it can be
     partially applied to lift a function to the monad without yet
     binding it to a changeable.
  *)

val catch : ?eq:('a -> 'a -> bool) -> (unit -> 'a t) -> (exn -> 'a t) -> 'a t
  (**
     [catch c f] behaves the same as [c()] if [c()] succeeds. If [c()]
     fails with some exception [e], [catch c f] behaves as [f e].
  *)

val catch_lift : ?eq:('a -> 'a -> bool) -> (unit -> 'a t) -> (exn -> 'a) -> 'a t
  (**
     [catch_lift c ?eq f] is equivalent to [catch c (fun e -> return
     ?eq (f e))], but is slightly more efficient.
  *)

val try_bind : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b t) -> (exn -> 'b t) -> 'b t
  (**
     [try_bind c f g] behaves as [bind (c()) f] if [c()] succeeds. If
     [c()] fails with exception [e], [try_bind c f g] behaves as [g
     e].
  *)

val try_bind_lift : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b) -> (exn -> 'b) -> 'b t
  (**
     [try_bind_lift c ?eq f g] is equivalent to [try_bind c (fun v ->
     return ?eq (f v)) (fun e -> return ?eq (g e))], but is slightly
     more efficient.
  *)

val read : 'a t -> 'a
  (**
     [read c] returns the value of [c], or raises an exception if [c] fails.

     You shouldn't call [read] in the context of a binder, since you
     might get a stale result.
  *)

val write : 'a u -> 'a -> unit
  (**
     [write w v] updates the value of the associated changeable
     [c]. Changeables that depend on [c] will not be consistent until
     you call [propagate].
  *)

val write_exn : 'a u -> exn -> unit
  (**
     [write_exn w e] updates the associated changeable [c] to fail
     with exception [e]. Changeables that depend on [c] will not be
     consistent until you call [propagate].
  *)

val propagate : unit -> unit
  (** Process any outstanding changes so all changeables are consistent. *)

val memo :
  ?size:int -> ?hash:('a -> int) -> ?eq:('a -> 'a -> bool) -> unit ->
  ('a -> 'b) ->
  ('a -> 'b)
  (**
     [memo f] creates a {e memo function} from [f]. Calls to the memo
     function are memoized and may be reused when the calling context
     is re-executed.

     [memo] does not provide general-purpose memoization; calls may be
     reused only within the calling context in which they originally
     occurred, and only in the original order they occurred.

     To memoize a recursive function, use the following idiom: {[
       let m = memo () in
       let rec f x = ... memo f y in
       let f x = memo f x
     ]}
  *)

(** {2 Variations} *)

val bindN : ?eq:('b -> 'b -> bool) -> 'a t list -> ('a list -> 'b t) -> 'b t
val liftN : ?eq:('b -> 'b -> bool) -> ('a list -> 'b) -> 'a t list -> 'b t
val liftN : ?eq:('b -> 'b -> bool) -> ('a list -> 'b) -> 'a t list -> 'b t

val bind2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t ->
  ('a1 -> 'a2 -> 'b t) ->
  'b t
val blift2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t ->
  ('a1 -> 'a2 -> 'b) ->
  'b t
val lift2 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'b) ->
  'a1 t -> 'a2 t ->
  'b t

val bind3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  ('a1 -> 'a2 -> 'a3 -> 'b t) ->
  'b t
val blift3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'b t
val lift3 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t ->
  'b t

val bind4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b t) ->
  'b t
val blift4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'b t
val lift4 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t ->
  'b t

val bind5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b t) ->
  'b t
val blift5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'b t
val lift5 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t ->
  'b t

val bind6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b t) ->
  'b t
val blift6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'b t
val lift6 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t ->
  'b t

val bind7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b t) ->
  'b t
val blift7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'b t
val lift7 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'a1 t -> 'a2 t -> 'a3 t -> 'a4 t -> 'a5 t -> 'a6 t -> 'a7 t ->
  'b t

(** {2 Debugging} *)

val set_debug : (string -> unit) -> unit
  (** Set a function for showing library debugging. *)
