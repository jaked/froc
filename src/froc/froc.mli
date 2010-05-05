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

(** Functional reactive programming *)
(**
   {2 Overview}

   [Froc] implements functional reactive programming in the style of
   FrTime / Flapjax (but typed of course). It uses the dynamic
   dependency graph of Acar et al. (self-adjusting
   computation). Behaviors are presented as monadic values, using
   ideas from [Lwt].

   A {e behavior} is a value that can change over time, but is defined
   at all times. An {e event} is defined only at particular instants
   in time, with a possibly different value at each instance; when an
   event takes value [v] we say it {e occurs with value} [v] or {e
   fires} [v]. Values are sent to an event using the associated {e
   event sender}. A behavior or an event is a {e signal} when we don't
   care to specify which one it is, and we say a signal "changes" to
   mean that it changes if it is a behavior or occurs if it is an
   event.

   Most of the functions in [Froc] create a new signal from one or
   more existing signals. The output signals are {e dependents} of the
   input signals and the inputs are the {e dependencies} of the
   outputs. When a signal changes, its dependents are updated
   (according to some update function specific to the signal). The
   dependencies of a signal are updated before the signal is updated,
   so that the update function sees a consistent view of the
   dependencies. Signals may have {e listeners} which are {e notified}
   when the signal changes. Listeners are like dependents but don't
   compute new signals; they are just functions, called for their
   effect.

   When an event is sent (with [send]), an {e update cycle} begins,
   during which the transitive dependents of the initial event are
   updated, and their listeners notified. It is not allowed to call
   [send] again until the update cycle is finished, but
   [send_deferred] may be called, which queues the event. Queued
   events are processed (each in a new update cycle) following each
   update cycle until the queue is empty. Events occurring in the same
   update cycle are {e simultaneous}.

   The body of a listener or update function (such as the function
   passed to [bind]) delimits a {e dynamic scope}, which is {e
   governed} by the signals to which it is attached. When a signal
   changes, listeners and dependents attached within the dynamic
   scopes it governs are detached, and any attached [cleanup]
   functions are called. This cleanup allows unneeded values to be
   garbage collected, and also prevents them from being recomputed
   unnecessarily or erroneously. Dynamic scopes are nested; cleaning
   up an enclosing scope cleans up its enclosed scopes. Attachments
   created outside any dynamic scope can only be detached by calling
   [init].

   Ordinarily, the entirety of a dynamic scope is cleaned up when its
   governing signal changes. A dynamic scope may be partially cleaned
   up using a {e memo function} (see [memo]). It is possible (though
   not encouraged) to hold a reference to a signal (by storing it in a
   [ref], for instance) after it has been detached from its
   dependencies; a detached signal is not updated when its
   dependencies change.

   Most functions returning behaviors take an optional [eq] argument,
   which gives an equality function on the value of the resulting
   behavior. A behavior's dependents are only updated when the
   behavior is updated with a value which is not equal (according to
   the equality function) to the old value. The default equality holds
   if the values [compare] to [0] (incomparable values are always not
   equal). It is encouraged that behaviors of the same type always be
   given the same equality.
*)

