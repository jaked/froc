IFDEF DEBUG
THEN
class type console =
object
  method log : string -> unit
end
let console = (Ocamljs.var "console" : console)
ENDIF

module D = Dom
let d = D.document

module F = Froc
module Fd = Froc_dom
let (>>=) = F.(>>=)

(* XXX should be part of froc *)
let make_cell ?eq v =
  let ev = F.make_event () in
  let cell = F.hold ?eq v ev in
  let set v = F.send ev v in
  (cell, set)
let notify_e e f =
  F.notify_e e (function
    | F.Fail _ -> ()
    | F.Value v -> f v)
let notify_b b f =
  F.notify_b b (function
    | F.Fail _ -> ()
    | F.Value v -> f v)

(* XXX should be part of froc-dom *)
let attach_input_value i b =
  notify_e (F.changes b) (fun v -> i#_set_value v)
let attach_backgroundColor e b =
  notify_e (F.changes b) (fun v -> e#_get_style#_set_backgroundColor v)

let make_board () =
  let make_input () =
    let input = (d#createElement "input" : D.input) in
    input#setAttribute "type" "text";
    input#_set_size 1;
    input#_set_maxLength 1;
    let style = input#_get_style in
    style#_set_border "none";
    style#_set_padding "0px";

    let (cell, set) = make_cell None in
    attach_input_value input
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
    notify_e ev set;
    (cell, set, input) in

  let rows =
    Array.init 9 (fun i ->
      Array.init 9 (fun j ->
        make_input ())) in

  let adjacents i j =
    let adj i' j' =
      (i' <> i || j' <> j) &&
        (i' = i or j' = j or
            (i' / 3 = i / 3 && j' / 3 = j / 3)) in
    let rec adjs i' j' l =
      match i', j' with
        | 9, _ -> l
        | _, 9 -> adjs (i'+1) 0 l
        | _, _ ->
            let l =
              if adj i' j'
              then
                let (cell,_,_) = rows.(i').(j') in
                cell::l
              else l in
            adjs i' (j'+1) l in
    adjs 0 0 [] in

  ArrayLabels.iteri rows ~f:(fun i row ->
    ArrayLabels.iteri row ~f:(fun j (cell, _, input) ->
      attach_backgroundColor input
        (F.bindN (adjacents i j) (fun adjs ->
          cell >>= fun v ->
            if v <> None && List.mem v adjs
            then F.return "#ff0000"
            else F.return "#ffffff"))));

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

let (>>=) = Lwt.(>>=)

IFDEF FAKE_SERVER
THEN
module Server =
  Proto_js_clnt.Lwt(struct
    let with_client f =
      let r = string_of_int (Random.int 38) in
      f (Orpc_js_client.create r)
  end)
ELSE
module Server =
  Proto_js_clnt.Lwt(struct let with_client f = f (Orpc_js_client.create "/sudoku") end)
ENDIF

let get_board rows _ =
  ignore
    (Lwt.catch
        (fun () ->
          Server.get_board () >>= fun board ->
            for i = 0 to 8 do
              for j = 0 to 8 do
                let (_,set,input) = rows.(i).(j) in
                let v = board.(i).(j) in
                input#_set_disabled (v <> None);
                set v;
              done
            done;
            Lwt.return ())
        (fun e ->
          IFDEF DEBUG THEN console#log (Obj.magic e) ENDIF;
          Lwt.return ()));
  false

let onload () =
  let (rows, table) = make_board () in
  let new_game = d#getElementById "new_game" in
  new_game#_set_onclick (Ocamljs.jsfun (get_board rows));
  let board = d#getElementById "board" in
  ignore (board#appendChild table)

;;

D.window#_set_onload (Ocamljs.jsfun onload)
