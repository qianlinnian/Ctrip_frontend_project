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

//房间类型
router.get('/room-type', hotelController.getRoomType)

//房间信息
router.get('/room-info/:hotel_id', hotelController.getRoomInfo)

router.get('/tags', hotelController.getTags)

router.get('/tags/:hotel_id', hotelController.getHotelTags)

module.exports = router
