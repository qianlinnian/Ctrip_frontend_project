/**
 * 城市路由
 */
const express = require('express')
const router = express.Router()
const { cityController } = require('../controllers')

// GET /api/cities - 获取所有城市
router.get('/', cityController.getAll)

// GET /api/cities/hot - 获取热门城市
router.get('/hot', cityController.getHot)

// GET /api/cities/search - 搜索城市
router.get('/search', cityController.search)

// GET /api/cities/with-hotels - 获取有酒店的城市
router.get('/with-hotels', cityController.getCitiesWithHotels)

module.exports = router


