
const jwt = require('jsonwebtoken')
require('dotenv').config()

const posts = [
    {
        username: 'Kyle',
        title: 'post 1'
    }
]
function login(req,res) {
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
}
function postReq(req, res) {
    res.json(posts.filter(post => post.username === req.user.name))
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


module.exports = { login, postReq, authenticateToken};