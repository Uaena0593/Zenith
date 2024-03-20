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
const { login, postReq, authenticateToken } = require('./authentication/authentication')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


app.use(express.json())
app.use(cors());

const PORT = 8000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_CONNECTION_PW,
    database: 'btcwallet'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});


//creating the recovery mnemonic key`
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

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

//middleware for verification
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Access denied. No token provided.');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).send('Invalid token.');
        }
        req.user = decoded;
        next();
    });
}

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error registering user');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        try {
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                res.json({ accessToken });
            } else {
                return res.status(401).send('Invalid username or password');
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    });
});

app.get('/posts', authenticateToken, postReq)

app.get('/createKeys', async (req, res) => {
    const { xpriv, numKeys, rootPrivateKey } = req.query;
    const path = `m/44'/0'/0'/0/0`;

    try {
        if (!xpriv) {
            return res.status(400).send("missing xpriv key");
        }
        if (!numKeys) { 
            return res.status(400).send("missing numKeys");
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
