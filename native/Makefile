CURRENT_DIR = $(shell pwd)
HAS_WASM_PACK = $(shell which wasm-pack)

compile-browser:
	CC=clang-9 wasm-pack build -t web -d $(CURRENT_DIR)/bin $(CURRENT_DIR)

compile-node:
	CC=clang-9 wasm-pack build -t nodejs -d $(CURRENT_DIR)/bin $(CURRENT_DIR)

wasm-to-asm:
	~/Developer/binaryen/bin/wasm2js ./bin/chacha_poly1305_rust_bg.wasm > ./bin/asm.js

asmify:
	~/Developer/binaryen/bin/wasm2js ./bin/chacha_poly1305_rust_bg.wasm

test-node:
	node ./wasm-test/node_test.js
