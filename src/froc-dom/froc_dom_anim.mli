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

type color
type point = float * float
type shape = Dom.canvasRenderingContext2D -> unit

val color : ?a:int -> int -> int -> int -> color

val fillRect : point -> float -> float -> color -> shape
val strokeRect : point -> float -> float -> color -> shape

val disk : point -> float -> color -> shape

val filled_poly : point list -> color -> shape

val attach : Dom.canvas -> shape list Froc.behavior -> unit
