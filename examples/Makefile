-include ../Makefile.conf

DIRS=

ifeq ($(ENABLE_OCAMLJS),1)
DIRS += froc-dom
endif

all:
	for dir in $(DIRS); do \
		$(MAKE) -C $$dir all || exit; \
	done

clean:
	for dir in $(DIRS); do \
		$(MAKE) -C $$dir clean || exit; \
	done
