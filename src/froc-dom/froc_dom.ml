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

let (|>) x f = f x

open Froc

let ticks_b msb =
  let e, s = make_event () in
  let id = ref None in
  let clear () =
    match !id with Some i -> Dom.window#clearInterval i; id := None | _ -> () in
  let set_interval r =
    clear ();
    match r with
      | Value p -> id := Some (Dom.window#setInterval (fun () -> send s ()) p)
      | Fail _ -> () (* ? *) in
  cleanup clear;
  notify_result_b msb set_interval;
  e

let ticks ms =
  let e, s = make_event () in
  let id = Dom.window#setInterval (fun () -> send s ()) ms in
  cleanup (fun () -> Dom.window#clearInterval id);
  e

type 'a link = {
  l_val : 'a;
  mutable l_next : 'a link;
}

(* ensure we send delayed events in the same order they arrived *)
let send_delayed_event e de =
  let rec send de =
    if not (de.l_next == de)
    then begin
      send_result_deferred e de.l_val;
      let de_next = de.l_next in de.l_next <- de;
      send de_next;
    end in
  send de

let delay_eb t msb =
  let e, s = make_event () in
  let rec de = { l_val = Fail Exit; l_next = de } in
  let de_next = ref de in
  notify_result_e t begin fun r ->
    match sample_result msb with
      | Fail _ as r ->
          de_next := { l_val = r; l_next = !de_next};
          send_delayed_event s !de_next
      | Value ms ->
          let de = { l_val = r; l_next = !de_next } in
          de_next := de;
          ignore (Dom.window#setTimeout (fun () -> send_delayed_event s de) ms)
  end;
  e

let delay_e t ms = delay_eb t (return ms)

let delay_bb t msb =
  t |> changes |> (fun e -> delay_eb e msb) |> hold_result (sample_result t)

let delay_b t ms = delay_bb t (return ms)

let mouse_e () =
  let e, s = make_event () in
  let f me = send s (me#_get_clientX, me#_get_clientY) in
  Dom.document#addEventListener_mouseEvent_ "mousemove" f false;
  cleanup (fun () -> Dom.document#addEventListener_mouseEvent_ "mousemove" f false);
  e

let mouse_b () = hold (0, 0) (mouse_e ())

let input_value_e input =
  let e, s = make_event () in
  let f _ = send s input#_get_value in
  input#addEventListener "change" f false;
  cleanup (fun () -> input#addEventListener "change" f false);
  e

let input_value_b input = hold input#_get_value (input_value_e input)

let attach_innerHTML_e el e = notify_e e (fun s -> el#_set_innerHTML s)
let attach_innerHTML_b el b = notify_b b (fun s -> el#_set_innerHTML s)

let attach_input_value_e i e = notify_e e (fun v -> i#_set_value v)
let attach_input_value_b i b = notify_b b (fun v -> i#_set_value v)

let attach_backgroundColor_e el e = notify_e e (fun v -> el#_get_style#_set_backgroundColor v)
let attach_backgroundColor_b el b = notify_b b (fun v -> el#_get_style#_set_backgroundColor v)

let attach_display_e el e = notify_e e (fun v -> el#_get_style#_set_display v)
let attach_display_b el b = notify_b b (fun v -> el#_get_style#_set_display v)

let attach_fontSize_e el e = notify_e e (fun v -> el#_get_style#_set_fontSize v)
let attach_fontSize_b el b = notify_b b (fun v -> el#_get_style#_set_fontSize v)

let node_of_result = function
  | Value v -> (v :> Dom.node)
  | Fail e -> (* ? *)
      let s = (Dom.document#createElement "span" :> Dom.node) in
      let t = (Dom.document#createTextNode ("exception") :> Dom.node) in (* XXX get Printexc working *)
      ignore (s#appendChild t);
      s

let appendChild n nb =
  let n = (n :> Dom.node) in
  let old = ref None in
  let update r =
    let c = node_of_result r in
    ignore
      (match !old with
        | None -> n#appendChild c
        | Some oc -> n#replaceChild c oc);
    old := Some c in
  notify_result_b nb update

let replaceNode n nb =
  let n = (n :> Dom.node) in
  let p = (n#_get_parentNode : Dom.node) in
  let old = ref n in
  let update r =
    let c = node_of_result r in
    ignore (p#replaceChild c !old);
    old := c in
  notify_result_b nb update

let event name (elem : #Dom.element) =
  let e, s = make_event () in
  let f = send s in
  elem#addEventListener name f false;
  cleanup (fun () -> elem#removeEventListener name f false);
  e

let mouseEvent name (elem : #Dom.element) =
  let e, s = make_event () in
  let f = send s in
  elem#addEventListener_mouseEvent_ name f false;
  cleanup (fun () -> elem#removeEventListener_mouseEvent_ name f false);
  e

let keyEvent name (elem : #Dom.element) =
  let e, s = make_event () in
  let f = send s in
  elem#addEventListener_keyEvent_ name f false;
  cleanup (fun () -> elem#removeEventListener_keyEvent_ name f false);
  e

let clicks (elem : #Dom.element) = event "click" elem
