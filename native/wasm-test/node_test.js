// import wasmStuff from './chacha_poly1305_rust.js';
const fs= require('fs');
const wasm = fs.readFileSync(__dirname + '/../bin/chacha_poly1305_rust_bg.wasm');
const base64 = wasm.toString('base64');
fs.writeFileSync(__dirname + '/base64.js', `const wasm = '${wasm.toString('base64')}';\n\nmodule.exports.wasmString = wasm;`);
console.log(base64);



const wasmStuff = require('../bin/chacha_poly1305_rust.js');

const callback = (a, b) => {
	return a + b;
}

const initMessage = wasmStuff.perform_complicated_calculation();
// const initMessage = wasmStuff.create_init_message();
console.dir(initMessage);

// const result = wasmStuff.call_callback(callback);
// console.log(result);


