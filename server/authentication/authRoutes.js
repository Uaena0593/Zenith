const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connection } = require('../config/mysql')
require('dotenv').config();

function generateAccessToken(username) {
    return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' });
}

function authenticateToken(req, res) {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).send('Access token not found');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.json("authenticated");
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
}

const registerRoute = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
            if (error ) {
                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    return res.status(409).send('Username already taken'); // 409 Conflict
                }
                console.error(error);
                return res.status(500).send('Error registering user');
            }
            const accessToken = generateAccessToken(username);
            res.cookie('accessToken', accessToken, { path: '/', httpOnly: true,sameSite: 'strict', });
            res.status(201).json({ accessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
};

const logout = async (req, res) => {
    res.cookie("accessToken", "", {
        expires: new Date(0),
        httpOnly: true,
        sameSite: "strict",
    });
    res.send("Logged out");
};


const loginRoute = async (req, res) => {
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
            const accessToken = generateAccessToken(username);
            res.cookie('accessToken', accessToken, { path: '/', httpOnly: true,sameSite: 'strict', });
            res.status(201).json({ accessToken });
        } else {
            return res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
    });
};

module.exports = { registerRoute, loginRoute, authenticateToken, logout };
