const pool = require('../config/database')



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
    const {merchant_id, name, city, address, star, phone, description, images, liscense, status} = hotelData
    const [rows] = await pool.execute('INSERT INTO hotel (merchant_id, name, city, address, star, phone, description, images, liscense, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [merchant_id, name, city, address, star, phone, description, images, liscense, status])
    
    return rows
}


const updateHotel = async(hotelData) => {
    const {merchant_id, name, city, address, star, phone, description, images, liscense, status } = hotelData
    const [rows] = await pool.execute('UPDATE hotel SET name = ?, city = ?, address = ?, star = ?, phone = ?, description = ?, images = ?, liscense = ?, status = ? WHERE name = ?', [name, city, address, star, phone, description,images, liscense, status, name])
    return rows[0]
}




//房间操作
const addRoom = async(roomData) => {
    console.log(roomData)
    const [rows] = await pool.execute('INSERT INTO hotel_room (hotel_id,room_type, price,room_count) VALUES (?, ?, ?, ?)', roomData)
    return rows
}



const updateRoom = async(roomData) => {
    const [rows] = await pool.execute('UPDATE room SET name = ?, type = ?, price = ?, description = ?, image = ? WHERE hotel_id = ?', roomData)
    return rows
}

module.exports = {findHotelByName, findHotelRoom, addHotel, updateHotel, addRoom, updateRoom}
