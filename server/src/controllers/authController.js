const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findUserByUsername } = require('../models/userModule')
const { generateToken } = require('../utils/jwtUtil')



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(req.body)
        // 查找用户
        const user = await findUserByUsername(username)
        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }


        //验证密码正确
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        
        const token = generateToken({id: user.id, username: user.username})

        res.json({
            success: true,
            data: {
                token, user: { id: user.id, username: user.username }
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error'})
        console.log(error)
    }
}


exports.register = async (req, res) => {
    try{
        const {username, password, email} = req.body
        
        //检查用户是否存在
        const user = await findUserByUsername(username)
        if(user) {
            return res.status(409).json({ message: 'User already exists' })
        }

        //加密密码
        const encryptedPassword = await bcrypt.hash(password, 10)
        const newUser = await createUser(username, encryptedPassword, email)
        res.json({
            success: true,
            message: '注册成功'
        })

    } catch (error) {
        res.status(500).json({ message: '注册失败' })
    }
}
