const hotelController = require('../controllers/hotelController')
const express = require('express')
const router = express.Router()


//路由
router.post('/edit', hotelController.editHotelAndRoom)
router.post('/new', hotelController.addHotelAndRoom)



module.exports = router