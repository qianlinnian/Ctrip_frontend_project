/**
 * 预订路由
 */
const express = require('express')
const router = express.Router()
const { bookingController } = require('../controllers')

// POST /api/bookings - 创建预订
router.post('/', bookingController.create)

// GET /api/bookings - 获取用户预订列表
router.get('/', bookingController.getUserBookings)

// GET /api/bookings/:id - 获取预订详情
router.get('/:id', bookingController.getDetail)

// PUT /api/bookings/:id/cancel - 取消预订
router.put('/:id/cancel', bookingController.cancel)

module.exports = router

