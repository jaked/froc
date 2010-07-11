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
  let findi arr p =
    let len = Array.length arr in
    let rec loop i =
      if i >= len then raise Not_found
      else if arr.(i) = p then i
      else loop (i + 1) in
    loop 0

  let mem arr p =
    try ignore (findi arr p); true
    with Not_found -> false

  let next arr p =
    let len = Array.length arr in
    let i = findi arr p in
    let i = if i + 1 = len then i else i + 1 in
    arr.(i)

  let prev arr p =
    let i = findi arr p in
    let i = if i - 1 < 0 then i else i - 1 in
    arr.(i)

  let number arr p = findi arr p  + 1
end

module Behaviors =
struct
  let onload () =
    let input = Dom.document#getElementById "behaviors_input" in
    let value = Froc_dom.input_value_b input in
    let int_value = Froc.lift int_of_string value in
    let incr = Froc.lift (fun x -> x + 1) int_value in
    let output = Dom.document#getElementById "behaviors_output" in
    Froc_dom.attach_innerHTML_b output
      (Froc.catch
         (fun () -> Froc.lift string_of_int incr)
         (fun _ -> Froc.return ""))
end

module Glitch_free =
struct
  let onload () =
    let input = Dom.document#getElementById "glitch_free_input" in
    let value = Froc_dom.input_value_b input in
    let x = Froc.lift int_of_string value in
    let double = Froc.lift (fun x -> 2 * x) x in
    let triple = Froc.lift2 (fun s d -> s + d) x double in
    let output = Dom.document#getElementById "glitch_free_output" in
    Froc_dom.attach_innerHTML_b output
      (Froc.catch
         (fun () -> Froc.lift string_of_int triple)
         (fun _ -> Froc.return ""))
end

module Dynamic_deps =
struct
  let onload () =
    let input = Dom.document#getElementById "dynamic_deps_input" in
    let value = Froc_dom.input_value_b input in
    let x = Froc.lift int_of_string value in
    let b = Froc.lift (fun x -> x = 0) x in
    let result = Froc.bind b (fun b -> if b then Froc.return 0 else Froc.lift (fun x -> 100 / x) x) in
    let output = Dom.document#getElementById "dynamic_deps_output" in
    Froc_dom.attach_innerHTML_b output
      (Froc.catch
         (fun () -> Froc.lift string_of_int result)
         (fun _ -> Froc.return ""))
end

