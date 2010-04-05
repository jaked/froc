open OUnit

let tests = "Froc" >::: [
  Afp.tests
]

;;

OUnit.run_test_tt_main tests
