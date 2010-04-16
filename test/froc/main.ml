open OUnit

let tests = "Froc" >::: [
  Sa.tests
]

;;

OUnit.run_test_tt_main tests
