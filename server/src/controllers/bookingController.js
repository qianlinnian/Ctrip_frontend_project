/**
 * 预订控制器 - 移动端 API
 * 使用数据库查询
 */
const Booking = require('../models/Booking')

/**
 * 创建预订
 * POST /api/bookings
 */
exports.create = async (req, res) => {
  const { roomId, checkInDate, checkOutDate, totalPrice, userId = 1 } = req.body

  if (!roomId || !checkInDate || !checkOutDate) {
    return res.status(400).json({ code: 400, message: '缺少必要参数' })
  }

  try {
    const data = await Booking.create({
      userId,
    roomId,
      startTime: checkInDate,
      endTime: checkOutDate,
      totalPrice: totalPrice || 0
    })
    console.log('✅ 预订创建成功')
    res.json({ code: 200, data, message: '预订成功' })
  } catch (error) {
    console.error('❌ 预订创建失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取用户预订列表
 * GET /api/bookings
 */
exports.getUserBookings = async (req, res) => {
  const { status, userId = 1 } = req.query

  try {
    const data = await Booking.getUserBookings(userId, status !== undefined ? Number(status) : null)
    console.log('✅ 预订列表查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取预订详情
 * GET /api/bookings/:id
 */
exports.getDetail = async (req, res) => {
  const { id } = req.params

  try {
    const data = await Booking.getDetail(id)
    if (data) {
      console.log('✅ 预订详情查询成功')
      return res.json({ code: 200, data })
    }
    res.status(404).json({ code: 404, message: '预订不存在' })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 取消预订
 * PUT /api/bookings/:id/cancel
 */
exports.cancel = async (req, res) => {
  const { id } = req.params

  try {
    // 先检查预订是否存在
    const booking = await Booking.getDetail(id)
  if (!booking) {
    return res.status(404).json({ code: 404, message: '预订不存在' })
  }

    await Booking.cancel(id)
    console.log('✅ 预订取消成功')
    res.json({ code: 200, message: '预订已取消', data: { ...booking, status: 0, statusText: '已取消' } })
  } catch (error) {
    console.error('❌ 取消预订失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