(** Type of values of type ['a] or exception. *)
type +'a result = Value of 'a | Fail of exn

type cancel
  (** Type of handles to listener registrations. *)

(** {2 Behaviors} *)

type +'a behavior
  (** Type of behaviors of type ['a]. *)

val return : 'a -> 'a behavior
  (**
     [return v] is a constant behavior with value [v].
  *)

val fail : exn -> 'a behavior
  (**
     [fail e] is a constant behavior that fails with the exception [e].
  *)

val bind : ?eq:('b -> 'b -> bool) -> 'a behavior -> ('a -> 'b behavior) -> 'b behavior
  (**
     [bind b f] behaves as [f] applied to the value of [b]. If [b]
     fails, [bind b f] also fails, with the same exception. The update
     function [f] delimits a dynamic scope governed by [b].
  *)

val (>>=) : 'a behavior -> ('a -> 'b behavior) -> 'b behavior
  (**
     [b >>= f] is an alternative notation for [bind b f].
  *)

val blift : ?eq:('b -> 'b -> bool) -> 'a behavior -> ('a -> 'b) -> 'b behavior
  (**
     [blift b ?eq f] is equivalent to [bind b (fun v -> return ?eq (f v))],
     but is slightly more efficient.
  *)

val lift : ?eq:('b -> 'b -> bool) -> ('a -> 'b) -> 'a behavior -> 'b behavior
  (**
     [lift ?eq f b] is equivalent to [blift b ?eq f]; it can be
     partially applied to lift a function to the monad without yet
     binding it to a behavior.
  *)

val sample : 'b behavior -> 'b
  (**
     [sample b] returns the current value of [b], or raises [b]'s
     exception if it is failed.
  *)

val sample_result : 'b behavior -> 'b result
  (**
     Same as [sample] but returns a result.
  *)

val catch : ?eq:('a -> 'a -> bool) -> (unit -> 'a behavior) -> (exn -> 'a behavior) -> 'a behavior
  (**
     [catch bf f] behaves the same as [bf()] if [bf()] succeeds. If
     [bf()] fails with some exception [e], [catch bf f] behaves as [f
     e]. The function [f] delimits a dynamic scope governed by [bf()].
  *)

val catch_lift : ?eq:('a -> 'a -> bool) -> (unit -> 'a behavior) -> (exn -> 'a) -> 'a behavior
  (**
     [catch_lift bf ?eq f] is equivalent to [catch bf (fun e -> return
     ?eq (f e))], but is slightly more efficient.
  *)

val try_bind : ?eq:('b -> 'b -> bool) -> (unit -> 'a behavior) -> ('a -> 'b behavior) -> (exn -> 'b behavior) -> 'b behavior
  (**
     [try_bind bf f g] behaves as [bind (bf()) f] if [bf()]
     succeeds. If [bf()] fails with exception [e], [try_bind b f g]
     behaves as [g e]. The functions [f] and [g] each delimit a
     dynamic scope governed by [bf()].
  *)

val try_bind_lift : ?eq:('b -> 'b -> bool) -> (unit -> 'a behavior) -> ('a -> 'b) -> (exn -> 'b) -> 'b behavior
  (**
     [try_bind_lift bf ?eq f g] is equivalent to [try_bind bf (fun v ->
     return ?eq (f v)) (fun e -> return ?eq (g e))], but is slightly
     more efficient.
  *)

val join_b : ?eq:('a -> 'a -> bool) -> 'a behavior behavior -> 'a behavior
  (** [join_b b] behaves as whichever behavior is currently the value of [b]. *)

val fix_b : ?eq:('a -> 'a -> bool) -> ('a behavior -> 'a behavior) -> 'a behavior
  (**
     [fix_b bf] returns [bf b'] where [b'] behaves like [bf b'], but
     delayed one update cycle.
  *)

val notify_b : ?current:bool -> 'a behavior -> ('a -> unit) -> unit
  (**
     [notify_b b f] adds [f] as a listener for [b], which is called
     whenever [b] changes. When [b] fails the listener is not
     called. The notification is cancelled when the enclosing dynamic
     scope is cleaned up.
     
     The listener is called immediately with the current value of the
     behavior, unless [current] is false. The function [f] delimits a
     dynamic scope governed by [b].
  *)

val notify_b_cancel : ?current:bool -> 'a behavior -> ('a -> unit) -> cancel
  (**

     Same as [notify_b], and returns a cancel handle (the notification
     is still cancelled when the enclosing dynamic scope is cleaned up).
  *)

val notify_result_b : ?current:bool -> 'a behavior -> ('a result -> unit) -> unit
  (**
     Same as [notify_b] but the listener is called with a result when
     the value changes or when the behavior fails.
  *)

val notify_result_b_cancel : ?current:bool -> 'a behavior -> ('a result -> unit) -> cancel
  (**
     Same as [notify_result_b], and returns a cancel handle (the
     notification is still cancelled when the enclosing dynamic scope
     is cleaned up).
  *)

val hash_behavior : 'a behavior -> int
  (**
     A hash function for behaviors. [Hashtbl.hash] is not appropriate
     because behaviors contain mutable data.
  *)

(** {2 Events} *)

type +'a event
  (** Type of events taking values of type ['a]. *)

type -'a event_sender
  (** Type of event senders sending values of type ['a]. *)

val make_event : unit -> 'a event * 'a event_sender
  (** Makes a new event taking values of type ['a]. *)

val never : 'a event
  (** An event which never occurs. *)

val notify_e : 'a event -> ('a -> unit) -> unit
  (**
     [notify_e e f] adds [f] as a listener for [e], which is called
     with [v] whenever [e] occurs with value [v].  When a failure
     occurs the listener is not called. The notification is cancelled
     when the enclosing dynamic scope is cleaned up.

     The function [f] delimits a dynamic scope governed by [b].
  *)

val notify_e_cancel : 'a event -> ('a -> unit) -> cancel
  (**
     Same as [notify_e], and returns a cancel handle (the notification
     is still cancelled when the enclosing dynamic scope is cleaned up).
  *)

val notify_result_e : 'a event -> ('a result -> unit) -> unit
  (**
     Same as [notify_e] but the listener is called with a result when
     a value or a failure is sent.
  *)

val notify_result_e_cancel : 'a event -> ('a result -> unit) -> cancel
  (**
     Same as [notify_result_e], and returns a cancel handle (the
     notification is still cancelled when the enclosing dynamic scope
     is cleaned up).
  *)

val send : 'a event_sender -> 'a -> unit
  (**
     [send s v] sends the value [v] to the associated event [e], so
     [e] occurs with value [v].
  *)

val send_exn : 'a event_sender -> exn -> unit
  (**
     [send_exn s x] sends the failure [x] to the associated event [e],
     so [e] occurs with failure [x].
  *) 

val send_result : 'a event_sender -> 'a result -> unit
  (**
     [send_result s r] sends the result [r] to the associated event
     [e], so [e] occurs with result [r].
  *)

val send_deferred : 'a event_sender -> 'a -> unit
  (**
     [send_deferred s v] enqueues a call to [send s v] for a future
     update cycle.
  *) 

val send_exn_deferred : 'a event_sender -> exn -> unit
  (**
     [send_exn_deferred s x] enqueues a call to [send_exn s x] for a
     future update cycle.
  *) 

val send_result_deferred : 'a event_sender -> 'a result -> unit
  (**
     [send_result_deferred s r] enqueues a call to [send_result s r]
     for a future update cycle.
  *)

val next : 'a event -> 'a event
  (**
     [next e] passes on only the next occurence of [e]; subsequent
     occurrences are dropped.
  *)

val merge : 'a event list -> 'a event
  (**
     [merge es] occurs whenever any of the events in [es] occurs. If
     more than one of the [es] occurs simultaneously, the earliest one
     in the list is passed on.
  *)

val map : ('a -> 'b) -> 'a event -> 'b event
  (**
     [map f e] is an event that fires [f v] whenever [e] fires
     [v]. The function [f] delimits a dynamic scope governed by [e].
  *)

val filter : ('a -> bool) -> 'a event -> 'a event
  (**
     [filter p e] is an event that fires [v] whenever [e] fires [v]
     and [p v] is true. The function [p] delimits a dynamic scope
     governed by [e].
  *)

val collect : ('b -> 'a -> 'b) -> 'b -> 'a event -> 'b event
  (**
     [collect f b e] is an event that maintains an internal state [s]
     (initialized to [b]); whenever [e] fires [v], [s'] becomes [f s
     v], the event fires [s'], and [s'] becomes the new internal
     state. The function [f] delimits a dynamic scope governed by [e].

     Special care must be taken when using [collect] with behavior- or
     event-valued events. The dynamic scope delimited by [f] is
     cleaned up on each occurrence of [e]; any signals or created in
     [f] become detached on the next occurrence, so it is easy to wind
     up with detached signals in [s].

     This cleanup may be controlled through the use of [memo].
  *)

val join_e : 'a event event -> 'a event
  (**
     [join_e ee] occurs whenever the event which last occurred on [ee]
     occurs.
  *)

val fix_e : ('a event -> 'a event) -> 'a event
  (**
     [fix_e ef] returns [ef e'] where [e'] is an event that occurs
     whenever [ef e'] occurs, but in the next update cycle.
  *)

val hash_event : 'a event -> int
  (**
     A hash function for events. [Hashtbl.hash] is not appropriate
     because events contain mutable data.
  *)

(** {2 Combinations} *)

val switch : ?eq:('a -> 'a -> bool) -> 'a behavior -> 'a behavior event -> 'a behavior
  (**
     [switch b e] behaves as [b] until [e] occurs, then behaves as the
     last value of [e].
  *)

val until : ?eq:('a -> 'a -> bool) -> 'a behavior -> 'a behavior event -> 'a behavior
  (**
     [until b e] behaves as [b] until [e] occurs with value [b'], then
     behaves as [b'].
  *)

val hold : ?eq:('a -> 'a -> bool) -> 'a -> 'a event -> 'a behavior
  (**
     [hold v e] takes on the last value which occurred on [e], or
     [v] if [e] has not yet occurred (since [hold] was called).
  *)

val hold_result : ?eq:('a -> 'a -> bool) -> 'a result -> 'a event -> 'a behavior
  (**
     Same as [hold] but initialized with a result.
  *)

val changes : 'a behavior -> 'a event
  (**
     [changes b] occurs with the value of [b] whenever [b] changes.
  *)

val when_true : bool behavior -> unit event
  (** [when_true b] fires whenever [b] becomes true. *)

val count : 'a event -> int behavior
  (**
     [count e] takes on the number of times [e] has occurred (since
     [count] was called).
  *)

val make_cell : 'a -> 'a behavior * ('a -> unit)
  (**
     [make_cell v] returns a behavior (with initial value [v]) and a
     setter function which changes the behavior's value. The setter
     enqueues the update for a future update cycle, so it may be used
     freely.
  *)

(** {2 Other} *)

val init : unit -> unit
  (** Initialize the library; can be called again to reinitialize. *)

val no_cancel : cancel
  (** Dummy cancel. *)

val cancel : cancel -> unit
  (** Cancels a listener registration using the given handle. *)

val cleanup : (unit -> unit) -> unit
  (**
     [cleanup f] attaches [f] to the enclosing dynamic scope, so it is
     called when the scope is cleaned up. This is useful for cleaning
     up external resources, such as GUI event handlers.
  *)

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
     calls [f x] in a new dynamic scope, and stores its value for
     possible reuse. On a hit, [f' x] returns the value of the
     previous call, and any updates necessary to make the value
     consistent are executed; the dynamic scope of the previous call
     is {e not} cleaned up (so that the value remains attached to its
     dependencies).

     The main point of [memo] is to avoid needless recomputation in
     cases where a computation is governed by some signal but does not
     actually use the signal's value. For example, in {[
       let g = memo () fun x -> ... in
       b >>= fun _ -> g 7
     ]} the returned behavior is indifferent to the value of
     [b]. Without [memo] it would be recomputed every time [b]
     changes; with [memo] it is computed only the first time.

     Because the dynamic scope of the previous call is not cleaned up
     on a memo hit, [memo] can be used purely to protect signals and
     listeners from being detached when their governing signals
     change. See the [quickhull] example for an instance of this use.

     The unit argument makes it possible to memoize a recursive
     function, using the following idiom: {[
       let m = memo () in (* creates the memo table *)
       let rec f x = ... memo f y in
       let f x = memo f x
     ]}

     The default hash function is not appropriate for behaviors and
     events (since they contain mutable data); [hash_behavior] and
     [hash_event] should be used instead.
  *)

(** {2 Debugging} *)

val set_exn_handler : (exn -> unit) -> unit
  (**
     Set an exception handler which is called on exceptions from
     listeners.
  *)

val set_debug : (string -> unit) -> unit
  (** Set a function for showing library debugging. *)

(** {2 Variations} *)

val bind2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior ->
  ('a1 -> 'a2 -> 'b behavior) ->
  'b behavior
val blift2 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior ->
  ('a1 -> 'a2 -> 'b) ->
  'b behavior
val lift2 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'b) ->
  'a1 behavior -> 'a2 behavior ->
  'b behavior

val bind3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'b behavior) ->
  'b behavior
val blift3 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'b behavior
val lift3 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'b) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior ->
  'b behavior

val bind4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b behavior) ->
  'b behavior
val blift4 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'b behavior
val lift4 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'b) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior ->
  'b behavior

val bind5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b behavior) ->
  'b behavior
val blift5 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'b behavior
val lift5 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'b) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior ->
  'b behavior

val bind6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b behavior) ->
  'b behavior
val blift6 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'b behavior
val lift6 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'b) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior ->
  'b behavior

val bind7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior -> 'a7 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b behavior) ->
  'b behavior
val blift7 :
  ?eq:('b -> 'b -> bool) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior -> 'a7 behavior ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'b behavior
val lift7 :
  ?eq:('b -> 'b -> bool) ->
  ('a1 -> 'a2 -> 'a3 -> 'a4 -> 'a5 -> 'a6 -> 'a7 -> 'b) ->
  'a1 behavior -> 'a2 behavior -> 'a3 behavior -> 'a4 behavior -> 'a5 behavior -> 'a6 behavior -> 'a7 behavior ->
  'b behavior

val bindN : ?eq:('b -> 'b -> bool) -> 'a behavior list -> ('a list -> 'b behavior) -> 'b behavior
val bliftN : ?eq:('b -> 'b -> bool) -> 'a behavior list -> ('a list -> 'b) -> 'b behavior
val liftN : ?eq:('b -> 'b -> bool) -> ('a list -> 'b) -> 'a behavior list -> 'b behavior
