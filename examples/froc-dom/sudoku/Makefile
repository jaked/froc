all: myocamlbuild.ml
	ocamlbuild sudoku.js server.byte

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml

myocamlbuild.ml:
	ln -s ../../../tools/myocamlbuild.ml
