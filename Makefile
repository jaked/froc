-include Makefile.conf

all:
	for pkg in $(PKGLIST); do \
		$(MAKE) -C src/$$pkg all || exit; \
	done

doc:
	for pkg in $(PKGLIST); do \
		$(MAKE) -C src/$$pkg doc || exit; \
	done
	find . -name '*.odoc' | awk '{print "-load"; print $$1}' | xargs ocamldoc -html -sort -d doc

install:
	for pkg in $(PKGLIST); do \
		$(MAKE) -C src/$$pkg install || exit; \
	done

uninstall:
	for pkg in $(PKGLIST); do \
		$(MAKE) -C src/$$pkg uninstall || exit; \
	done

clean:
	for pkg in $(PKGLIST); do \
		$(MAKE) -C src/$$pkg clean || exit; \
	done
	make -C examples clean
	rm -rf doc/*
	rm -rf stage/*

distclean: clean
	rm -rf Makefile.conf

examples:
	make -C examples

.PHONY: examples doc

gcode:
	rsync -a --delete --exclude '.svn/' doc/ ../doc/
	rsync -a --delete --exclude '.svn/' --include '*/' --include '*.html' --include '*.ml' --include '*.js' --include '*.css' --include '*.png' --exclude '*' examples/ ../examples/
