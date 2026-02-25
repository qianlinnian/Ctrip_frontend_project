/**
 * 标签路由
 */
const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tagController')

// 获取热门标签
router.get('/hot', tagController.getHotTags)

// 获取所有标签
router.get('/', tagController.getAllTags)

module.exports = router

