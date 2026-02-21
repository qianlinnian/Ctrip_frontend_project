/**
 * 房间控制器 - 移动端 API
 * 使用数据库查询
 */
const Room = require('../models/Room')

/**
 * 获取房间列表
 * GET /api/rooms
 */
exports.getList = async (req, res) => {
  try {
    const data = await Room.getList(req.query)
    console.log('✅ 房间列表查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取房间详情
 * GET /api/rooms/:id
 */
exports.getDetail = async (req, res) => {
  const { id } = req.params

  try {
    const data = await Room.getDetail(id)
    if (data) {
      console.log('✅ 房间详情查询成功')
      return res.json({ code: 200, data })
    }
    res.status(404).json({ code: 404, message: '房型不存在' })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

