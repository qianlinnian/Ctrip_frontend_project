/**
 * 房间路由
 */
const express = require('express')
const router = express.Router()
const { roomController } = require('../controllers')

// GET /api/rooms - 获取房间列表
router.get('/', roomController.getList)

// GET /api/rooms/:id - 获取房间详情
router.get('/:id', roomController.getDetail)

module.exports = router

