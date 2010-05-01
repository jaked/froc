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

val ticks : float -> unit Froc.event
val ticks_b : float Froc.behavior -> unit Froc.event

val delay_e : 'a Froc.event -> float -> 'a Froc.event
val delay_eb : 'a Froc.event -> float Froc.behavior -> 'a Froc.event
val delay_b : 'a Froc.behavior -> float -> 'a Froc.behavior
val delay_bb : 'a Froc.behavior -> float Froc.behavior -> 'a Froc.behavior

val mouse_e : unit -> (int * int) Froc.event
val mouse_b : unit -> (int * int) Froc.behavior

val attach_innerHTML : #Dom.element -> string Froc.behavior -> unit

val input_value_e : #Dom.input -> string Froc.event
val input_value_b : #Dom.input -> string Froc.behavior
val attach_input_value_e : #Dom.input -> string Froc.event -> unit
val attach_input_value_b : #Dom.input -> string Froc.behavior -> unit

val attach_backgroundColor_e : #Dom.element -> string Froc.event -> unit
val attach_backgroundColor_b : #Dom.element -> string Froc.behavior -> unit

val appendChild : #Dom.node -> #Dom.node Froc.behavior -> unit
val replaceNode : #Dom.node -> #Dom.node Froc.behavior -> unit

val clicks : #Dom.element -> unit Froc.event
