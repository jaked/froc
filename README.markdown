`Froc` is a library for functional reactive programming in OCaml.

The interface is similar to [FrTime](http://www.cs.brown.edu/~greg/)
and [FlapJax](http://www.flapjax-lang.org/), but (of course) typed,
implementing a monad of changeable values. The implementation is
data-driven, using the dynamic dependency graphs of Acar et al.'s
[self-adjusting computation](http://ttic.uchicago.edu/~umut/projects/self-adjusting-computation/).

`Froc` can be used with [ocamljs](http://jaked.github.com/ocamljs),
and with the included `froc-dom` library can be used for web browser
programming.

See [http://jaked.github.com/froc](http://jaked.github.com/froc) for details.

For a quick start:

 1. ./configure (-disable-ocamljs if you do not have `ocamljs`)
 2. make
 3. make install
 4. make examples

`Froc` is written by [Jake Donham](http://jaked.org/).
