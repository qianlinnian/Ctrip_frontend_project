const { findHotelByName, findHotelRoom, addHotel, updateHotel, addRoom, updateRoom, findMyHotels } = require('../models/hotelModule.js')




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




exports.addHotel = async(req, res) => {

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

exports.getMyHotels = async (req, res) => {
    const {merchant_id} = req.body


    const hotels = await findMyHotels(merchant_id)
    if(!hotels) {
        return res.status(200).json({message: 'Hotels found successfully', hotels})
    } else {
        return res.status(200).json({message: 'Hotels found successfully', hotels})
    }

}

