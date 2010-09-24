val direct : (unit -> 'a) -> 'a Froc.behavior
val read : 'a Froc.behavior -> 'a

val (~|) : (unit -> 'a) -> 'a Froc.behavior
val (~.) : 'a Froc.behavior -> 'a
