const express = require('express');
const cors = require('cors');
const Mnemonic = require('bitcore-mnemonic');
const app = express();

app.use(cors());

const PORT = 8000;
var code = new Mnemonic();

var mnemonic_code = code.toString();
console.log(mnemonic_code);
var code1 = 'select scout crash enforce riot rival spring whale hollow radar rule sentence';
var valid = Mnemonic.isValid(code1);
console.log(valid)
var xpriv1 = code.toHDPrivateKey();
var xpriv2 = code.toHDPrivateKey('my passphrase');
console.log(xpriv1)
console.log(xpriv2)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
