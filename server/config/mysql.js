const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE_CONNECTION_PW,
    database: 'btcwallet'
});

module.exports = { connection };