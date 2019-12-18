CURRENT_DIR = $(shell pwd)

setup:
	npm install
	cargo install wasm-pack
	# cargo build --manifest-path=./native/Cargo.toml

compile:
	wasm-pack build -t nodejs -d $(CURRENT_DIR)/bin $(CURRENT_DIR)/native
	rm $(CURRENT_DIR)/bin/package.json
	npm run tsc

check:
	npm test
