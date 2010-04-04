(*
 * This file is part of froc, a library for functional reactive programming
 * Copyright (C) 2010 Jacob Donham
 * Based on hashtbl.ml in the OCaml distribution, Copyright (C) INRIA
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

type ('a, 'b) t = {
  hash : 'a -> int;
  eq : 'a -> 'a -> bool;
  mutable size : int;
  mutable data : ('a, 'b) bucketlist array
}

and ('a, 'b) bucketlist =
    Empty
  | Cons of 'a * 'b * ('a, 'b) bucketlist

let create ?(size = 17) ?(hash = Hashtbl.hash) ?(eq = (=)) () =
  let s = min (max 1 size) Sys.max_array_length in
  { hash = hash; eq = eq; size = 0; data = Array.make s Empty }

let resize tbl =
  let odata = tbl.data in
  let osize = Array.length odata in
  let nsize = min (2 * osize + 1) Sys.max_array_length in
  if nsize <> osize then begin
    let ndata = Array.create nsize Empty in
    let rec insert_bucket = function
        Empty -> ()
      | Cons(key, data, rest) ->
          insert_bucket rest;
          let nidx = (tbl.hash key) mod nsize in
          ndata.(nidx) <- Cons(key, data, ndata.(nidx)) in
    for i = 0 to osize - 1 do
      insert_bucket odata.(i)
    done;
    tbl.data <- ndata;
  end

let add h key info =
  let i = (h.hash key) mod (Array.length h.data) in
  let bucket = Cons(key, info, h.data.(i)) in
  h.data.(i) <- bucket;
  h.size <- succ h.size;
  if h.size > Array.length h.data lsl 1 then resize h

let remove h key p =
  let rec remove_bucket = function
      Empty ->
        Empty
    | Cons(k, i, next) ->
        if compare k key = 0 && p i
        then begin h.size <- pred h.size; next end
        else Cons(k, i, remove_bucket next) in
  let i = (h.hash key) mod (Array.length h.data) in
  h.data.(i) <- remove_bucket h.data.(i)

let rec find_rec key p = function
    Empty ->
      raise Not_found
  | Cons(k, d, rest) ->
      if compare key k = 0 && p d then d else find_rec key p rest

let find h key p =
  match h.data.((h.hash key) mod (Array.length h.data)) with
    Empty -> raise Not_found
  | Cons(k1, d1, rest1) ->
      if compare key k1 = 0 && p d1 then d1 else
      match rest1 with
        Empty -> raise Not_found
      | Cons(k2, d2, rest2) ->
          if compare key k2 = 0 && p d2 then d2 else
          match rest2 with
            Empty -> raise Not_found
          | Cons(k3, d3, rest3) ->
              if compare key k3 = 0 && p d3 then d3 else find_rec key p rest3
