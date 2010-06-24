module D = Dom
module F = Froc
module Fd = Froc_dom
module Fda = Froc_dom_anim

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
    "reactive";
    "gui";
    "mvc";
    "frp";
    "ocaml_etc";
    "frp_events";
    "frp_behaviors";
    "dyn_deps";
    "output";
    "implementation";
    "why_ocaml";
  ]

  let next = Util.next pages
  let prev = Util.prev pages
  let number = Util.number pages
end

module Title =
struct
  let title_sizes = [
    "Reactive Programming", 100;
    "<em>Functional</em> Reactive Programming", 68;
    "Functional Reactive Programming in <em>OCaml</em>", 52;
    "Functional Reactive Programming in OCaml and <em>Javascript</em>", 38;
    "Functional Reactive Programming in OCaml and Javascript with <em>ocamljs</em> and <em>froc</em>", 28;
  ]
  let titles = List.map fst title_sizes

  let next = Util.next titles
  let prev = Util.prev titles

  let page () =
    let title =
      Fd.keyEvent "keydown" Dom.document |>
          F.collect
            (fun p e ->
               match e#_get_keyCode with
                 | 38 -> prev p
                 | 40 -> next p
                 | _ -> p)
            (List.hd titles) |>
                F.hold (List.hd titles) in
    let tt = Dom.document#getElementById "title_title" in
    Fd.attach_innerHTML_b tt title;
    Fd.attach_fontSize_b tt (F.blift title (fun t -> string_of_int (List.assoc t title_sizes) ^ "px"));
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
      | "title" -> Title.page ()
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
