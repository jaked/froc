-include ../../Makefile.conf

ifeq ($(ENABLE_OCAMLJS),1)
CMJSA=froc.cmjsa
endif

FILES=\
froc.cma froc.cmxa froc.a $(CMJSA) \
froc.mli froc.cmi \
froc_afp.mli froc_afp.cmi \
froc_ddg.mli froc_ddg.cmi \

BFILES=$(addprefix _build/,$(FILES))

all: myocamlbuild.ml
	ocamlbuild froc.cma froc.cmxa $(CMJSA)
	ocamlfind remove -destdir ../../stage froc
	ocamlfind install -destdir ../../stage froc META $(BFILES)

doc:
	ocamlbuild -no-links doc.docdir/index.html

install:
	ocamlfind install froc META $(BFILES)

uninstall:
	ocamlfind remove froc

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml

myocamlbuild.ml:
	ln -s ../../tools/myocamlbuild.ml .
