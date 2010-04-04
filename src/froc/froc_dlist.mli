type 'a t = private {
  data : 'a;
  mutable prev : 'a t;
  mutable next : 'a t;
}

val empty : unit -> 'a t
val add_after : 'a t -> 'a -> 'a t
val add_before : 'a t -> 'a -> 'a t
val remove : 'a t -> unit
val iter : ('a -> unit) -> 'a t -> unit
