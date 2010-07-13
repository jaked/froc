-include ../../Makefile.conf

FILES=\
pa_froc.cmo pa_froc.mli pa_froc.cmi \

BFILES=$(addprefix _build/,$(FILES))

all: myocamlbuild.ml
	ocamlbuild pa_froc.cmo

doc:

install:
	ocamlfind install froc-syntax META $(BFILES)

uninstall:
	ocamlfind remove froc-syntax

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml

myocamlbuild.ml:
	ln -s ../../tools/myocamlbuild.ml .
