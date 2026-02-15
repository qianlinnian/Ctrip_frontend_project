import { addHotel, getHotel, updateHotel, addRoom, updateRoom } from '../models/hotelModule.js'




exports.editHotelAndRoom = async (req, res) => {
    const {name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage, rooms} = req.body

    //查询酒店是否存在

    const hotel = await findHotelByName(name)
    if(!hotel) {
        return res.status(404).json({message: 'Hotel not found'})
    }
    const updatedHotel = await updateHotel(name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage)
    if(!updateHotel) {
        return res.status(500).json({message: 'Failed to update hotel'})
    }

    const updateRoom = await updateRoom(rooms.map((room) => [room.hotel_id, room.name, room.type, room.price, room.description, room.image]))

    if(!updateRoom) {
        return res.status(500).json({message: 'Failed to update room'})
    }
    res.status(200).json({message: 'Hotel&Room updated successfully', hotel: updatedHotel})

}



exports.addHotelAndRoom = async(req, res) => {
    const {name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage, rooms} = req.body
    const addHotel = await addHotel(name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage)
    if(!addHotel) {
        return res.status(500).json({message: 'Failed to add hotel'})
    }
    const addRoom = await addRoom(rooms.map((room) => [addHotel.insertId, room.name, room.type, room.price, room.description, room.image]))
    if(!addRoom) {
        return res.status(500).json({message: 'Failed to add room'})
    }
    res.status(200).json({message: 'Hotel&Room added successfully', hotel: addHotel})
}



