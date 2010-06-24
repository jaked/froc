module D = Dom
module F = Froc
module Fd = Froc_dom
module Fda = Froc_dom_anim

let (|>) x f = f x

(* DEFINE DEBUG *)

IFDEF DEBUG
THEN
class type console =
object
  method log : string -> unit
end
let console = (Ocamljs.var "console" : console)
ENDIF

(* DEFINE STATS *)

IFDEF STATS
THEN
module S = 
struct
  let ticks = ref 0
  let maps = ref 0
  let filters = ref 0
  let maxs = ref 0
end
ENDIF

(* DEFINE FIXED_RANDOM *)

IFDEF FIXED_RANDOM
THEN
module Random =
struct
  let int = Random.int

  let a = [|
    1.; 2.; 3.; 4.; 1.; 2.; 3.; 4.; 1.; 2.; 3.; 4.; 1.; 2.; 3.; 4.; 1.; 2.; 3.; 4.; 1.; 2.; 3.; 4.;
  |]
  let ai = ref 0
  let b = [|
    100.; 200.; 300.; 400.; 210.; 110.; 410.; 310.; 320.; 220.; 120.; 420.; 130.; 230.; 330.; 430.; 140.; 240.; 340.; 440.;
  |]
  let bi = ref 0

  let float f =
    match f with
      | 5. -> let f = a.(!ai) in incr ai; f
      | 500. -> let f = b.(!bi) in incr bi; f
      | _ -> assert false
end
ENDIF

DEFINE MEMO

let (>>=) = F.(>>=)

