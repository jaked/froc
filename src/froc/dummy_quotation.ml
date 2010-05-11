open Camlp4

module Id =
struct
  let name = "dummy_quotation"
  let version = "0.1"
end

module Make (Syntax : Sig.Camlp4Syntax) =
struct
  include Syntax

  ;;
  try let _ = Quotation.find "" Quotation.DynAst.expr_tag in ()
  with Not_found ->
    Quotation.translate := (fun _ -> "");
    Quotation.add "" Quotation.DynAst.expr_tag (fun _ _ _ -> <:expr@here< () >>)
end

let module M = Register.OCamlSyntaxExtension(Id)(Make) in ();
