const pool = require('../config/database')


const findMyHotels = async(merchant_id) => {
    console.log('request in findMyHotels, merchant_id', merchant_id)
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE merchant_id = ?', [merchant_id])
    return rows
}

//酒店操作
const findHotelByName = async(name) => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE name = ?', [name])
    return rows[0]
}


const findHotelRoom = async(hotelid) => {
    const [rows] = await pool.execute('SELECT * FROM room WHERE hotel_id = ?', [hotelid])
    return rows[0]
}




const addHotel = async(hotelData) => {
    const {merchant_id, name, city, address, star, phone, description, images, license, status} = hotelData
    //console.log('addHotel:', hotelData)
    if(!merchant_id || !name || !city || !address || !phone || !description || !images || !license || !status) {
        console.log('hotelData Missing required fields', hotelData)
    }
    const data = [merchant_id, name, city, address, star, phone, description, images, license, status]
    console.log('data', data)
    const [rows] = await pool.execute('INSERT INTO hotel (merchant_id, name, city, address, star, phone, description, images, license, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    
    return rows
}





const updateHotel = async(hotelData) => {
    const {merchant_id, name, city, address, star, phone, description, images, liscense, status } = hotelData
    const updateData = [merchant_id, name, city, address, star, phone, description, images, liscense, status, name]

    console.log('updateData:', updateData)
    const [rows] = await pool.execute('UPDATE hotel SET merchant_id = ?, name = ?, city = ?, address = ?, star = ?, phone = ?, description = ?, images = ?, liscense = ?, status = ? WHERE name = ?', updateData)
    return rows[0]

}




//房间操作
const addRoom = async(roomData) => {
    console.log('addRoom:', roomData)
    const {hotel_id, room_type, price, room_count, room_name} = roomData
    const data = [hotel_id, room_type, price, room_count, room_name]
    console.log('roomdata', data)
    const [rows] = await pool.execute('INSERT INTO hotel_room (hotel_id,room_type, price,room_count, room_name) VALUES (?, ?, ?, ?, ?)', data)
    return rows
}



const updateRoom = async(roomData) => {
    const [rows] = await pool.execute('UPDATE room SET name = ?, type = ?, price = ?, description = ?, image = ? WHERE hotel_id = ?', roomData)
    return rows[0]
}


const updatePriceStart = async(hotel_id, minimumPrice) => {
    const data = [minimumPrice, hotel_id]
    const [rows] = await pool.execute('UPDATE hotel SET price_start = ? WHERE hotel_id = ?', data)
    return rows[0]
}


module.exports = {findHotelByName, findHotelRoom, addHotel, updateHotel, addRoom, updateRoom, findMyHotels}
