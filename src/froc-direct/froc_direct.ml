let active_prompt = ref None

let direct f =
  let t, u = Froc_ddg.make_changeable () in
  let p = Delimcc.new_prompt () in
  active_prompt := Some p;

  Delimcc.push_prompt p begin fun () ->
    let r =
      try Froc_ddg.Value (f ())
      with e -> Froc_ddg.Fail e in
    active_prompt := None;
    Froc_ddg.write_result u r
  end;
  (Obj.magic t : _ Froc.behavior)

let read t =
  let p =
    match !active_prompt with
      | None -> failwith "read called outside direct"
      | Some p -> p in
  active_prompt := None;

  Delimcc.shift0 p begin fun k ->
    Froc.notify_result_b t begin fun _ ->
      active_prompt := Some p;
      k ()
    end
  end;
  Froc.sample t

let (~|) = direct
let (~.) = read
