const hotelController = require('../controllers/hotelController')
const express = require('express')
const router = express.Router()


//酒店编辑
router.post('/edit', hotelController.updateHotelAndRoom)

//酒店新增
router.post('/new', hotelController.addHotel)

//商户酒店列表
router.post('/my-hotels', hotelController.getMyHotels)

//酒店信息
router.get('/hotel-info/:hotel_id', hotelController.getHotelInfo)

module.exports = router