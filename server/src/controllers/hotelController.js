const { findHotelByName, findHotelRoom, addHotel, updateHotel, addRoom, updateRoom } = require('../models/hotelModule.js')




exports.editHotelAndRoom = async (req, res) => {
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
    

    if(!updateRoom) {
        return res.status(500).json({message: 'Failed to update room'})
    }
    res.status(200).json({message: 'Hotel&Room updated successfully', hotel: updatedHotel})

}




exports.addHotelAndRoom = async(req, res) => {

    const existHotel = await findHotelByName(req.body.name)
    if(existHotel) {
        return res.status(400).json({messaage: 'Hotel name already exist'})
    }


    const addHotelResult = await addHotel(req.body)
    if(!addHotelResult) {
        return res.status(500).json({message: 'Failed to add hotel'})
    }

    //const rooms = req.body.rooms.map((room) => [addHotelResult.insertId, room.room_type, room.price, room.room_count])
    const rooms = req.body.rooms
    for( const room of rooms ) {

        const addRoomResult = await addRoom({...room, hotel_id: addHotelResult.insertId})
        if(!addRoomResult) {
            return res.status(500).json({message: 'Failed to add room'})
        }
    }
 
    res.status(200).json({message: 'Hotel&Room added successfully', hotel: addHotel})
}



