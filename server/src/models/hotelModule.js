const pool = require('../config/database')


exports.addHotel = async(req, res) => {
    const {name, city, address, star, roomCount, lowestPrice, phone, description, hotelImage, liscenseImage} = req.body

    if(findHotelByName(name)) {
        return res.status(400).json({messaage: 'Hotel name already exist'})
    }

    const [rows] = await pool.execute('INSERT INTO hotel (name, city, address, star, phone, hotelImage, liscenseImage) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, city, address, star, phone, hotelImage, liscenseImage])
    
    return [rows]
}
