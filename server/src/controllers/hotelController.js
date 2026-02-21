/**
 * 酒店控制器 - 移动端 API
 * 使用数据库查询
 */
const Hotel = require('../models/Hotel')

/**
 * 获取酒店列表
 * GET /api/hotels/list
 */
exports.getList = async (req, res) => {
  try {
    const data = await Hotel.getList(req.query)
    console.log('✅ 数据库查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取酒店详情
 * GET /api/hotels/:id
 */
exports.getDetail = async (req, res) => {
  const { id } = req.params

  try {
    const data = await Hotel.getDetail(id)
    if (data) {
      console.log('✅ 数据库查询成功')
      return res.json({ code: 200, data })
    }
    res.status(404).json({ code: 404, message: '酒店不存在' })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 获取推荐酒店
 * GET /api/hotels/recommend
 */
exports.getRecommend = async (req, res) => {
  try {
    const data = await Hotel.getRecommend(req.query)
    console.log('✅ 数据库查询成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}

/**
 * 搜索酒店
 * GET /api/hotels/search
 * 支持：单关键词、多关键词（空格分隔）、模糊搜索
 */
exports.search = async (req, res) => {
  const { keyword, useFulltext } = req.query

  try {
    let data
    if (useFulltext === 'true' && keyword) {
      // 使用全文搜索（需要 FULLTEXT 索引）
      data = await Hotel.fulltextSearch(req.query)
    } else {
      // 使用 LIKE 模糊搜索
      data = await Hotel.getList(req.query)
    }
    console.log('✅ 数据库搜索成功')
    res.json({ code: 200, data })
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
