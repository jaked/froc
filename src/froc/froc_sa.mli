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

(** Self-adjusting computation *)
(**
   {2 Overview}

   [Froc_sa] implements {e self-adjusting computation} following
   Acar et al. Changeable values are presented as a monad, using ideas
   from [Lwt].

   A {e changeable} is a value that can change over time. New
   changeables may be created from existing ones using [bind] or one
   of its variants. When a changeable changes, the changeables which
   depend on it are updated by running their update functions
   (i.e. the function passed to [bind]). The dependencies of a
   changeable are updated before the changeable is updated, so that
   the update function sees a consistent view of the dependencies.

   Self-adjusting computation proceeds in phases: after an initial
   computation, call [write] to change some inputs, then [propagate]
   to make the result consistent again.

   Most functions returning changeables take an optional [eq]
   argument, which gives an equality function on the value of the
   resulting changeable. A changeable is considered to have changed
   only when updated with a value which is not equal (according to the
   equality function) to the old value. The default equality holds if
   the values [compare] to [0] (incomparable values are always not
   equal). It is encouraged that changeables of the same type always
   be given the same equality.
*)

val init : unit -> unit
  (** Initialize the library; can be called again to reinitialize. *)

(** {2 Changeables} *)

type +'a t
    (** Type of changeables of type ['a]. *)
type -'a u
    (** Type of writeables of type ['a]. *)

val changeable : ?eq:('a -> 'a -> bool) -> 'a -> 'a t * 'a u
  (**
     [changeable v] is a changeable with initial value [v].
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
     [catch cf f] behaves the same as [cf()] if [cf()] succeeds. If
     [cf()] fails with some exception [e], [catch cf f] behaves as [f
     e].
  *)

val catch_lift : ?eq:('a -> 'a -> bool) -> (unit -> 'a t) -> (exn -> 'a) -> 'a t
  (**
     [catch_lift cf ?eq f] is equivalent to [catch cf (fun e -> return
     ?eq (f e))], but is slightly more efficient.
  *)

val try_bind : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b t) -> (exn -> 'b t) -> 'b t
  (**
     [try_bind cf f g] behaves as [bind (cf()) f] if [cf()] succeeds. If
     [cf()] fails with exception [e], [try_bind cf f g] behaves as [g
     e].
  *)

val try_bind_lift : ?eq:('b -> 'b -> bool) -> (unit -> 'a t) -> ('a -> 'b) -> (exn -> 'b) -> 'b t
  (**
     [try_bind_lift cf ?eq f g] is equivalent to [try_bind cf (fun v ->
     return ?eq (f v)) (fun e -> return ?eq (g e))], but is slightly
     more efficient.
  *)

val read : 'a t -> 'a
  (**
     [read c] returns the value of [c], or raises an exception if [c] fails.
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

     [memo f] creates a memo function [f'] from [f]. When [f' x] is
     called from within an update function, there may be either a hit
     or a miss. A hit happens when some [f' x'] was called in the
     previous run of the update function, when [eq x x'], and no later
     call has already hit (that is, hits must happen in the same order
     as the calls happened in the previous run). On a miss, [f' x]
     calls [f x] and stores its value for possible reuse. On a hit,
     [f' x] returns the value of the previous call, and any updates
     necessary to make the value consistent are executed.

     The main point of [memo] is to avoid needless recomputation in
     cases where a computation is executed in an update function for
     some changeable, but does not actually use the changeables's
     value. For example, in {[
       let g = memo () fun x -> ... in
       c >>= fun _ -> g 7
     ]} the returned changeable is indifferent to the value of
     [c]. Without [memo] it would be recomputed every time [c]
     changes; with [memo] it is computed only the first time.

     The unit argument makes it possible to memoize a recursive
     function, using the following idiom: {[
     let m = memo () in (* creates the memo table *)
       let rec f x = ... m f y in
       let f x = m f x
     ]}

     The default hash function is not appropriate for changeables
     (since they contain mutable data); [hash] should be used
     instead.
  *)

val hash : 'a t -> int
  (** A hash function for changeables, *)

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
