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

let attach_show_hide el =
  Fd.keyEvent "keydown" Dom.document |>
      F.collect_b
        (fun d e ->
           match e#_get_keyCode with
             | 38 -> "none"
             | 40 -> ""
             | _ -> d)
        "none" |>
            Fd.attach_display_b el

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
         (fun _ -> Froc.return ""));
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
    let clicks = Froc_dom.clicks button1 in
    let count1 = Froc.count clicks in
    Froc_dom.attach_innerHTML_b
      (Dom.document#getElementById "events_output1")
      (Froc.lift string_of_int count1);

    let button2 = Dom.document#getElementById "events_button2" in
    let shift_clicks = Froc.filter (fun e -> e#_get_shiftKey) (Froc_dom.clicks button2) in
    let count2 = Froc.count shift_clicks in
    Froc_dom.attach_innerHTML_b
      (Dom.document#getElementById "events_output2")
      (Froc.lift string_of_int count2);

    let either_clicks = Froc.merge [ clicks; shift_clicks ] in
    let count3 = Froc.count either_clicks in
    Froc_dom.attach_innerHTML_b
      (Dom.document#getElementById "events_output3")
      (Froc.lift string_of_int count3);
end

module Fritter =
struct
  let onload () =
    let text = Dom.document#getElementById "fritter_text" in
    let count = Dom.document#getElementById "fritter_count" in
    let tweet = Dom.document#getElementById "fritter_tweet" in

    let length =
      Froc.lift String.length (Froc_dom.input_value_b ~event:"keyup" text) in

    let left = Froc.lift (fun x -> 140 - x) length in

    let color = Froc.lift
      (fun x -> if x < 10 then "#D40D12" else if x < 20 then "#5C0002"else "#CCC")
      left in

    let disabled = Froc.lift (fun x -> x < 0) left in

    Froc_dom.attach_innerHTML_b count (Froc.lift string_of_int left);
    Froc_dom.attach_color_b count color;
    Froc_dom.attach_disabled_b tweet disabled;

    attach_show_hide (Dom.document#getElementById "fritter_code");
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
      style#_set_fontSize "36px";

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
          (Fd.input_value_e ~event:"keyup" input) in
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
      let adj { i = i'; j = j' } =
        (not (i' = i && j' = j)) &&
          (i' = i || j' = j ||
              (i' / 3 = i / 3 && j' / 3 = j / 3)) in
      List.map (fun sq -> sq.cell) (List.filter adj squares) in

    List.iter
      (fun sq ->
         let bg =
           F.bindN (adjacents sq)
             (fun adjs ->
                F.lift
                  (fun v ->
                     if v <> None && List.mem v adjs
                     then "#ff0000"
                     else "#ffffff")
                  sq.cell) in
         Fd.attach_backgroundColor_b sq.input bg)
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

module Signup =
struct
  let onload () =
    let (~$) x = Dom.document#getElementById x in
    let (~<) x = Froc_dom.input_value_b ~$x in
    let (|>) x f = f x in

    let password_ok =
      Froc.blift2 ~<"signup_password" ~<"signup_password2" begin fun p p2 ->
        match p, p2 with
          | "", _ | _, "" -> `Unset
          | p, p2 when p = p2 -> `Ok
          | _ -> `Mismatch
      end in

    let check_username = function
      | "jaked" -> `Taken
      | "" -> `Unset
      | _ -> `Ok in

    let check_username_rpc reqs =
      let e, s = Froc.make_event () in
      Froc.notify_e reqs begin fun req ->
        Froc.send s (req, `Checking);
        let res = check_username req in
        ignore (Dom.window#setTimeout (fun () -> Froc.send s (req, res)) (Random.float 3000.))
      end;
      e in

    let maybe_check_username reqs =
      Froc.merge [
        reqs |> Froc.filter (fun req -> req = "") |> Froc.map (fun _ -> "", `Unset);
        reqs |> Froc.filter (fun req -> req <> "") |> check_username_rpc;
      ] in

    let username_ok =
      let username = ~<"signup_username" in
      Froc.changes username |>
        maybe_check_username |>
          Froc.filter (fun (req, _) -> Froc.sample username = req) |>
            Froc.map (fun (_, res) -> res) |>
              Froc.hold `Unset in

    Froc_dom.attach_innerHTML_b ~$"signup_username_ok"
      (Froc.blift username_ok begin function
         | `Unset -> ""
         | `Ok -> "ok"
         | `Taken -> "taken"
         | `Checking -> "checking..."
       end);

    Froc_dom.attach_innerHTML_b ~$"signup_password_ok"
      (Froc.blift password_ok begin function
         | `Unset -> ""
         | `Ok -> "ok"
         | `Mismatch -> "mismatch"
       end);

    Froc_dom.attach_disabled_b ~$"signup_signup"
      (Froc.bliftN [ password_ok; username_ok ] begin fun oks ->
         not (List.for_all (function `Ok -> true | _ -> false) oks)
       end);

    attach_show_hide (Dom.document#getElementById "signup_code");
end

module Bounce =
struct
  let get id = D.document#getElementById id
  
  let onload () =
    let paddle_radius = 25. in
    let ball_radius = 5. in
    let xmin = 0. in
    let xmax = 900. in
    let ymin = 0. in
    let ymax = 400. in
  
    let init_p = (Random.float xmax, Random.float ymax) in
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
        let x = if x < xmin then xmin else if x > xmax then xmax else x in
        let y = if y < ymin then ymin else if y > ymax then ymax else y in
        (x, y)
      end in
  
    let paddle = F.blift paddle_point (fun p -> Fda.disk p paddle_radius (Fda.color 255 0 0)) in
  
    let ball_point =
      F.fix_b begin fun bp ->
  
        let x_out_of_bounds =
          bp |>
            F.lift (fun (x, _) -> x <= xmin || x >= xmax) |>
              F.when_true |>
                F.map (fun () -> `X_bounds) in
  
        let y_out_of_bounds =
          bp |>
            F.lift (fun (_, y) -> y <= ymin || y >= ymax) |>
              F.when_true |>
                F.map (fun () -> `Y_bounds) in

        (*
          the merge below reports only the leftmost simultaneous event,
          so we have to account for the combination to avoid losing the
          ball in the corners. is there a more compositional way?
        *)
        let xy_out_of_bounds =
          F.map2 (fun _ _ -> `Xy_bounds) x_out_of_bounds y_out_of_bounds in
  
        let hit_paddle =
          bp |>
            F.lift begin fun (x, y) ->
              let (px, py) = F.sample paddle_point in
              let dist_x = px -. x in
              let dist_y = py -. y in
              let dist = paddle_radius +. ball_radius in
              dist_x *. dist_x +. dist_y *. dist_y <= dist *. dist
            end |>
              F.when_true |>
                F.map (fun () -> `Paddle) in
  
        let v =
          F.fix_b begin fun v ->
            F.merge [ xy_out_of_bounds; x_out_of_bounds; y_out_of_bounds; hit_paddle ] |>
              F.map begin fun e ->
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
              end |>
                F.hold init_v
          end in
  
        Fd.ticks 20. |>
          F.collect_b
            (fun (x, y) () -> let vx, vy = F.sample v in (x +. vx, y +. vy))
            init_p
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
        F.collect_b
          (fun p e ->
             match e#_get_keyCode with
               | 37 -> Util.prev pages p
               | 39 -> Util.next pages p
               | _ -> p)
          curr_page in
  (* track page history *)
  F.notify_b page (fun p -> Dom.window#_get_location#_set_hash p);

  (* show only the current page *)
  Array.iter
    (fun p ->
       F.blift page (fun p' -> if p = p' then "" else "none") |>
           Fd.attach_display_b (Dom.document#getElementById p))
    pages;

  (* elapsed time *)
  Fd.ticks 1000. |>
      F.count |>
          F.lift (fun t ->
                    let m = t / 60 in
                    let s = t mod 60 in
                    Printf.sprintf "%02d:%02d" m s) |>
              Fd.attach_innerHTML_b (Dom.document#getElementById "nav_time");

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
      | "fritter" -> Fritter.onload ()
      | "sudoku" -> Sudoku.onload ()
      | "signup" -> Signup.onload ()
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
