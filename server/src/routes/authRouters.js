const authController = require('../controllers/authController')
const express = require('express')
const router = express.Router()


router.post('/login', authController.login) //登入路由
router.post('/register', authController.register) //注册路由



module.exports = router