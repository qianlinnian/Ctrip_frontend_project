const jwt = require('jsonwebtoken')

const JWT_SECRET = 'yisu2026'


//jwt token生成封装
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}


const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}
module.exports = { generateToken, verifyToken }
