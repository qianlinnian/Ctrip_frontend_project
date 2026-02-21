/**
 * 预订模型
 */
const pool = require('../config/db')

const Booking = {
  /**
   * 创建预订
   */
  async create(bookingData) {
    const {
      userId,
      roomId,
      startTime,
      endTime,
      totalPrice
    } = bookingData

    const sql = `
      INSERT INTO room_booking (user_id, room_id, start_time, end_time, total_price, status)
      VALUES (?, ?, ?, ?, ?, 1)
    `
    const [result] = await pool.query(sql, [userId, roomId, startTime, endTime, totalPrice])
    
    return {
      bookId: result.insertId,
      ...bookingData,
      status: 1,
      bookingTime: new Date()
    }
  },

  /**
   * 获取用户预订列表
   */
  async getUserBookings(userId, status = null) {
    let sql = `
      SELECT 
        rb.book_id as id,
        rb.start_time as checkInDate,
        rb.end_time as checkOutDate,
        rb.total_price as totalPrice,
        rb.status,
        rb.booking_time as bookingTime,
        hr.room_id as roomId,
        rt.type_name as roomName,
        h.hotel_id as hotelId,
        h.hotel_name as hotelName,
        h.hotel_address as address,
        h.images as hotelImage
      FROM room_booking rb
      JOIN hotel_room hr ON rb.room_id = hr.room_id
      JOIN room_type rt ON hr.room_type_id = rt.type_id
      JOIN hotel h ON hr.hotel_id = h.hotel_id
      WHERE rb.user_id = ?
    `
    const values = [userId]

    if (status !== null) {
      sql += ` AND rb.status = ?`
      values.push(status)
    }

    sql += ` ORDER BY rb.booking_time DESC`

    const [rows] = await pool.query(sql, values)

    return rows.map(r => ({
      ...r,
      hotelImage: r.hotelImage ? r.hotelImage.split(',')[0] : null,
      checkInDate: r.checkInDate ? new Date(r.checkInDate).toISOString().split('T')[0] : null,
      checkOutDate: r.checkOutDate ? new Date(r.checkOutDate).toISOString().split('T')[0] : null,
      statusText: this.getStatusText(r.status)
    }))
  },

  /**
   * 获取预订详情
   */
  async getDetail(bookId) {
    const sql = `
      SELECT 
        rb.book_id as id,
        rb.user_id as userId,
        rb.start_time as checkInDate,
        rb.end_time as checkOutDate,
        rb.total_price as totalPrice,
        rb.status,
        rb.booking_time as bookingTime,
        hr.room_id as roomId,
        hr.price as roomPrice,
        rt.type_name as roomName,
        h.hotel_id as hotelId,
        h.hotel_name as hotelName,
        h.hotel_address as address,
        h.phone as hotelPhone,
        h.images as hotelImage
      FROM room_booking rb
      JOIN hotel_room hr ON rb.room_id = hr.room_id
      JOIN room_type rt ON hr.room_type_id = rt.type_id
      JOIN hotel h ON hr.hotel_id = h.hotel_id
      WHERE rb.book_id = ?
    `
    const [rows] = await pool.query(sql, [bookId])

    if (rows.length === 0) return null

    const booking = rows[0]
    return {
      ...booking,
      hotelImage: booking.hotelImage ? booking.hotelImage.split(',')[0] : null,
      checkInDate: booking.checkInDate ? new Date(booking.checkInDate).toISOString().split('T')[0] : null,
      checkOutDate: booking.checkOutDate ? new Date(booking.checkOutDate).toISOString().split('T')[0] : null,
      statusText: this.getStatusText(booking.status)
    }
  },

  /**
   * 更新预订状态
   */
  async updateStatus(bookId, status) {
    const sql = `UPDATE room_booking SET status = ? WHERE book_id = ?`
    await pool.query(sql, [status, bookId])
    return { bookId, status }
  },

  /**
   * 取消预订
   */
  async cancel(bookId) {
    return this.updateStatus(bookId, 0)
  },

  /**
   * 获取状态文本
   */
  getStatusText(status) {
    const statusMap = {
      0: '已取消',
      1: '待入住',
      2: '已入住',
      3: '已完成'
    }
    return statusMap[status] || '未知'
  }
}

module.exports = Booking

