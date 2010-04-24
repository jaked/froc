module D = Dom
module F = Froc
module Fd = Froc_dom
module Fda = Froc_dom_anim

IFDEF DEBUG
THEN
class type console =
object
  method log : string -> unit
end
let console = (Ocamljs.var "console" : console)
ENDIF

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

  let rec map_b f l =
    l >>= function
      | Nil -> nil ()
      | Cons (h, t) ->
          let t = map_b f t in
          cons (F.lift f h) t

  (*
    the idea is to recursively split the list in half, maximize each
    sublist, then compare the maximums. we should need only O(log N)
    comparisons to propagate a change.
  *)
  let rec max_b cmp l =
    let rec split l odd even =
      l >>= function
        | Nil -> F.return (odd, even)
        | Cons (h, t) ->
            t >>= function
              | Nil -> F.return (cons h odd, even)
              | Cons (h2, t) -> split t (cons h odd) (cons h2 even) in
    split l (nil ()) (nil ()) >>= fun (odd, even) ->
      F.bind2 odd even begin fun odd' even' ->
        match odd', even' with
          | Nil, Nil -> F.fail (Invalid_argument "empty list")
          | Nil, Cons (h, _) -> h
          | Cons (h, _), Nil -> h
          | _ ->
              let mo = max_b cmp odd in
              let me = max_b cmp even in
              F.lift2 cmp mo me >>= function
                | 1 -> mo
                | _ -> me
      end

  let rec filter_b f l =
    l >>= function
      | Nil -> nil ()
      | Cons (h, t) ->
          let t = filter_b f t in
          F.lift f h >>= fun b ->
            if b
            then cons h t
            else t

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
  let min = 0. in
  let max = 500. in

  let ticks = Fd.ticks 20. in

  let random_color () =
    Fda.color (Random.int 255) (Random.int 255) (Random.int 255) in

  let bouncing () =
    let coord () =
      let v = Random.float 5. in
      let init = Random.float max in
      F.hold init
        (F.map fst
           (F.collect
              (fun (p, v) () ->
                 let p = p +. v in
                 let v = if p <= min || p >= max then -.v else v in
               p, v)
              (init, v)
              ticks)) in
    let x = coord () and y = coord () in
    let c = random_color () in
    F.blift2 x y (fun x y -> x, y, c) in

  let stationary () =
    F.return (Random.float max, Random.float max, random_color ()) in

  let clicks =
    F.merge [
      F.map (fun () -> `Stationary) (Fd.clicks (get "stationary"));
      F.map (fun () -> `Bouncing) (Fd.clicks (get "bouncing"));
      F.map (fun () -> `Remove) (Fd.clicks (get "remove"));
    ] in

  let points : (float * float * Fda.color) F.behavior L.t =
    F.join_b
      (F.hold (L.nil ())
         (F.map List.hd
            (F.collect
               (function
                  | [] -> (fun _ -> assert false)
                  | h :: t as hist ->
                      function
                        | `Stationary -> L.cons (stationary ()) h :: hist
                        | `Bouncing -> L.cons (bouncing ()) h :: hist
                        | `Remove -> match t with [] -> hist | _ -> t)
               [ L.nil() ]
               clicks))) in

  let disks : Fda.shape list F.behavior =
    L.to_list points >>=
      F.liftN (List.map (fun (x, y, c) -> Fda.disk (x, y) 5. c)) in

  let hull : Fda.shape F.behavior =
    L.to_list (QH.hull (L.map_b (fun (x, y, c) -> x, y) points)) >>=
      F.liftN (fun hull -> Fda.filled_poly hull (Fda.color 128 0 0)) in

  let shapes = F.bind2 disks hull (fun disks hull -> F.return (hull :: disks)) in
  Froc_dom_anim.attach (get "canvas") shapes

;;

F.init ();
IFDEF DEBUG
THEN
F.set_debug (fun s -> console#log s);
F.set_exn_handler (fun e -> console#log (Obj.magic e));
ENDIF;
D.window#_set_onload onload
