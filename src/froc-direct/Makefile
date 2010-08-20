FILES=\
froc-direct.cma froc-direct.cmxa froc-direct.a \
froc_direct.cmi froc_direct.mli \

BFILES=$(addprefix _build/,$(FILES))

all: myocamlbuild.ml
	OCAMLFIND_IGNORE_DUPS_IN=$(LIBDIR)/site-lib \
	OCAMLPATH=`pwd`/../../stage \
	ocamlbuild froc-direct.cma froc-direct.cmxa

doc:
	ocamlbuild -no-links doc.docdir/index.html

install:
	ocamlfind install froc-direct META $(BFILES)

uninstall:
	ocamlfind remove froc-direct

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml

myocamlbuild.ml:
	ln -s ../../tools/myocamlbuild.ml .
