import debugModule = require('debug');
import {ChaCha20Poly1305RFC} from '../bin/chacha_poly1305_rust';

const debug = debugModule('chacha-poly1305:js');

export default class Chacha {
	/**
	 * Generate chacha stream
	 * @param key
	 * @param nonce
	 * @param associatedData
	 * @param plaintext
	 */
	public static encrypt(key: Buffer, nonce: Buffer, associatedData: Buffer, plaintext: Buffer): Buffer {
		const chacha = ChaCha20Poly1305RFC.new(key, nonce, associatedData);
		const ciphertext = Buffer.alloc(plaintext.length, 0);
		const tag = Buffer.alloc(16, 0);
		chacha.encrypt(plaintext, ciphertext, tag);

		return Buffer.concat([ciphertext, tag]);
	}

	/**
	 * Generate chacha stream
	 * @param key
	 * @param nonce
	 * @param associatedData
	 * @param taggedCiphertext
	 */
	public static decrypt(key: Buffer, nonce: Buffer, associatedData: Buffer, taggedCiphertext: Buffer): Buffer {
		const chacha = ChaCha20Poly1305RFC.new(key, nonce, associatedData);

		const rawCiphertext = taggedCiphertext.slice(0, taggedCiphertext.length - 16);
		const authenticationTag = taggedCiphertext.slice(rawCiphertext.length);

		// this should force the authentication
		let plaintext = Buffer.alloc(rawCiphertext.length);
		const didSucceed = chacha.decrypt(rawCiphertext, plaintext, authenticationTag);
		if (didSucceed) {
			debug('Decryption success');
			debug('Nonce: %d', Number(nonce));
			debug('Tagged ciphertext: %s', taggedCiphertext.toString('hex'));
		} else {
			debug('Decryption failure');
			debug('Key: %s', key.toString('hex'));
			debug('Nonce: %d', Number(nonce));
			debug('Associated data: %s', associatedData.toString('hex'));
			debug('Tagged ciphertext: %s', taggedCiphertext.toString('hex'));
			throw new Error('Chacha decryption failed');
		}

		return plaintext;
	}
}
