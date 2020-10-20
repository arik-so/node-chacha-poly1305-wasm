
import {TextEncoder, TextDecoder} from "./text_codecs.js";


let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
	if (idx < 36) return;
	heap[idx] = heap_next;
	heap_next = idx;
}

function takeObject(idx) {
	const ret = getObject(idx);
	dropObject(idx);
	return ret;
}

function addHeapObject(obj) {
	if (heap_next === heap.length) heap.push(heap.length + 1);
	const idx = heap_next;
	heap_next = heap[idx];

	heap[idx] = obj;
	return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
	if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
		cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
	}
	return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
	return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function debugString(val) {
	// primitive types
	const type = typeof val;
	if (type == 'number' || type == 'boolean' || val == null) {
		return  `${val}`;
	}
	if (type == 'string') {
		return `"${val}"`;
	}
	if (type == 'symbol') {
		const description = val.description;
		if (description == null) {
			return 'Symbol';
		} else {
			return `Symbol(${description})`;
		}
	}
	if (type == 'function') {
		const name = val.name;
		if (typeof name == 'string' && name.length > 0) {
			return `Function(${name})`;
		} else {
			return 'Function';
		}
	}
	// objects
	if (Array.isArray(val)) {
		const length = val.length;
		let debug = '[';
		if (length > 0) {
			debug += debugString(val[0]);
		}
		for(let i = 1; i < length; i++) {
			debug += ', ' + debugString(val[i]);
		}
		debug += ']';
		return debug;
	}
	// Test for built-in
	const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
	let className;
	if (builtInMatches.length > 1) {
		className = builtInMatches[1];
	} else {
		// Failed to match the standard '[object ClassName]'
		return toString.call(val);
	}
	if (className == 'Object') {
		// we're a user defined class or Object
		// JSON.stringify avoids problems with cycles, and is generally much
		// easier than looping through ownProperties of `val`.
		try {
			return 'Object(' + JSON.stringify(val) + ')';
		} catch (_) {
			return 'Object';
		}
	}
	// errors
	if (val instanceof Error) {
		return `${val.name}: ${val.message}\n${val.stack}`;
	}
	// TODO we could test for more things here, like `Set`s and `Map`s.
	return className;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
	? function (arg, view) {
		return cachedTextEncoder.encodeInto(arg, view);
	}
	: function (arg, view) {
		const buf = cachedTextEncoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
		};
	});

function passStringToWasm0(arg, malloc, realloc) {

	if (realloc === undefined) {
		const buf = cachedTextEncoder.encode(arg);
		const ptr = malloc(buf.length);
		getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
	}

	let len = arg.length;
	let ptr = malloc(len);

	const mem = getUint8Memory0();

	let offset = 0;

	for (; offset < len; offset++) {
		const code = arg.charCodeAt(offset);
		if (code > 0x7F) break;
		mem[ptr + offset] = code;
	}

	if (offset !== len) {
		if (offset !== 0) {
			arg = arg.slice(offset);
		}
		ptr = realloc(ptr, len, len = offset + arg.length * 3);
		const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
		const ret = encodeString(arg, view);

		offset += ret.written;
	}

	WASM_VECTOR_LEN = offset;
	return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
	if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
		cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
	}
	return cachegetInt32Memory0;
}

function passArray8ToWasm0(arg, malloc) {
	const ptr = malloc(arg.length * 1);
	getUint8Memory0().set(arg, ptr / 1);
	WASM_VECTOR_LEN = arg.length;
	return ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
	if (stack_pointer == 1) throw new Error('out of js stack');
	heap[--stack_pointer] = obj;
	return stack_pointer;
}

function handleError(f) {
	return function () {
		try {
			return f.apply(this, arguments);

		} catch (e) {
			wasm.__wbindgen_exn_store(addHeapObject(e));
		}
	};
}

// const imports = {};
// imports.wbg = {};
// imports.wbg.__wbindgen_number_new = function(arg0) {
// 	var ret = arg0;
// 	return addHeapObject(ret);
// };
// imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
// 	var ret = getStringFromWasm0(arg0, arg1);
// 	return addHeapObject(ret);
// };
// imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
// 	takeObject(arg0);
// };
// imports.wbg.__wbindgen_is_object = function(arg0) {
// 	const val = getObject(arg0);
// 	var ret = typeof(val) === 'object' && val !== null;
// 	return ret;
// };
// imports.wbg.__wbg_log_3bafd82835c6de6d = function(arg0) {
// 	console.log(getObject(arg0));
// };
// imports.wbg.__wbg_call_acb1ec2343d35cab = handleError(function(arg0, arg1, arg2, arg3) {
// 	var ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
// 	return addHeapObject(ret);
// });
// imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
// 	var ret = debugString(getObject(arg1));
// 	var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
// 	var len0 = WASM_VECTOR_LEN;
// 	getInt32Memory0()[arg0 / 4 + 1] = len0;
// 	getInt32Memory0()[arg0 / 4 + 0] = ptr0;
// };
// imports.wbg.__wbindgen_throw = function(arg0, arg1) {
// 	throw new Error(getStringFromWasm0(arg0, arg1));
// };
//
// module.exports = imports.wbg;

const imports = {};
imports.wbg = {};
imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
	takeObject(arg0);
};
imports.wbg.__wbindgen_number_new = function(arg0) {
	var ret = arg0;
	return addHeapObject(ret);
};
imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
	var ret = getStringFromWasm0(arg0, arg1);
	return addHeapObject(ret);
};
imports.wbg.__wbindgen_is_object = function(arg0) {
	const val = getObject(arg0);
	var ret = typeof(val) === 'object' && val !== null;
	return ret;
};
imports.wbg.__wbg_log_3bafd82835c6de6d = function(arg0) {
	console.log(getObject(arg0));
};
imports.wbg.__wbg_call_acb1ec2343d35cab = handleError(function(arg0, arg1, arg2, arg3) {
	var ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
	return addHeapObject(ret);
});
imports.wbg.__wbg_buffer_49131c283a06686f = function(arg0) {
	var ret = getObject(arg0).buffer;
	return addHeapObject(ret);
};
imports.wbg.__wbg_newwithbyteoffsetandlength_c0f38401daad5a22 = function(arg0, arg1, arg2) {
	var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
	return addHeapObject(ret);
};
imports.wbg.__wbg_new_9b295d24cf1d706f = function(arg0) {
	var ret = new Uint8Array(getObject(arg0));
	return addHeapObject(ret);
};
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
	var ret = debugString(getObject(arg1));
	var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
	var len0 = WASM_VECTOR_LEN;
	getInt32Memory0()[arg0 / 4 + 1] = len0;
	getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
	throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
	var ret = wasm.memory;
	return addHeapObject(ret);
};

export const {
	__wbindgen_object_drop_ref,
	__wbindgen_number_new,
	__wbindgen_string_new,
	__wbindgen_is_object,
	__wbg_log_3bafd82835c6de6d,
	__wbg_call_acb1ec2343d35cab,
	__wbg_buffer_49131c283a06686f,
	__wbg_newwithbyteoffsetandlength_c0f38401daad5a22,
	__wbg_new_9b295d24cf1d706f,
	__wbindgen_debug_string,
	__wbindgen_throw,
	__wbindgen_memory
} = imports.wbg;
