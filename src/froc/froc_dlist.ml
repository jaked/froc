type 'a t = {
  data : 'a;
  mutable prev : 'a t;
  mutable next : 'a t;
}

let empty () =
  let rec t = { data = Obj.magic None; prev = t; next = t } in
  t

let add_after t d =
  let n = { data = d; prev = t; next = t.next } in
  t.next.prev <- n;
  t.next <- n;
  n

let add_before t d =
  let n = { data = d; prev = t.prev; next = t } in
  t.prev.next <- n;
  t.prev <- n;
  n

let remove t =
  t.next.prev <- t.prev; t.prev.next <- t.next;
  t.next <- t; t.prev <- t

let iter f d =
  let rec loop t =
    if not (t == d)
    then (f t.data; loop t.next) in
  loop d.next