(* self-adjusting quickhull following http://ttic.uchicago.edu/~umut/sting/ *)

module L =
struct
  type 'a lst = Nil | Cons of 'a * 'a t
  and 'a t = 'a lst F.behavior

  let nil () = F.return Nil
  let cons h t = F.return (Cons (h, t))

  let rec of_list = function
    | [] -> nil ()
    | h :: t -> cons h (of_list t)

  let rec to_list l =
    l >>= function
      | Nil -> F.return []
      | Cons (h, t) ->
          to_list t >>= fun t -> F.return (h :: t)

  let rec length_less_than n l =
    if n <= 0
    then F.return false
    else
      l >>= function
        | Nil -> F.return true
        | Cons (_, t) -> length_less_than (n - 1) t

  let map f =
    let f = IFDEF STATS THEN fun x -> incr S.maps; f x ELSE f ENDIF in
    let memo = IFDEF MEMO THEN F.memo ~hash:F.hash_behavior () ELSE fun f -> f ENDIF in
    let rec map l =
      l >>= function
        | Nil -> nil ()
        | Cons (h, t) -> cons (f h) (memo map t) in
    memo map

  let filter f =
    let f = IFDEF STATS THEN fun x -> incr S.filters; f x ELSE f ENDIF in
    let memo = IFDEF MEMO THEN F.memo ~hash:F.hash_behavior () ELSE fun f -> f ENDIF in
    let rec filter l =
      l >>= function
        | Nil -> nil ()
        | Cons (h, t) ->
            let t = memo filter t in
            if f h then cons h t else t in
    memo filter

  let max cmp =
    let cmp = IFDEF STATS THEN fun a b -> incr S.maxs; cmp a b ELSE cmp ENDIF in
    let memo = IFDEF MEMO THEN F.memo ~hash:F.hash_behavior () ELSE fun f -> f ENDIF in
    let rec max l =
      l >>= function
        | Nil -> F.fail (Invalid_argument "empty list")
        | Cons (h, t) ->
            t >>= function
              | Nil -> F.return h
              | _ ->
                  let m = memo max t in
                  m >>= fun m' ->
                    match cmp h m' with
                      | 1 -> F.return h
                      | _ -> m in
    memo max
                  
end

module G =
struct
  type point = float * float
  type line = point * point

  let compare (ax, ay) (bx, by) =
    match compare ax bx with
      | 0 -> compare ay by
      | c -> c

  let cross (ux, uy) (vx, vy) = ux *. vy -. vx *. uy

  let line_side ((ax, ay), (bx, by)) (cx, cy) =
    let u = bx -. ax, by -. ay in
    let v = cx -. ax, cy -. ay in
    cross u v

  let above_line l p = line_side l p > 0.

  let line_dist (a, b) p =
    let vec (px, py) (qx, qy) = qx -. px, qy -. py in
    cross (vec a p) (vec b p)
end

module QH =
struct
  let rec split p1 p2 l hull =
    l >>= function
      | L.Nil -> L.cons p1 hull
      | _ ->
          let line_dist = G.line_dist (p1, p2) in
          L.max (fun a b -> compare (line_dist a) (line_dist b)) l >>= fun m ->
            let left = L.filter (G.above_line (p1, m)) l in
            let right = L.filter (G.above_line (m, p2)) l in
            split p1 m left (split m p2 right hull)

  let hull l =
    L.length_less_than 2 l >>= fun b ->
      if b then l
      else
        let min = L.max (fun a b -> -(G.compare a b)) l in
        let max = L.max G.compare l in
        F.bind2 min max begin fun min max ->
          let upper = L.filter (G.above_line (min, max)) l in
          let lower = L.filter (G.above_line (max, min)) l in
          split min max upper (split max min lower (L.nil ()))
        end
end

let get id = D.document#getElementById id

let onload () =
  let min = 0. in
  let max = 500. in

  let ticks = Fd.ticks 20. in

  let random_color () =
    Fda.color (Random.int 255) (Random.int 255) (Random.int 255) in

  let bouncing () =
    let coord () =
      let v = Random.float 5. in
      let init = Random.float max in
      let collect (p, v) () =
        let p = p +. v in
        let v = if p <= min || p >= max then -.v else v in
        p, v in
      F.collect collect (init, v) ticks |>
          F.map fst |>
              F.hold init in
    let x = coord () and y = coord () in
    let c = random_color () in
    F.blift2 x y (fun x y -> x, y, c) in

  let stationary () =
    (Random.float max, Random.float max, random_color ()) in

  let clicks =
    F.merge [
      F.map (fun _ -> `Stationary) (Fd.clicks (get "stationary"));
      F.map (fun _ -> `Bouncing) (Fd.clicks (get "bouncing"));
      F.map (fun _ -> `Remove) (Fd.clicks (get "remove"));
    ] in

  let points : (float * float * Fda.color) L.t =
    let memo = F.memo () in
    let lookup = memo (function 0 -> L.nil () | _ -> assert false) in
    let stationary = memo (fun v -> L.cons (stationary ()) (lookup (v - 1))) in
    let bouncing = memo (fun v -> bouncing () >>= fun p -> L.cons p (lookup (v - 1))) in
    let collect (v, _) = function
      | `Stationary -> let v = v + 1 in (v, stationary v)
      | `Bouncing -> let v = v + 1 in (v, bouncing v)
      | `Remove -> match v with 0 -> (0, lookup 0) | v -> let v = v - 1 in (v, lookup v) in
    F.collect collect (0, L.nil ()) clicks |>
        F.map snd |>
            F.hold (L.nil ()) |>
                F.join_b in

  let disks : Fda.shape list F.behavior =
    points |>
        L.to_list |>
            F.lift (List.map (fun (x, y, c) -> Fda.disk (x, y) 5. c)) in

  let hull : Fda.shape F.behavior =
    points |>
        L.map (fun (x, y, c) -> x, y) |>
            QH.hull |>
                L.to_list |>
                    F.lift (fun hull -> Fda.filled_poly hull (Fda.color 128 0 0)) in

  let shapes = F.blift2 disks hull begin fun disks hull ->
    IFDEF STATS THEN
      incr S.ticks;
      console#log (Printf.sprintf "ticks=%d, maps=%d, filters=%d, maxs=%d" !S.ticks !S.maps !S.filters !S.maxs)
    ENDIF;
    hull :: disks
  end in

  Froc_dom_anim.attach (get "canvas") shapes

;;

F.init ();
IFDEF DEBUG
THEN
F.set_debug (fun s -> console#log s);
F.set_exn_handler (fun e -> console#log (Obj.magic e));
ENDIF;
D.window#_set_onload onload
