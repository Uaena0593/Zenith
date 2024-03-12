const express = require('express');
const cors = require('cors');
const Mnemonic = require('bitcore-mnemonic');
const ecc = require('tiny-secp256k1');
const assert = require('assert')
const app = express();
const bip39 = require('bip39')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc)
const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');
app.use(express.json())
app.use(cors());

const PORT = 8000;

app.get('/recovery', async (req, res) => {
    try{
        const { passphrase } = req.query;
        var code = new Mnemonic();
        var mnemonic_code = code.toString();
        console.log(mnemonic_code);

        var xpriv;
        if (passphrase) {
            xpriv = code.toHDPrivateKey(passphrase);
        } else {
            xpriv = code.toHDPrivateKey();
        }
        res.json({ mnemonic: mnemonic_code, xpriv });
    } catch(error){
        console.log(error)
    }
});
app.get('/createKeys', async (req, res) => {
    const { xpriv, numKeys, rootPrivateKey } = req.query;
    const path = `m/44'/0'/0'/0/0`;

    try {
        if (!xpriv) {
            return res.status(400).send("Missing xpriv key");
        }
        if (!numKeys) { 
            return res.status(400).send("Missing numKeys");
        }
        const derivedKeys = [];
        for (let i = 0; i < numKeys; i++) {
            const rootNode = bip32.fromBase58(xpriv);
            const childNode = rootNode.derivePath(`${path}/${i}`);
            const publicKey = childNode.publicKey;
            const privateKeyWIF = childNode.toWIF();
            const publicKeyBuffer = Buffer.from(publicKey, 'hex');
            const publicKeyHex = publicKeyBuffer.toString('hex');
            const address = bitcoin.payments.p2pkh({ pubkey: publicKeyBuffer }).address;

            derivedKeys.push({
                address: address,
                publicKey: publicKeyHex,
                privateKey: privateKeyWIF
            });
        }
        res.json(derivedKeys)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
