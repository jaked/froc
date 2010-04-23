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

type color = string
type point = float * float
type shape = Dom.canvasRenderingContext2D -> unit

let color ?a r g b =
    match a with
      | None -> Printf.sprintf "rgb(%d,%d,%d)" r g b
      | Some a -> Printf.sprintf "rgba(%d,%d,%d,%d)" r g b a

let disk (cx, cy) radius color : shape =
  (fun ctx ->
    ctx#_set_fillStyle color;
    ctx#beginPath;
    ctx#arc cx cy radius 0. (2. *. Javascript.Math.pi) true;
    ctx#fill)

let filled_poly points color : shape =
  (fun ctx ->
     ctx#_set_fillStyle color;
     ctx#beginPath;
     List.iter (fun (x, y) -> ctx#lineTo x y) points;
     ctx#closePath;
     ctx#fill)

let draw canvas instrs =
  let ctx = canvas#getContext "2d" in
  ctx#clearRect 0. 0. (float_of_int canvas#_get_width) (float_of_int canvas#_get_height);
  ListLabels.iter instrs ~f:(fun f ->
    ctx#save;
    f ctx;
    ctx#closePath;
    ctx#restore)

let attach
    (canvas : Dom.canvas)
    (instrsb : (Dom.canvasRenderingContext2D -> unit) list Froc.behavior) =
  let notify = function
    | Froc.Value instrs -> draw canvas instrs
    | Froc.Fail _ -> () (* XXX ? *) in
  (* maybe notify_b should notify when you first call it? *)
  notify (Froc.read_result instrsb);
  Froc.notify_result_b instrsb notify
