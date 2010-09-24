open Froc_direct

let (e1 : unit Froc.event), s1 = Froc.make_event ()
let (e2 : unit Froc.event), s2 = Froc.make_event ()

let b1 = Froc.count e1
let b2 = Froc.count e2

let b3 = ~|(fun () -> ~.b1 + ~.b2)
(*
let b3 =
  Froc_direct.direct begin fun () ->
    Froc_direct.read b1 + Froc_direct.read b2
  end
*)

;;

prerr_endline (string_of_int (Froc.sample b3));
Froc.send s1 ();
prerr_endline (string_of_int (Froc.sample b3));
Froc.send s2 ();
prerr_endline (string_of_int (Froc.sample b3));
