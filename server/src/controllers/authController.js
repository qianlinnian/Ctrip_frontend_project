const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findUserByUsername, findUserByEmail, findUserByPhone, createUser } = require('../models/userModule')
const { generateToken } = require('../utils/jwtUtil')

/* 
 * 路由对应的函数，在这里导出后在/router/authRouter.js中使用
*/ 

//登入
exports.login = async (req, res) => {
    try {
        const { account, password } = req.body
        console.log(req.body)
        // 查找用户
        const user = await findUserByUsername(account) || await findUserByEmail(account) || await findUserByPhone(account)
        if(!user) {
            console.log('User not found')
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        //验证密码正确
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            console.log('Invalid credentials')
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        
        const token = generateToken({id: user.user_id, username: user.username})
        console.log('Token:', token)
        console.log('User:', user)
        res.json({
            success: true,
            data: {
                token, user: { id: user.user_id, username: user.username }
            }
        })

    } catch (error) {
        res.status(500).json({ message: 'Server error'})
        console.log(error)
    }
}


//
exports.register = async (req, res) => {
    try{
        const {username, name, phone, email, password} = req.body
        console.log('register:',req.body)
        //检查用户是否存在
        const user = await findUserByUsername(username)
        if(user) {
            console.log('User already exists')
            return res.status(409).json({ message: 'User already exists' })
        }

        const existEmail = await findUserByEmail(email)
        if(existEmail) {
            console.log('Email already exists')
            return res.status(409).json({ message: 'Email already exists' })
        }
        

        //加密密码
        const encryptedPassword = await bcrypt.hash(password, 10)
        console.log(encryptedPassword)
        const _ = await createUser(username, name, phone, email, encryptedPassword)
        res.json({
            success: true,
            message: 'register success'
        })

    } catch (error) {
        console.error('Register failed:', error.message)
        res.status(500).json({ message: 'register failed', error: error.message })
    }
}
