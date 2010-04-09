open OUnit

open Froc_afp

let tests = "Afp" >::: [
  "lift" >:: begin fun () ->
    let adds = ref 0 in
    let muls = ref 0 in
    let (+) = lift2 (fun a b -> incr adds; a + b) in
    let ( * ) = lift2 (fun a b -> incr muls; a * b) in
    let assert_adds n = assert_equal ~printer:string_of_int n !adds in
    let assert_muls n = assert_equal ~printer:string_of_int n !muls in

    let x = changeable 5 in
    let y = changeable 6 in
    let z = changeable 7 in
    let w = x + y * z in
    let assert_w n = assert_equal ~printer:string_of_int n (read w) in

    assert_w 47;
    assert_adds 1;
    assert_muls 1;

    adds := 0;
    muls := 0;
    write x 6;
    propagate ();
    assert_w 48;
    assert_adds 1;
    assert_muls 0;

    adds := 0;
    muls := 0;
    write y 5;
    propagate ();
    assert_w 41;
    assert_adds 1;
    assert_muls 1;
  end;

  "length" >:: begin fun () ->
    let module L =
        struct
          type 'a lst = Nil | Cons of 'a * 'a lst t
        end in

    let lengths = ref 0 in
    let rec length l =
      l >>= fun l ->
        incr lengths;
        match l with
          | L.Nil -> return 0
          | L.Cons (_, l) ->
              length l >>= fun len -> return (len + 1) in
    let assert_lengths n = assert_equal ~printer:string_of_int n !lengths in

    let l3 = changeable L.Nil in
    let l2 = changeable (L.Cons (2, l3)) in
    let l1 = changeable (L.Cons (1, l2)) in
    let l0 = changeable (L.Cons (0, l1)) in

    let len = length l0 in
    let assert_len n = assert_equal ~printer:string_of_int n (read len) in

    assert_len 3;
    assert_lengths 4;

    lengths := 0;
    write l2 L.Nil;
    propagate ();
    assert_len 2;
    assert_lengths 1;

    lengths := 0;
    let l4 = changeable (L.Cons (4, l1)) in
    write l0 (L.Cons (0, l4));
    propagate ();
    assert_len 3;
    assert_lengths 4
  end;

  "length_memo" >:: begin fun () ->
    let module L =
        struct
          type 'a lst = Nil | Cons of 'a * 'a lst t
        end in

    let lengths = ref 0 in
    let memo = memo () in
    let rec length l =
      l >>= fun l ->
        incr lengths;
        match l with
          | L.Nil -> return 0
          | L.Cons (_, l) ->
              memo length l >>= fun len -> return (len + 1) in
    let length l = memo length l in
    let assert_lengths n = assert_equal ~printer:string_of_int n !lengths in

    let l3 = changeable L.Nil in
    let l2 = changeable (L.Cons (2, l3)) in
    let l1 = changeable (L.Cons (1, l2)) in
    let l0 = changeable (L.Cons (0, l1)) in

    let len = length l0 in
    let assert_len n = assert_equal ~printer:string_of_int n (read len) in

    assert_len 3;
    assert_lengths 4;

    lengths := 0;
    write l1 (L.Cons (1, l3));
    let l4 = changeable (L.Cons (4, l1)) in
    write l0 (L.Cons (0, l4));
    propagate ();
    assert_len 3;
    assert_lengths 3
  end
]
