// extern crate bitcoin;
extern crate bitcoin_hashes;
// extern crate regex;

pub(crate) mod byte_utils;
pub(crate) mod chacha20;
pub mod chacha20poly1305rfc;
pub(crate) mod poly1305;


extern crate js_sys;
extern crate web_sys;


// use js_sys::WebAssembly::U
// use js_sys::*;

// extern crate bitcoin;
extern crate lightning;
use lightning::ln::msgs::Init;
use lightning::ln::features::InitFeatures;
use lightning::util::ser::Writeable;



// pub mod peer_experiments;

// use lightning::util::logger::Logger;

use wasm_bindgen::prelude::*;
use wasm_bindgen::__rt::std::io::Cursor;

#[wasm_bindgen]
pub enum Hello {
	Foo,
	Bar,
}

#[wasm_bindgen]
pub fn perform_complicated_calculation() -> u32 {
	724
}

#[wasm_bindgen]
pub fn eat_buffer(buffer: &[u8]) -> Hello {
	let someValue: &[u8] = vec![1, 2, 3].as_slice();

	let cursor = Cursor::new(buffer);

	let mut vector = buffer.to_vec();
	vector.extend_from_slice(buffer);
//	(vector, Some(3))
	Hello::Bar
}

#[wasm_bindgen]
pub struct WasmBuffer {
	pub data: *const u8,
	pub length: usize
}

#[wasm_bindgen]
// pub fn create_init_message() -> Box<[u8]> {
// pub fn create_init_message() -> Vec<u8> {
pub fn create_init_message() -> js_sys::Uint8Array {
	let init_features = InitFeatures {
		flags: vec![5, 8, 12, 32, 14],
		mark: Default::default()
	};
	let init_message = Init {
		features: init_features
	};
	let encoded = init_message.encode();
	// let encoded = vec![1, 2, 3];
	// encoded
	// WasmBuffer{
	// 	data: encoded.as_ptr(),
	// 	length: encoded.len()
	// }
	// encoded.as_ptr()
	// encoded.into_boxed_slice()
	encoded.as_slice().into()
}

#[wasm_bindgen]
pub fn call_callback(callback: &js_sys::Function) -> u32 {
	// let result = callback(23, 45);
	let this = JsValue::null();
	let x = JsValue::from(26);
	let y = JsValue::from(2);
	let sum: std::result::Result<wasm_bindgen::JsValue, wasm_bindgen::JsValue> = callback.call2(&this, &x, &y);

	let log_entry = format!("{:?}", sum);
	web_sys::console::log_1(&JsValue::from(log_entry));

	if let Ok(result) = sum {
		if result.is_object() {
			web_sys::console::log_1(&JsValue::from("it is an object!"));
			// result.into_serde()
		}
		// let sum = result.as_f64().unwrap();
		// return sum as u32;
		println!("it's ok!");
	}

	// println!("sum: {:?}", sum);

	// sum
	15
}
