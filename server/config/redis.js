const redis = require('redis')

const client = redis.createClient({
    host: 'localhost',
    port: 8000
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();
module.exports = { client }