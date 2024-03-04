const express = require('express');
const cors = require('cors');
const Mnemonic = require('bitcore-mnemonic');
const app = express();

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
    } catch {
        console.log(error)
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
