/**
 * 标签控制器
 */
const pool = require('../config/db')

/**
 * 获取热门标签（按使用次数排序）
 * GET /api/tags/hot
 */
exports.getHotTags = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    
    // 查询使用次数最多的标签
    const sql = `
      SELECT 
        t.tag_id as id,
        t.tag_name as name,
        COUNT(htr.hotel_id) as count
      FROM tag t
      LEFT JOIN hotel_tag_relation htr ON t.tag_id = htr.tag_id
      GROUP BY t.tag_id, t.tag_name
      HAVING count > 0
      ORDER BY count DESC
      LIMIT ?
    `
    const [rows] = await pool.query(sql, [Number(limit)])
    
    console.log('热门标签查询成功')
    res.json({ 
      code: 200, 
      data: rows.map(r => ({
        id: r.id,
        name: r.name,
        count: r.count
      }))
    })
  } catch (error) {
    console.error('标签查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取所有标签
 * GET /api/tags
 */
exports.getAllTags = async (req, res) => {
  try {
    const sql = `SELECT tag_id as id, tag_name as name FROM tag ORDER BY tag_name`
    const [rows] = await pool.query(sql)
    
    console.log('所有标签查询成功')
    res.json({ code: 200, data: rows })
  } catch (error) {
    console.error('标签查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

