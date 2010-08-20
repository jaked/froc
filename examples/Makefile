-include ../Makefile.conf

DIRS=

ifeq ($(HAS_OCAMLJS),1)
DIRS += froc-dom
endif

ifeq ($(HAS_DELIMCC),1)
DIRS += froc-direct
endif

all:
	for dir in $(DIRS); do \
		$(MAKE) -C $$dir all || exit; \
	done

clean:
	for dir in $(DIRS); do \
		$(MAKE) -C $$dir clean || exit; \
	done
