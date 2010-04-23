module D = Dom
module F = Froc
module Fd = Froc_dom
module Fda = Froc_dom_anim

DEFINE DEBUG

IFDEF DEBUG
THEN
class type console =
object
  method log : string -> unit
end
let console = (Ocamljs.var "console" : console)
ENDIF

DEFINE STATS

IFDEF STATS
THEN
module S =
struct
  let max_b = ref 0
  let filter_b = ref 0
  let ticks = ref 0
end
ENDIF

(* DEFINE MEMO *)

let (>>=) = F.(>>=)

(* self-adjusting quickhull following http://ttic.uchicago.edu/~umut/sting/ *)

module L =
struct
  type 'a lst = Nil | Cons of 'a * 'a t
  and 'a t = 'a lst F.behavior

  let nil () = F.return Nil
  let cons h t = F.return (Cons (h, t))

  let rec of_list = function
    | [] -> F.return Nil
    | h :: t -> F.return (Cons (h, of_list t))

  let rec to_list l =
    l >>= function
      | Nil -> F.return []
      | Cons (h, t) ->
          to_list t >>= fun t -> F.return (h :: t)

  let max_b cmp =
    let memo =
      IFDEF MEMO
      THEN F.memo ~hash:F.hash_behavior ()
      ELSE fun f -> f ENDIF in
    let rec max l =
      IFDEF STATS THEN incr S.max_b ENDIF;
      l >>= function
        | Nil -> F.fail (Invalid_argument "empty list")
        | Cons (h, t) ->
            t >>= function
              | Nil -> h
              | _ ->
                  let m = memo max t in
                  F.lift2 cmp h m >>= function
                    | 1 -> h
                    | _ -> m in
    memo max

  let filter_b f =
    let memo =
      IFDEF MEMO
      THEN F.memo ~hash:F.hash_behavior ()
      ELSE fun f -> f ENDIF in
    let rec filt l =
      IFDEF STATS THEN incr S.filter_b ENDIF;
      l >>= function
        | Nil -> F.return Nil
        | Cons (h, t) ->
            let t = memo filt t in
            F.lift f h >>= fun b ->
              if b
              then F.return (Cons (h, t))
              else t in
    memo filt

  let rec length_less_than n l =
    if n <= 0
    then F.return false
    else
      l >>= function
        | Nil -> F.return true
        | Cons (_, t) -> length_less_than (n - 1) t
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
      | L.Nil -> F.return (L.Cons (p1, hull))
      | _ ->
          F.bind2 p1 p2 begin fun p1' p2' ->
            let line_dist = G.line_dist (p1', p2') in
            let m = L.max_b (fun a b -> compare (line_dist a) (line_dist b)) l in
            m >>= fun m' ->
              let left = L.filter_b (G.above_line (p1', m')) l in
              let right = L.filter_b (G.above_line (m', p2')) l in
              split p1 m left (split m p2 right hull)
          end

  let hull l =
    L.length_less_than 2 l >>= fun b ->
      if b then l
      else
        let min = L.max_b (fun a b -> -(G.compare a b)) l in
        let max = L.max_b G.compare l in
        F.bind2 min max begin fun min' max' ->
          let upper = L.filter_b (G.above_line (min', max')) l in
          let lower = L.filter_b (G.above_line (max', min')) l in
          split min max upper (split max min lower (F.return L.Nil))
        end
end

let get id = D.document#getElementById id

let onload () =
  let canvas = (get "canvas" : D.canvas) in

  let ticks = Fd.ticks 20. in

  let min = 0. in
  let max = 300. in
  let init = 150. in

  let make_point () =
    let p v =
      F.hold init
        (F.map fst
           (F.collect
              (fun (p, v) () ->
                 let p = p +. v in
                 let v = if p <= min || p >= max then -.v else v in
               p, v)
              (init, v)
              ticks)) in
    let x = p (Random.float 5.) in
    let y = p (Random.float 5.) in
    F.blift2 x y (fun x y -> x, y) in

  let points = [
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
    make_point ();
  ] in

  let disks =
    List.map
      (fun p ->
         let c = Fda.color (Random.int 255) (Random.int 255) (Random.int 255) in
         F.blift p (fun (x, y) -> Fda.disk (x, y) 5. c))
      points in

  let hull =
    L.to_list (QH.hull (L.of_list points)) >>=
      F.liftN (fun hull -> Fda.filled_poly hull (Fda.color 128 0 0)) in

  let shapes =
    F.bindN disks
      (fun disks ->
         hull >>= fun hull ->
           IFDEF STATS THEN
             incr S.ticks;
             console#log (Printf.sprintf "ticks = %d; filter_b = %d; max_b = %d" !S.ticks !S.filter_b !S.max_b)
           ENDIF;
           F.return (hull :: disks)) in
  Froc_dom_anim.attach canvas shapes

;;

F.init ();
IFDEF DEBUG
THEN
F.set_debug (fun s -> console#log s);
F.set_exn_handler (fun e -> console#log (Obj.magic e));
ENDIF;
D.window#_set_onload onload
