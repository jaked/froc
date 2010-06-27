module D = Dom
module F = Froc
module Fd = Froc_dom
module Fda = Froc_dom_anim

open Ocamljs.Inline

let (|>) x f = f x

DEFINE DEBUG

IFDEF DEBUG
THEN
class type console =
object
  method log : string -> unit
end
let console = (Ocamljs.var "console" : console)
ENDIF

module Util =
struct
  let next lst p =
    let rec loop = function
      | [] -> assert false
      | [ p' ] when p = p' -> p
      | p' :: n :: _ when p = p' -> n
      | _ :: ps -> loop ps in
     loop lst

  let prev lst p =
    let rec loop pr ps =
      match pr, ps with
        | _, [] -> assert false
        | None, p' :: _ when p = p' -> p
        | Some pr, p' :: _ when p = p' -> pr
        | _, pr :: ps -> loop (Some pr) ps in
    loop None lst

  let number lst p =
    let rec loop n = function
      | [] -> assert false
      | p' :: _ when p = p' -> n
      | _ :: ps -> loop (n + 1) ps in
    loop 1 lst
end

module P =
struct
  let pages = [
    "title";
    "gui_hard";
    "gui_not_hard";
    "mvc";
    "frp";
    "ocaml_etc";
    "frp_behaviors";
    "frp_events";
    "dyn_deps";
    "output";
    "clicks";
    "clicks_src";
    "sudoku";
    "sudoku_src";
    "bounce";
    "bounce_src";
    "implementation";
    "why_ocaml";
    "reactive";
    "thanks";
  ]

  let next = Util.next pages
  let prev = Util.prev pages
  let number = Util.number pages
end

module Clicks =
struct
  let onload () =
    let elem id = D.document#getElementById id in
    let clicks = F.count (Fd.clicks (elem "clicks_click")) in
    let ticks = F.count (Fd.ticks 1000.) in
    Fd.attach_innerHTML_b (elem "clicks_clicks") (F.lift string_of_int clicks);
    Fd.attach_innerHTML_b (elem "clicks_seconds") (F.lift string_of_int ticks);
    Fd.attach_innerHTML_b
      (elem "clicks_difference")
      (F.lift2
         (fun clicks ticks ->
            if clicks = ticks
            then "same number of clicks as ticks"
            else if clicks > ticks
            then string_of_int (clicks - ticks) ^ " more clicks than ticks"
            else string_of_int (ticks - clicks) ^ " more ticks than clicks")
         clicks ticks)
end

module Sudoku =
struct
  let d = D.document

  let (>>=) = F.(>>=)

  let make_board () =
    let make_input () =
      let input = (d#createElement "input" : D.input) in
      input#setAttribute "type" "text";
      input#_set_size 1;
      input#_set_maxLength 1;
      let style = input#_get_style in
      style#_set_border "none";
      style#_set_padding "0px";
      style#_set_fontSize "20px";

      let (cell, set) = F.make_cell None in
      Fd.attach_input_value_b input
        (cell >>= function
           | None -> F.return ""
           | Some v -> F.return (string_of_int v));
      let ev =
        F.map
          (function
             | "1" | "2" | "3" | "4" | "5"
             | "6" | "7" | "8" | "9"  as v -> Some (int_of_string v)
             | _ -> None)
          (Fd.input_value_e input) in
      F.notify_e ev set;
      (cell, set, input) in

    let rows =
      Array.init 9 (fun i ->
        Array.init 9 (fun j ->
          make_input ())) in

    let foldi x a f =
      let r = ref x in
      for i = 0 to Array.length a - 1 do
        r := f i !r (Array.unsafe_get a i)
      done;
      !r in

    let adjacents i j =
      let adj i' j' =
        (i' <> i || j' <> j) &&
          (i' = i or j' = j or
              (i' / 3 = i / 3 && j' / 3 = j / 3)) in
      foldi [] rows begin fun i' adjs row ->
        foldi adjs row begin fun j' adjs (cell,_,_) ->
          if adj i' j'
          then cell::adjs
          else adjs
        end
      end in

    ArrayLabels.iteri rows ~f:begin fun i row ->
      ArrayLabels.iteri row ~f:begin fun j (cell, _, input) ->
        let adjs = adjacents i j in
        Fd.attach_backgroundColor_b input
          (F.bindN adjs (fun adjs ->
             F.lift
               (fun v ->
                  if v <> None && List.mem v adjs
                  then "#ff0000"
                  else "#ffffff")
               cell))
      end
    end;

    let make_td i j input =
      let td = d#createElement "td" in
      let style = td#_get_style in
      style#_set_borderStyle "solid";
      style#_set_borderColor "#000000";
      let widths = function
        | 0 -> 2, 0 | 2 -> 1, 1 | 3 -> 1, 0
        | 5 -> 1, 1 | 6 -> 1, 0 | 8 -> 1, 2
        | _ -> 1, 0 in
      let (top, bottom) = widths i in
      let (left, right) = widths j in
      let px k = string_of_int k ^ "px" in
      style#_set_borderTopWidth (px top);
      style#_set_borderBottomWidth (px bottom);
      style#_set_borderLeftWidth (px left);
      style#_set_borderRightWidth (px right);
      ignore (td#appendChild input);
      td in

    let table = d#createElement "table" in
    table#setAttribute "cellpadding" "0px";
    table#setAttribute "cellspacing" "0px";
    let tbody = d#createElement "tbody" in
    ignore (table#appendChild tbody);
    ArrayLabels.iteri rows ~f:(fun i row ->
      let tr = d#createElement "tr" in
      ArrayLabels.iteri row ~f:(fun j (_,_,input) ->
        let td = make_td i j input in
        ignore (tr#appendChild td));
      ignore (tbody#appendChild tr));

    (rows, table)

  let get_board rows =
    ArrayLabels.iter rows ~f:(fun row ->
      ArrayLabels.iter row ~f:(fun (_,set,_) ->
        set None));
    let board = << [[[5], 0, 0, [6], [4], 0, [9], 0, [8]], [0, 0, [2], 0, 0, 0, 0, 0, 0], [[9], 0, 0, 0, 0, [2], 0, 0, 0], [[8], 0, 0, [3], [2], 0, 0, [1], 0], [0, [4], 0, [1], 0, [5], 0, [8], 0], [0, [6], 0, 0, [7], [8], 0, 0, [5]], [0, 0, 0, [2], 0, 0, 0, 0, [9]], [0, 0, 0, 0, 0, 0, [7], 0, 0], [[3], 0, [4], 0, [8], [9], 0, 0, [6]]] >> in
    for i = 0 to 8 do
      for j = 0 to 8 do
        let (_,set,input) = rows.(i).(j) in
        let v = board.(i).(j) in
        input#_set_disabled (v <> None);
        set v;
      done
    done

  let onload () =
    let (rows, table) = make_board () in
    get_board rows;
    let board = d#getElementById "sudoku_board" in
    F.cleanup (fun () -> ignore (board#removeChild table));
    ignore (board#appendChild table)
end

module Bounce =
struct
  let get id = D.document#getElementById id
  
  let onload () =
    let paddle_radius = 25. in
    let ball_radius = 5. in
    let min = 0. in
    let max = 500. in
  
    let init_p = (Random.float max, Random.float max) in
    let init_v = (Random.float 5., Random.float 5.) in

    let offset_x, offset_y =
      let c = get "bounce_canvas" in
      c#_get_offsetLeft, c#_get_offsetTop in
  
    let paddle_point =
      F.blift (Fd.mouse_b ()) begin fun (x, y) ->
        let x = x - offset_x in
        let y = y - offset_y in
        let x = float_of_int x in
        let y = float_of_int y in
        let x = if x < min then min else if x > max then max else x in
        let y = if y < min then min else if y > max then max else y in
        (x, y)
      end in
  
    let paddle = F.blift paddle_point (fun p -> Fda.disk p paddle_radius (Fda.color 255 0 0)) in
  
    let ball_point =
      F.fix_b begin fun bp ->
  
        let x_out_of_bounds =
          F.map
            (fun () -> `X_bounds)
            (F.when_true
               (F.blift bp (fun (x, _) -> x <= min || x >= max))) in
  
        let y_out_of_bounds =
          F.map
            (fun () -> `Y_bounds)
            (F.when_true
               (F.blift bp (fun (_, y) -> y <= min || y >= max))) in
  
        (*
          the merge below reports only the leftmost simultaneous event,
          so we have to account for the combination to avoid losing the
          ball in the corners. is there a more compositional way?
        *)
        let xy_out_of_bounds =
          F.map2 (fun _ _ -> `Xy_bounds) x_out_of_bounds y_out_of_bounds in
  
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
  
        let v =
          F.fix_b begin fun v ->
            F.hold
              init_v
              (F.map
                 begin fun e ->
                   let (vx, vy) = F.sample v in
                   let (x, y) = F.sample bp in
                   match e with
                     | `X_bounds -> (-.vx, vy)
                     | `Y_bounds -> (vx, -.vy)
                     | `Xy_bounds -> (-.vx, -.vy)
                     | `Paddle ->
                         (* bounce v off the tangent to the paddle *)
                         let (px, py) = F.sample paddle_point in
                         let (nx, ny) =
                           let (nx, ny) = (x -. px, y -. py) in
                           let z = sqrt (nx *. nx +. ny *. ny) in
                           (nx /. z, ny /. z) in
                         let dp = vx *. nx +. vy *. ny in
                         (vx -. 2. *. dp *. nx, vy -. 2. *. dp *. ny)
                 end
                 (F.merge [ xy_out_of_bounds; x_out_of_bounds; y_out_of_bounds; hit_paddle ]))
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
    Froc_dom_anim.attach (get "bounce_canvas") shapes
end

let onload () =
  let curr_page =
    try
      let p = Dom.window#_get_location#_get_hash in
      let p = (Javascript.Js_string.split p "#").(1) in
      if List.mem p P.pages then p else List.hd P.pages
    with _ -> List.hd P.pages in

  let page =
    Fd.keyEvent "keydown" Dom.document |>
        F.collect
          (fun p e ->
             match e#_get_keyCode with
               | 37 -> P.prev p
               | 39 -> P.next p
               | _ -> p)
          curr_page |>
              F.hold curr_page in
  (* track page history *)
  F.notify_b page (fun p -> Dom.window#_get_location#_set_hash p);

  (* show only the current page *)
  List.iter
    (fun p ->
       F.blift page (fun p' -> if p = p' then "" else "none") |>
           Fd.attach_display_b (Dom.document#getElementById p))
    P.pages;

  (* show page number (except on title page) *)
  F.blift page (fun p -> if p != List.hd P.pages then "" else "none") |>
      Fd.attach_display_b (Dom.document#getElementById "nav");
  (Dom.document#getElementById "nav_page_total")#_set_innerHTML (string_of_int (List.length P.pages));
  F.blift page (fun p -> string_of_int (P.number p)) |>
      Fd.attach_innerHTML_b (Dom.document#getElementById "nav_page_num");

  (* page-specific stuff *)
  F.blift page
    begin function
      | "clicks"-> Clicks.onload ()
      | "sudoku" -> Sudoku.onload ()
      | "bounce" -> Bounce.onload ()
      | _ -> ()
    end |> ignore

;;

F.init ();
IFDEF DEBUG
THEN
F.set_debug (fun s -> console#log s);
F.set_exn_handler (fun e -> console#log (Obj.magic e));
ENDIF;
D.window#_set_onload onload
