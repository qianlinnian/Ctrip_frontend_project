/**
 * 酒店路由
 */
const express = require('express')
const router = express.Router()
const { hotelController } = require('../controllers')

// GET /api/hotels/list - 获取酒店列表
router.get('/list', hotelController.getList)

// GET /api/hotels/recommend - 获取推荐酒店
router.get('/recommend', hotelController.getRecommend)

// GET /api/hotels/search - 搜索酒店
router.get('/search', hotelController.search)

// GET /api/hotels/:id - 获取酒店详情
router.get('/:id', hotelController.getDetail)

module.exports = router

