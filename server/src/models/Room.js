/**
 * 房间模型
 */
const pool = require('../config/db')

const Room = {
  /**
   * 获取房型列表
   */
  async getList(params = {}) {
    const { hotelId, page = 1, pageSize = 20 } = params

    let sql = `
      SELECT 
        hr.room_id as id,
        hr.hotel_id as hotelId,
        rt.type_name as name,
        hr.price,
        hr.room_count as stock,
        hr.images,
        h.hotel_name as hotelName
      FROM hotel_room hr
      LEFT JOIN room_type rt ON hr.room_type_id = rt.type_id
      LEFT JOIN hotel h ON hr.hotel_id = h.hotel_id
      WHERE 1=1
    `
    const values = []

    if (hotelId) {
      sql += ` AND hr.hotel_id = ?`
      values.push(hotelId)
    }

    sql += ` ORDER BY hr.price ASC`

    // 计算总数
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as subquery`
    const [countResult] = await pool.query(countSql, values)
    const total = countResult[0]?.total || 0

    // 分页
    const offset = (Number(page) - 1) * Number(pageSize)
    sql += ` LIMIT ? OFFSET ?`
    values.push(Number(pageSize), offset)

    const [rows] = await pool.query(sql, values)

    const rooms = rows.map((r, idx) => ({
      ...r,
      image: r.images ? r.images.split(',')[0] : null,
      originalPrice: Math.round(r.price * 1.15),
      area: 25 + idx * 5,
      floor: `${3 + idx * 2}-${8 + idx * 3}层`,
      bed: idx % 2 === 0 ? '大床 1.8m' : '双床 1.2m×2',
      maxGuests: idx % 2 === 0 ? 2 : 3,
      breakfast: idx === 0 ? '不含早' : '含早餐',
      cancel: '可免费取消',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调']
    }))

    return {
      rooms,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  },

  /**
   * 获取房型详情
   */
  async getDetail(roomId) {
    const sql = `
      SELECT 
        hr.room_id as id,
        hr.hotel_id as hotelId,
        rt.type_name as name,
        hr.price,
        hr.room_count as stock,
        hr.images,
        h.hotel_name as hotelName,
        h.hotel_address as address
      FROM hotel_room hr
      LEFT JOIN room_type rt ON hr.room_type_id = rt.type_id
      LEFT JOIN hotel h ON hr.hotel_id = h.hotel_id
      WHERE hr.room_id = ?
    `
    const [rows] = await pool.query(sql, [roomId])

    if (rows.length === 0) return null

    const room = rows[0]
    return {
      ...room,
      image: room.images ? room.images.split(',')[0] : null,
      images: room.images ? room.images.split(',') : [],
      originalPrice: Math.round(room.price * 1.15),
      area: 30,
      floor: '6-12层',
      bed: '大床 1.8m',
      maxGuests: 2,
      breakfast: '含早餐',
      cancel: '可免费取消',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调', '浴缸']
    }
  }
}

module.exports = Room

