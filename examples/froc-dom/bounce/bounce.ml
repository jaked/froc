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

let get id = D.document#getElementById id

let onload () =
  let paddle_radius = 25. in
  let ball_radius = 5. in
  let min = 0. in
  let max = 500. in

  let init_p = (Random.float max, Random.float max) in
  let init_v = (Random.float 5., Random.float 5.) in

  let paddle_point =
    F.blift (Fd.mouse_b ()) begin fun (x, y) ->
      let x = float_of_int x in
      let y = float_of_int y in
      let x = if x < min then min else if x > max then max else x in
      let y = if y < min then min else if y > max then max else y in
      (x, y)
    end in

  let paddle = F.blift paddle_point (fun p -> Fda.disk p paddle_radius (Fda.color 255 0 0)) in

  let ball_point =
    F.fix_b begin fun bp ->

      let x_lo = F.map (fun () -> `X_lo) (F.when_true (F.blift bp (fun (x, _) -> x <= min))) in
      let x_hi = F.map (fun () -> `X_hi) (F.when_true (F.blift bp (fun (x, _) -> x >= max))) in
      let y_lo = F.map (fun () -> `Y_lo) (F.when_true (F.blift bp (fun (_, y) -> y <= min))) in
      let y_hi = F.map (fun () -> `Y_hi) (F.when_true (F.blift bp (fun (_, y) -> y >= max))) in

      let hit_paddle =
        F.map (fun () -> `Paddle)
          (F.when_true
             (F.blift bp begin fun (x, y) ->
                let (px, py) = F.sample paddle_point in
                let dist_x = px -. x in
                let dist_y = py -. y in
                let dist = paddle_radius +. ball_radius in
                dist_x *. dist_x +. dist_y *. dist_y <= dist *. dist
              end)) in

      let positive v = if v < 0. then -.v else v in
      let negative v = if v > 0. then -.v else v in

      let v =
        F.fix_b begin fun v ->
          F.hold
            init_v
            (F.map
               begin fun e ->
                 let (vx, vy) = F.sample v in
                 match e with
                   | `X_lo -> (positive vx, vy)
                   | `X_hi -> (negative vx, vy)
                   | `Y_lo -> (vx, positive vy)
                   | `Y_hi -> (vx, negative vy)

                   | `Paddle ->
                       (* bounce v off the tangent to the paddle *)
                       let (x, y) = F.sample bp in
                       let (px, py) = F.sample paddle_point in
                       let (nx, ny) =
                         let (nx, ny) = (x -. px, y -. py) in
                         let z = sqrt (nx *. nx +. ny *. ny) in
                         (nx /. z, ny /. z) in
                       let dp = vx *. nx +. vy *. ny in
                       (vx -. 2. *. dp *. nx, vy -. 2. *. dp *. ny)
               end
               (F.merge [ x_lo; x_hi; y_lo; y_hi; hit_paddle ]))
        end in

      F.hold init_p
        (F.collect
           (fun (x, y) () -> let vx, vy = F.sample v in (x +. vx, y +. vy))
           init_p
           (Fd.ticks 20.))
    end in

  let ball =
    F.blift ball_point begin fun (x, y) ->
      Fda.disk (x, y) ball_radius (Fda.color 0 255 0)
    end in

  let shapes = F.bliftN [ paddle; ball ] (fun shapes -> shapes) in
  Froc_dom_anim.attach (get "canvas") shapes

;;

F.init ();
IFDEF DEBUG
THEN
F.set_debug (fun s -> console#log s);
F.set_exn_handler (fun e -> console#log (Obj.magic e));
ENDIF;
D.window#_set_onload onload
