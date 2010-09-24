all: myocamlbuild.ml
	ocamlbuild direct.byte direct.native

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml

myocamlbuild.ml:
	ln -s ../../tools/myocamlbuild.ml
