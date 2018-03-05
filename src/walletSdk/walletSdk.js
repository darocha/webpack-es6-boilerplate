import axios from 'axios';
import StellarHDWallet from 'stellar-hd-wallet';

// mnemonics with different lengths
// StellarHDWallet.generateMnemonic() // 24 words
// StellarHDWallet.generateMnemonic({entropyBits: 224}) // 21 words
// StellarHDWallet.generateMnemonic({entropyBits: 160}) // 18 words
// StellarHDWallet.generateMnemonic({entropyBits: 128}) // 12 words
// StellarHDWallet.generateMnemonic({language: 'french', entropyBits: 128})
// {language: 'chinese_traditional'}

export const RECOVER_KEYPAIR = 'RECOVER_KEYPAIR';
export const GENERATE_KEYPAIR = 'GENERATE_KEYPAIR';
export const UPDATE_FRIENDBOT_TARGET = 'UPDATE_FRIENDBOT_TARGET';
export const START_FRIENDBOT_REQUEST = 'START_FRIENDBOT_REQUEST';
export const FINISH_FRIENDBOT_REQUEST = 'FINISH_FRIENDBOT_REQUEST';

export function generateKeypair(passphrase, idx = 0) {

	const mnemonic = StellarHDWallet.generateMnemonic(); // 24 words
	const wallet = StellarHDWallet.fromMnemonic(mnemonic, passphrase);
	let keypair = wallet.getKeypair(idx); // 0 = main account 

	return {
		type: GENERATE_KEYPAIR,
		publicAddress: keypair.publicKey(),
		privateKey: keypair.secret(),
		mnemonic: mnemonic
	};
}

export function recoverKeypair(mnemonic, passphrase, idx = 0) {
	
	const wallet = StellarHDWallet.fromMnemonic(mnemonic, passphrase);
	let keypair = wallet.getKeypair(idx); // 0 = main account 

	return {
		type: RECOVER_KEYPAIR,
		publicAddress: keypair.publicKey(),
		privateKey: keypair.secret(),
		mnemonic: mnemonic
	};
}

export function fundTestAccount(publicAddress) {
    
	axios.get('https://horizon-testnet.stellar.org/friendbot?addr=' + publicAddress)
		.then(r => {
			console.log(r);
		})
		.catch(e => {
			let code, message;
			if (e.status === 0) {
				code = '';
				message = 'Unable to reach Horizon server at https://horizon-testnet.stellar.org';
			} else {
				code = JSON.stringify(e.data, null, 2);
				message = `Failed to fund ${publicAddress} on the test network`;
			}
			console.log(code,message);
		});
}
