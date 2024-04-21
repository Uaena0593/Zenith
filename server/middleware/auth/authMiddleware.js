const jwt = require('jsonwebtoken');

function authenticateTokenMiddleware(req, res, next) {
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).send('Access token not found');
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next()
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
}

module.exports = { authenticateTokenMiddleware }