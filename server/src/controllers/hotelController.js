const { findHotelByName, findHotelRoom, insertHotel, updateHotel, addRoom, updateRoom, findMyHotels, updatePriceStart, findHotelById, getRoomType, findRoomByHotelId, insertTag, getTags, getTagsByHotelId } = require('../models/hotelModule.js')



exports.updateHotelAndRoom = async (req, res) => {
    //查询酒店是否存在
    try{
        const hotel = await findHotelByName(req.body.hotel_name)
        if(!hotel) {
            return res.status(404).json({message: 'Hotel not found'})
        }
        

        //更新酒店字段
        const updatedHotel = await updateHotel(req.body)
        if(!updateHotel) {
            return res.status(500).json({message: 'Failed to update hotel'})
        }
        console.log('Hotel updated successfully')

        //更新房间字段
        const rooms = req.body.rooms
        console.log('Rooms:', rooms)
        if(!rooms) {
            return res.status(400).json({message: 'No rooms provided'})
        }
        let minimumPrice = Infinity
        for( const room of rooms ) {
            if(room.price < minimumPrice) {
                minimumPrice = room.price
            }
            const addRoomResult = await addRoom({...room, hotel_id: req.body.hotel_id})
            console.log('Room added successfully', addRoomResult)
            if(!addRoomResult) {
                return res.status(500).json({message: 'Failed to add room'})
            }
        }
        const updatePriceResult = await updatePriceStart(req.body.hotel_id, minimumPrice)
        console.log('Price updated successfully', updatePriceResult)
        if(!updatePriceResult) {
            return res.status(500).json({message: 'Failed to update price'})
        }
        res.status(200).json({message: 'Hotel&Room updated successfully', hotel: updatedHotel})
    } catch (error) {
        console.error('Update failed:', error.message)
        res.status(500).json({ message: 'Update failed', error: error.message })
    }    
}
 


//新增酒店(基础信息)
exports.addHotel = async(req, res) => {

    //查询酒店名称是否已存在
    const existHotel = await findHotelByName(req.body.hotel_name)
    if(existHotel) {
        return res.status(400).json({messaage: 'Hotel name already exist'})
    }

    let hotelData = req.body
    hotelData = {...hotelData, audit_status: 1, publish_status: 0}
    const tags = req.body.tags
    
    const addHotelResult = await insertHotel(hotelData)
    if(!addHotelResult) {
        return res.status(500).json({message: 'Failed to add hotel'})
    }
    if(tags) {
    for(const tag of tags) {
        const insertTagResult = await insertTag({hotel_id: addHotelResult.insertId, tag_id: tag})
        if(!insertTagResult) {
            return res.status(500).json({message: 'Failed to insert tag'})
        }
    }
    }
    res.status(200).json({message: 'Hotel added successfully', hotel: addHotelResult})
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
    const {hotel_id} = req.params
    console.log('option in getHotelInfo, hotel_id=',hotel_id)
    const hotelResult = await findHotelById(hotel_id)
    if(!hotelResult) {
        return res.status(200).json({message: 'Hotel found successfully', hotel: hotelResult})
    } else {
        return res.status(200).json({message: 'Hotel found successfully', hotel: hotelResult})
    }
}

exports.getRoomInfo = async (req, res) => {
    const {hotel_id} = req.params
    const roomResult = await findRoomByHotelId(hotel_id)
    console.log('RoomResult:', roomResult)
    if(!roomResult) {
        return res.status(200).json({message: 'Room found successfully', room: roomResult})
    } else {
        return res.status(200).json({message: 'Room found successfully', room: roomResult})
    }
}


exports.getRoomType = async( req, res) => {
    const roomTypeOptions = await getRoomType()
    const options = roomTypeOptions.map(option => ({ 
        label: option.type_name,
        value: option.type_id }))
    res.status(200).json({message: 'Room type found successfully', options})
}


exports.getTags = async(req, res) => {
    const tags = await getTags()
    const options = tags.map(option => ({ 
        label: option.tag_name,
        value: option.tag_id }))
    res.status(200).json({message: 'Tags found successfully', options})
}


exports.getHotelTags = async(req, res) => {
    const hotel_id = req.params.hotel_id
    const tags = await getTagsByHotelId(hotel_id)
    const options = tags.map(option => ({ 
        label: option.tag_name,
        value: option.tag_id }))
    res.status(200).json({message: 'Hotel tags found successfully', options})
}

