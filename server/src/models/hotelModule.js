const pool = require('../config/database')



//酒店操作


const findHotelByName = async(name) => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE name = ?', [name])
    return [rows]
}


const findHotelRoom = async(hotelid) => {
    const [rows] = await pool.execute('SELECT * FROM room WHERE hotel_id = ?', [hotelid])
    return [rows]
}




const addHotel = async(req, res) => {
    const {name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage} = req.body

    if(findHotelByName(name)) {
        return res.status(400).json({messaage: 'Hotel name already exist'})
    }

    const [rows] = await pool.execute('INSERT INTO hotel (name, city, address, star, phone, hotelImage, liscenseImage) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, city, address, star, phone, hotelImage, liscenseImage])
    
    return [rows]
}


const updateHotel = async(req, res) => {
    const {name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage} = req.body
    const [rows] = await pool.execute('UPDATE hotel SET name = ?, city = ?, address = ?, star = ?, roomCount = ?, lowestPrice = ?, phone = ?, description = ?, hotelImage = ?, liscenseImage = ? WHERE name = ?', [name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage, name])
    return [rows]
}




//房间操作
const addRoom = async(req, res) => {
    const {hotelid,roomtype, price,roomcount } = req.body
    const [rows] = await pool.execute('INSERT INTO room (hotelid,roomtype, price,roomcount) VALUES (?, ?, ?, ?)', [hotelid,roomtype, price,roomcount])
    return [rows]
}



const updateRoom = async(req, res) => {
    const {hotel_id, name, type, price, description, image} = req.body

    const [rows] = await pool.execute('UPDATE room SET name = ?, type = ?, price = ?, description = ?, image = ? WHERE hotel_id = ?', [name, type, price, description, image, hotel_id])

    return [rows]
}