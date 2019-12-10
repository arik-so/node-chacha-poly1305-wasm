import Chacha from '../src/chacha';
import chai = require('chai');

const assert = chai.assert;

describe('Chacha Poly1305 Test', () => {
	it('should encrypt some data', () => {
		const key = Buffer.from('908b166535c01a935cf1e130a5fe895ab4e6f3ef8855d87e9b7581c4ab663ddc', 'hex');
		const nonce = Buffer.from('000000000100000000000000', 'hex');
		const aad = Buffer.from('90578e247e98674e661013da3c5c1ca6a8c8f48c90b485c0dfa1494e23d56d72', 'hex');
		const plaintext = Buffer.from('034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa', 'hex');

		const ciphertext = Chacha.encrypt(key, nonce, aad, plaintext);
		assert.equal(ciphertext.toString('hex'), 'b9e3a702e93e3a9948c2ed6e5fd7590a6e1c3a0344cfc9d5b57357049aa22355361aa02e55a8fc28fef5bd6d71ad0c3822');
	});

	it('should decrypt same data', () => {
		const key = Buffer.from('908b166535c01a935cf1e130a5fe895ab4e6f3ef8855d87e9b7581c4ab663ddc', 'hex');
		const nonce = Buffer.from('000000000100000000000000', 'hex');
		const aad = Buffer.from('90578e247e98674e661013da3c5c1ca6a8c8f48c90b485c0dfa1494e23d56d72', 'hex');
		const ciphertext = Buffer.from('b9e3a702e93e3a9948c2ed6e5fd7590a6e1c3a0344cfc9d5b57357049aa22355361aa02e55a8fc28fef5bd6d71ad0c3822', 'hex');

		const plaintext = Chacha.decrypt(key, nonce, aad, ciphertext);
		assert.equal(plaintext.toString('hex'), '034f355bdcb7cc0af728ef3cceb9615d90684bb5b2ca5f859ab0f0b704075871aa');
	});

	it('should mess with AAD', () => {
		const key = Buffer.from('908b166535c01a935cf1e130a5fe895ab4e6f3ef8855d87e9b7581c4ab663ddc', 'hex');
		const nonce = Buffer.from('000000000100000000000000', 'hex');
		const aad = Buffer.from('90578e247e98674e661013da3c5c1ca6a8c8f48c90b485c0dfa1494e23d56d72', 'hex');
		const ciphertext = Buffer.from('b9e3a702e93e3a9948c2ed6e5fd7590a6e1c3a0344cfc9d5b57357049aa22355362aa02e55a8fc28fef5bd6d71ad0c3822', 'hex');

		assert.throws(() => {
			Chacha.decrypt(key, nonce, aad, ciphertext);
		}, 'Chacha decryption failed');
	});
});
