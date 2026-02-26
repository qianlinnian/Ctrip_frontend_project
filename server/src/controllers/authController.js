const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findUserByUsername,findMerchantByUsername, findAdminByUsername, findUserByPhone, createUser } = require('../models/userModule')
const { generateToken } = require('../utils/jwtUtil')

/* 
 * 路由对应的函数，在这里导出后在/router/authRouter.js中使用
*/ 

//登入
exports.login = async (req, res) => {
    try {
        const { account, password } = req.body
        console.log(req.body)
        // 查找用户,确定身份
        const [user, merchant, admin] = await Promise.all([
            findUserByUsername(account),
            findMerchantByUsername(account),
            findAdminByUsername(account)
        ])
        let role = ''
        let target = {}
        if(user) {
            role = 'user'
            target = {
                id: user.user_id,
                username: user.username,
                password: user.password,
                role: 'user'
            }
            console.log('User found:', target)
        } else if(merchant) {
            role = 'merchant'
            target = {
                id: merchant.merchant_id,
                username: merchant.username,
                password: merchant.password,
                role: 'merchant'
            }
            console.log('Merchant found:', target)
        } else if(admin) {
            target = {
                id: admin.admin_id,
                username: admin.username,
                password: admin.password,
                role: 'admin'
            }
            console.log('Admin found:', target)
        } else {
            return res.status(404).json({ message: 'User not found' })
        }

        //验证密码正确
        console.log('Password:', password, target.password)
        const isMatch = await bcrypt.compare(password, target.password)
        if(!isMatch) {
            console.log('Invalid credentials')
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        
        const token = generateToken({id: target.id, username: target.username, role: target.role})
        console.log('Token:', token)
        console.log('User Login:', target)
        res.json({
            success: true,
            data: {
                token, user: { id: target.id, username: target.username, role: target.role }
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
        const {username,phone, email, password, role} = req.body
        console.log('register:',req.body)
        //检查用户是否存在
        const {user, merchant, admin} = await Promise.all([
            findUserByUsername(username),
            findMerchantByUsername(username),
            findAdminByUsername(username)
        ])

        if(user || merchant || admin) {
            console.log('User already exists')
            return res.status(409).json({ message: 'User already exists' })
        }

        
            //加密密码
        const encryptedPassword = await bcrypt.hash(password, 10)
        const _ = await createUser(username, phone, email, encryptedPassword, role)
        res.json({
            success: true,
            message: 'register success'
        })

    } catch (error) {
        console.error('Register failed:', error.message)
        res.status(500).json({ message: 'register failed', error: error.message })
    }
}
