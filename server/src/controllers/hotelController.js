/**
 * 酒店控制器 - 管理端 API
 */
const { findHotelByName, findHotelRoom, addHotel, updateHotel, addRoom, updateRoom, findMyHotels, updatePriceStart, findHotelById } = require('../models/hotelModule.js')

/**
 * 酒店控制器 - 移动端 API
 */
const Hotel = require('../models/Hotel')


// ==================== 管理端接口 ====================

exports.updateHotelAndRoom = async (req, res) => {
    //查询酒店是否存在
    const hotel = await findHotelByName(req.body.name)
    if(!hotel) {
        return res.status(404).json({message: 'Hotel not found'})
    }

    //更新酒店字段
    const updatedHotel = await updateHotel(req.body)
    if(!updateHotel) {
        return res.status(500).json({message: 'Failed to update hotel'})
    }

    //更新房间字段
    const rooms = req.body.rooms
    let minimumPrice = Infinity
    for( const room of rooms ) {
        if(room.price < minimumPrice) {
            minimumPrice = room.price
        }
        const addRoomResult = await addRoom({...room, hotel_id: req.body.hotel_id})
        if(!addRoomResult) {
            return res.status(500).json({message: 'Failed to add room'})
        }
    }
    const updatePriceResult = await updatePriceStart(req.body.hotel_id, minimumPrice)
    if(!updatePriceResult) {
        return res.status(500).json({message: 'Failed to update price'})
    }
    res.status(200).json({message: 'Hotel&Room updated successfully', hotel: updatedHotel})
}

//新增酒店(基础信息)
exports.addHotel = async(req, res) => {
    //查询酒店名称是否已存在
    const existHotel = await findHotelByName(req.body.name)
    if(existHotel) {
        return res.status(400).json({messaage: 'Hotel name already exist'})
    }

    const addHotelResult = await addHotel(req.body)
    if(!addHotelResult) {
        return res.status(500).json({message: 'Failed to add hotel'})
    }

    res.status(200).json({message: 'Hotel added successfully', hotel: addHotel})
}

//获取商户名下酒店列表
exports.getMyHotels = async (req, res) => {
    const {merchant_id} = req.body

    const hotels = await findMyHotels(merchant_id)
    if(!hotels) {
        return res.status(200).json({message: 'Hotels found successfully', hotels})
    } else {
        return res.status(200).json({message: 'Hotels found successfully', hotels})
    }
}

//根据id获取酒店信息&&房间信息
exports.getHotelInfo = async (req, res) => {
    const {hotel_id} = req.body
    const hotelResult = await findHotelById(hotel_id)
    if(!hotelResult) {
        return res.status(200).json({message: 'Hotel found successfully', hotel: hotelResult})
    } else {
        return res.status(200).json({message: 'Hotel found successfully', hotel: hotelResult})
    }

    const roomsResult = await findHotelRoom(hotel_id)
    if(!roomsResult) {
        return res.status(200).json({message: 'Rooms found successfully', rooms: roomsResult})
    } else {
        return res.status(200).json({message: 'Rooms found successfully', rooms: roomsResult})
    }
}


// ==================== 移动端接口 ====================

/**
 * 获取酒店列表
 * GET /api/hotels/list
 */
exports.getList = async (req, res) => {
  try {
    const data = await Hotel.getList(req.query)
    console.log('✅ 数据库查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取酒店详情
 * GET /api/hotels/:id
 */
exports.getDetail = async (req, res) => {
  const { id } = req.params

  try {
    const data = await Hotel.getDetail(id)
    if (data) {
      console.log('✅ 数据库查询成功')
      return res.json({ code: 200, data })
    }
    res.status(404).json({ code: 404, message: '酒店不存在' })
  } catch (error) {
    console.error('❌ 酒店详情查询失败:', error)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取推荐酒店
 * GET /api/hotels/recommend
 */
exports.getRecommend = async (req, res) => {
  try {
    const data = await Hotel.getRecommend(req.query)
    console.log('✅ 数据库查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 搜索酒店
 * GET /api/hotels/search
 */
exports.search = async (req, res) => {
  const { keyword, useFulltext } = req.query

  try {
    let data
    if (useFulltext === 'true' && keyword) {
      data = await Hotel.fulltextSearch(req.query)
    } else {
      data = await Hotel.getList(req.query)
    }
    console.log('✅ 数据库搜索成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
