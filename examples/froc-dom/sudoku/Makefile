JS=sudoku.js

all: myocamlbuild.ml
	ocamlbuild $(JS) server.byte; ln -s _build/$(JS) .

clean:
	ocamlbuild -clean
	rm -f myocamlbuild.ml $(JS)

myocamlbuild.ml:
	ln -s ../../../tools/myocamlbuild.ml
