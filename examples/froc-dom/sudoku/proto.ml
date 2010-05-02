module type Sync =
sig
  val get_board : unit -> int option array array
end

module type Lwt =
sig
  val get_board : unit -> int option array array Lwt.t
end