module Events =
struct
  let onload () =
    let button1 = Dom.document#getElementById "events_button1" in
    let clicks1 = Froc_dom.clicks button1 in
    let count1 = Froc.count clicks1 in
    let output1 = Dom.document#getElementById "events_output1" in
    Froc_dom.attach_innerHTML_b output1
      (Froc.catch
         (fun () -> Froc.lift string_of_int count1)
         (fun _ -> Froc.return ""));

    let button2 = Dom.document#getElementById "events_button2" in
    let clicks2 = Froc_dom.clicks button2 in
    let shift_clicks2 = Froc.filter (fun e -> e#_get_shiftKey) clicks2 in
    let count2 = Froc.count shift_clicks2 in
    let output2 = Dom.document#getElementById "events_output2" in
    Froc_dom.attach_innerHTML_b output2
      (Froc.catch
         (fun () -> Froc.lift string_of_int count2)
         (fun _ -> Froc.return ""))
end

module Sudoku =
struct
  let d = D.document

  let (>>=) = F.(>>=)

  type square = {
    i : int;
    j : int;
    cell : int option F.behavior;
    set_cell : int option -> unit;
    input : Dom.input;
  }

  let make_board () =
    let make_square i j =
      let input = (d#createElement "input" : D.input) in
      input#setAttribute "type" "text";
      input#_set_size 1;
      input#_set_maxLength 1;
      let style = input#_get_style in
      style#_set_border "none";
      style#_set_padding "0px";
      style#_set_fontSize "20px";

      let (cell, set_cell) = F.make_cell None in
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
      F.notify_e ev set_cell;
      { i = i; j = j; cell = cell; set_cell = set_cell; input = input; } in

    let make_td sq =
      let td = d#createElement "td" in
      let style = td#_get_style in
      style#_set_borderStyle "solid";
      style#_set_borderColor "#000000";
      let widths = function
        | 0 -> 2, 0 | 2 -> 1, 1 | 3 -> 1, 0
        | 5 -> 1, 1 | 6 -> 1, 0 | 8 -> 1, 2
        | _ -> 1, 0 in
      let (top, bottom) = widths sq.i in
      let (left, right) = widths sq.j in
      let px k = string_of_int k ^ "px" in
      style#_set_borderTopWidth (px top);
      style#_set_borderBottomWidth (px bottom);
      style#_set_borderLeftWidth (px left);
      style#_set_borderRightWidth (px right);
      ignore (td#appendChild sq.input);
      td in

    let table = d#createElement "table" in
    table#setAttribute "cellpadding" "0px";
    table#setAttribute "cellspacing" "0px";
    let tbody = d#createElement "tbody" in
    ignore (table#appendChild tbody);

    let squares =
      let squares = ref [] in
      for i = 0 to 8 do
        let tr = d#createElement "tr" in
        ignore (tbody#appendChild tr);
        for j = 0 to 8 do
          let sq = make_square i j in
          let td = make_td sq in
          ignore (tr#appendChild td);
          squares := sq :: !squares
        done
      done;
      !squares in

    let adjacents { i = i; j = j } =
      let adjacent { i = i'; j = j' } =
        (not (i' = i && j' = j)) &&
          (i' = i || j' = j ||
              (i' / 3 = i / 3 && j' / 3 = j / 3)) in
      List.map (fun sq -> sq.cell) (List.filter adjacent squares) in

    List.iter
      (fun sq ->
         let backgroundColor =
           F.bindN (adjacents sq)
             (fun adjs ->
                F.lift
                  (fun v ->
                     if v <> None && List.mem v adjs
                     then "#ff0000"
                     else "#ffffff")
                  sq.cell) in
         Fd.attach_backgroundColor_b sq.input backgroundColor)
      squares;

    (squares, table)

  let get_board squares =
    let board = << [[[5], 0, 0, [6], [4], 0, [9], 0, [8]], [0, 0, [2], 0, 0, 0, 0, 0, 0], [[9], 0, 0, 0, 0, [2], 0, 0, 0], [[8], 0, 0, [3], [2], 0, 0, [1], 0], [0, [4], 0, [1], 0, [5], 0, [8], 0], [0, [6], 0, 0, [7], [8], 0, 0, [5]], [0, 0, 0, [2], 0, 0, 0, 0, [9]], [0, 0, 0, 0, 0, 0, [7], 0, 0], [[3], 0, [4], 0, [8], [9], 0, 0, [6]]] >> in
    List.iter
      (fun sq ->
        let v = board.(sq.i).(sq.j) in
        sq.input#_set_disabled (v <> None);
        sq.set_cell v)
      squares

  let onload () =
    let (squares, table) = make_board () in
    get_board squares;
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
  let pages =
    Array.map
      (fun (e : Dom.element) -> e#getAttribute "id")
      (Dom.document#getElementsByClassName "slide") in

  let curr_page =
    try
      let p = Dom.window#_get_location#_get_hash in
      let p = (Javascript.Js_string.split p "#").(1) in
      if Util.mem pages p then p else pages.(0)
    with _ -> pages.(0) in

  let page =
    Fd.keyEvent "keydown" Dom.document |>
        F.collect
          (fun p e ->
             match e#_get_keyCode with
               | 37 -> Util.prev pages p
               | 39 -> Util.next pages p
               | _ -> p)
          curr_page |>
              F.hold curr_page in
  (* track page history *)
  F.notify_b page (fun p -> Dom.window#_get_location#_set_hash p);

  (* show only the current page *)
  Array.iter
    (fun p ->
       F.blift page (fun p' -> if p = p' then "" else "none") |>
           Fd.attach_display_b (Dom.document#getElementById p))
    pages;

  (* show page number (except on title page) *)
  F.blift page (fun p -> if p != pages.(0) then "" else "none") |>
      Fd.attach_display_b (Dom.document#getElementById "nav");
  (Dom.document#getElementById "nav_page_total")#_set_innerHTML (string_of_int (Array.length pages));
  F.blift page (fun p -> string_of_int (Util.number pages p)) |>
      Fd.attach_innerHTML_b (Dom.document#getElementById "nav_page_num");

  (* page-specific stuff *)
  F.blift page
    begin function
      | "behaviors" -> Behaviors.onload ()
      | "glitch_free" -> Glitch_free.onload ()
      | "dynamic_deps" -> Dynamic_deps.onload ()
      | "events" -> Events.onload ()
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
