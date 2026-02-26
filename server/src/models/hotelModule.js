const pool = require('../config/database')


const findMyHotels = async(merchant_id) => {
    console.log('request in findMyHotels, merchant_id', merchant_id)
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE merchant_id = ?', [merchant_id])
    return rows
}

//酒店操作
const findHotelByName = async(hotel_name) => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE hotel_name = ?', [hotel_name])
    return rows[0]
}

const findHotelById = async(hotelid) => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE hotel_id = ?', [hotelid])
    return rows[0]
}


const findHotelRoom = async(hotelid) => {
    const [rows] = await pool.execute('SELECT * FROM room WHERE hotel_id = ?', [hotelid])
    return rows[0]
}

const findRoomByHotelId = async(hotelid) => {
    const [rows] = await pool.execute('SELECT * FROM hotel_room WHERE hotel_id = ?', [hotelid])
    return rows
}





const insertHotel = async(hotelData) => {
    const {merchant_id, hotel_name, city, hotel_address, hotel_level, phone, description, images, audit_status, publish_status} = hotelData
    console.log('addHotel:', hotelData)
    if(!merchant_id || !hotel_name || !city || !hotel_address || hotel_level || !phone || !description || !images || !audit_status || !publish_status) {
        console.log('hotelData Missing required fields', hotelData)
    }
    const data = [merchant_id, hotel_name, city, hotel_address, hotel_level, phone, description, images, audit_status, publish_status]
    console.log('data', data)
    const [rows] = await pool.execute('INSERT INTO hotel (merchant_id, hotel_name, city, hotel_address, hotel_level, phone, description, images, audit_status, publish_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
     
    return rows
}


const getTags = async() => {
    const [rows] = await pool.execute('SELECT tag_id, tag_name FROM tag')
    return rows
}

const getTagsByHotelId = async(hotel_id) => {
    const [rows] = await pool.execute(
        `SELECT t.tag_id, t.tag_name
        FROM hotel_tag_relation r
        JOIN tag t ON r.tag_id = t.tag_id
        WHERE r.hotel_id = ?`, [hotel_id])
    return rows
}

const insertTag = async(tagData) => {
  
    const {tag_id, hotel_id} = tagData
    const data = [tag_id, hotel_id]
    console.log('insertTag:', data)
    const [rows] = await pool.execute('INSERT INTO hotel_tag_relation (tag_id, hotel_id) VALUES (?, ?)', data)
    return rows
}




const updateHotel = async(hotelData) => {
    const {merchant_id, hotel_name, city, hotel_address, score, phone, description, images, cover_image, audit_status, publish_status} = hotelData
    const updateData = [merchant_id, hotel_name, city, hotel_address, score, phone, description, images, cover_image, audit_status, publish_status, hotel_name]

    console.log('updateData:', updateData)
    const [rows] = await pool.execute('UPDATE hotel SET merchant_id = ?, hotel_name = ?, city = ?, hotel_address = ?, hotel_level = ?, phone = ?, description = ?, images = ?, cover_image = ?, audit_status = ?, publish_status = ? WHERE hotel_name = ?', updateData)
    return rows

}


 

//房间操作
const addRoom = async(roomData) => {
    console.log('addRoom:', roomData)
    const {hotel_id, room_type_id, price, room_count, images} = roomData
    const data = [hotel_id, room_type_id, price, room_count, images]
    console.log('roomdata', data)
    const [rows] = await pool.execute('INSERT INTO hotel_room (hotel_id,room_type_id, price,room_count, images) VALUES (?, ?, ?, ?, ?)', data)
    return rows
}



const updateRoom = async(roomData) => {
    const {hotel_id, room_type, price, room_count, room_name, images, description} = roomData
    const data = [room_name, room_type, price, room_count, description, images, hotel_id]
    console.log('updateRoom:', data)
    const [rows] = await pool.execute('UPDATE room SET room_name = ?, room_type = ?, price = ?, room_count = ?, description = ?, images = ? WHERE hotel_id = ?', data)
    return rows[0]
}


const getRoomType = async() => {
    const [rows] = await pool.execute('SELECT * FROM room_type')
    return rows
}


const updatePriceStart = async(hotel_id, minimumPrice) => {
    const data = [minimumPrice, hotel_id]
    console.log('updatePriceStart data:', data)
    const [rows] = await pool.execute('UPDATE hotel SET price_start = ? WHERE hotel_id = ?', data)
    return rows
}


module.exports = {findHotelByName, findHotelRoom, insertHotel, updateHotel, addRoom, updateRoom, findMyHotels, updatePriceStart, findHotelById, getRoomType, findRoomByHotelId, insertTag, getTags, getTagsByHotelId}
