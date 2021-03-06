CURRENT_DIR = $(shell pwd)
HAS_WASM_PACK = $(shell which wasm-pack)

verify:
	if [ -z "$(HAS_WASM_PACK)" ]; then echo "Verified: WASM is installed!"; fi
	echo "finito!"

setup:
	if [ -z "$(HAS_WASM_PACK)" ]; then cargo install wasm-pack; fi
	npm install
	# cargo build --manifest-path=./native/Cargo.toml

compile:
	wasm-pack build -t nodejs -d $(CURRENT_DIR)/bin $(CURRENT_DIR)/native
	rm $(CURRENT_DIR)/bin/package.json
	npm run tsc

check:
	npm test
