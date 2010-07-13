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

(* adapted from pa_lwt.ml in Lwt distribution, Copyright (C) 2009 Jérémie Dimino *)

open Camlp4
open Camlp4.PreCast
open Syntax

let gen_bind id l e =
  let _loc = Loc.ghost in

  (* XXX handle > 7 args; if we generate nested binds, must eval args up front like pa_lwt *)
  let body =
    List.fold_right
      (fun (_loc, p, _) e -> <:expr< fun $p$ -> $e$ >>)
      l
      e in

  let id =
    match List.length l with
      | 1 -> id
      | n -> id ^ string_of_int n in

  let bind =
    List.fold_left
      (fun e (_loc, _, e') -> <:expr< $e$ $e'$ >>)
      <:expr< Froc.$lid:id$ >>
      l in

  <:expr< $bind$ $body$ >>

EXTEND Gram
  GLOBAL: expr str_item;

    letb_binding:
      [ [ b1 = SELF; "and"; b2 = SELF -> b1 @ b2
        | p = patt; "="; e = expr -> [(_loc, p, e)]
        ] ];

    expr: LEVEL "top"
      [ [ "lbt"; l = letb_binding; "in"; e = expr LEVEL ";" -> gen_bind "bind" l e
        | "lft"; l = letb_binding; "in"; e = expr LEVEL ";" -> gen_bind "blift" l e
        ] ];
END
