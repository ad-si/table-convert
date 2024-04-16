.PHONY: help
help: makefile
	@tail -n +4 makefile | grep ".PHONY"


node_modules: package.json package-lock.json
	if test ! -d $@; \
	then bun install --no-save; \
	fi


sourceFiles=$(shell find source -type f)
.PHONY: build
build: $(sourceFiles) | node_modules
	bun x tsc


.PHONY: test
test: build | node_modules
	chmod +x source/cli.js
	bun run tests/index.ts


clean:
	rm -rf node_modules
	rm -rf source/*.js
	rm -rf tests/*.js
