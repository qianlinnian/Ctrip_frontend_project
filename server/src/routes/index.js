/**
 * 路由统一入口
 */
const express = require('express')
const router = express.Router()

const hotelRoutes = require('./hotel')
const roomRoutes = require('./room')
const cityRoutes = require('./city')
const bookingRoutes = require('./booking')

// 挂载路由
router.use('/hotels', hotelRoutes)
router.use('/rooms', roomRoutes)
router.use('/cities', cityRoutes)
router.use('/bookings', bookingRoutes)

module.exports = router

