/**
 * 酒店模型
 */
const pool = require('../config/db')
const { calculateHotelDistances, calculateDistanceToPOI, geocode } = require('../services/amap')

/**
 * 解析 images 字段，兼容 JSON 数组字符串和逗号分隔的纯 URL 字符串
 * 例如: '["url1","url2"]' 或 'url1,url2' 或 'url1'
 */
function parseImages(raw) {
  if (!raw) return []
  const trimmed = raw.trim()
  if (trimmed.startsWith('[')) {
    try { return JSON.parse(trimmed) } catch (e) { /* fallback */ }
  }
  return trimmed.split(',').map(s => s.trim()).filter(Boolean)
}

const Hotel = {
  /**
   * 获取酒店列表（支持筛选、排序、分页、附近搜索）
   */
  async getList(params = {}) {
    const {
      location,
      keyword,
      tag,         // 标签筛选（逗号分隔多个标签）
      nearBy,      // 附近搜索：地点名称（如"交通大学"）
      starLevel,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      pageSize = 20
    } = params

    let sql = `
      SELECT 
        h.hotel_id as id,
        h.hotel_name as name,
        h.city,
        h.hotel_address as address,
        h.hotel_level as star,
        h.price_start as price,
        h.description,
        h.images,
        h.cover_image,
        h.room_count,
        h.phone,
        h.score
      FROM hotel h
      WHERE h.audit_status = 1 AND h.publish_status = 1
    `
    const values = []

    // 先判断 keyword 是否为地点名称（通过高德 geocode）
    let resolvedNearBy = nearBy
    if (!resolvedNearBy && keyword) {
      const city = location || ''
      const coords = await geocode(keyword, city)
      if (coords) {
        resolvedNearBy = keyword
        console.log(`📍 关键词 "${keyword}" 识别为地点，自动启用附近搜索`)
      }
    }

    // 城市筛选
    if (location) {
      sql += ` AND h.city = ?`
      values.push(location)
    }

    // 关键词筛选：如果 keyword 已被识别为地点，则不做 LIKE 搜索
    if (keyword && !resolvedNearBy) {
      const keywords = keyword.trim().split(/\s+/) // 按空格分割多个关键词

      if (keywords.length === 1) {
        // 单关键词：使用 LIKE 模糊搜索
        sql += ` AND (h.hotel_name LIKE ? OR h.hotel_address LIKE ? OR h.city LIKE ?)`
        values.push(`%${keywords[0]}%`, `%${keywords[0]}%`, `%${keywords[0]}%`)
      } else {
        // 多关键词：每个关键词都必须匹配（AND 逻辑）
        const conditions = keywords.map(() =>
          `(h.hotel_name LIKE ? OR h.hotel_address LIKE ? OR h.city LIKE ?)`
        ).join(' AND ')
        sql += ` AND (${conditions})`
        keywords.forEach(kw => {
          values.push(`%${kw}%`, `%${kw}%`, `%${kw}%`)
        })
      }
    }

    // 价格筛选
    if (minPrice && Number(minPrice) > 0) {
      sql += ` AND h.price_start >= ?`
      values.push(Number(minPrice))
    }
    if (maxPrice && Number(maxPrice) > 0) {
      sql += ` AND h.price_start <= ?`
      values.push(Number(maxPrice))
    }

    // 星级筛选
    if (starLevel) {
      const stars = String(starLevel).split(',').map(Number)
      sql += ` AND h.hotel_level IN (${stars.map(() => '?').join(',')})`
      values.push(...stars)
    }

    // 标签筛选（支持多标签，逗号分隔）
    if (tag) {
      const tagNames = tag.split(',').filter(t => t.trim())
      if (tagNames.length > 0) {
        // 使用子查询筛选拥有指定标签的酒店
        sql += ` AND h.hotel_id IN (
          SELECT DISTINCT htr.hotel_id 
          FROM hotel_tag_relation htr 
          JOIN tag t ON htr.tag_id = t.tag_id 
          WHERE t.tag_name IN (${tagNames.map(() => '?').join(',')})
        )`
        values.push(...tagNames)
      }
    }

    // 排序
    switch (sortBy) {
      case 'price_asc':
        sql += ` ORDER BY h.price_start ASC`
        break
      case 'price_desc':
        sql += ` ORDER BY h.price_start DESC`
        break
      case 'score_desc':
        sql += ` ORDER BY score DESC`
        break
      case 'score_asc':
        sql += ` ORDER BY score ASC`
        break
      default:
        // 综合排序：评分(40%) + 星级(30%) + 性价比(20%) + 新店加成(10%)
        sql += ` ORDER BY (
          COALESCE(h.score, 4.5) / 5.0 * 40
          + h.hotel_level / 5.0 * 30
          + (1 - LEAST(h.price_start, 2000) / 2000) * 20
          + IF(DATEDIFF(NOW(), h.create_time) < 30, 10, 0)
        ) DESC`
    }

    // 先获取总数
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as subquery`
    const [countResult] = await pool.query(countSql, values)
    const total = countResult[0]?.total || 0

    // 分页
    const offset = (Number(page) - 1) * Number(pageSize)
    sql += ` LIMIT ? OFFSET ?`
    values.push(Number(pageSize), offset)

    const [rows] = await pool.query(sql, values)

    // 批量获取所有酒店的标签
    const hotelIds = rows.map(h => h.id)
    const tagsMap = await this.getTagsForHotels(hotelIds)

    // 处理 images 字段
    let hotels = rows.map(h => ({
      ...h,
      image: h.cover_image || parseImages(h.images)[0] || null,
      images: parseImages(h.images),
      score: h.score ? Number(Number(h.score).toFixed(1)) : 4.5,
      facilities: tagsMap[h.id] || [],  // 使用数据库标签
      tags: tagsMap[h.id] || []         // 使用数据库标签
    }))

    // 使用高德API计算距离
    if (resolvedNearBy) {
      // 附近搜索：计算到指定地点的距离，并按距离排序
      hotels = await calculateDistanceToPOI(hotels, resolvedNearBy, location || hotels[0]?.city)
    } else if (location) {
      // 普通搜索：计算到城市中心的距离
      hotels = await calculateHotelDistances(hotels, location)
    } else {
      hotels = hotels.map(h => ({ ...h, distance: '—' }))
    }

    // 距离排序（距离在代码层面计算，需要在获取后排序）
    if (sortBy === 'distance_asc') {
      hotels.sort((a, b) => (a.distanceMeters || 999999) - (b.distanceMeters || 999999))
    } else if (sortBy === 'distance_desc') {
      hotels.sort((a, b) => (b.distanceMeters || 0) - (a.distanceMeters || 0))
    }

    return {
      hotels,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  },

  /**
   * 获取酒店详情
   */
  async getDetail(hotelId) {
    const sql = `
      SELECT 
        h.hotel_id as id,
        h.hotel_name as name,
        h.city,
        h.hotel_address as address,
        h.hotel_level as star,
        h.price_start as price,
        h.description,
        h.images, 
        h.phone,
        h.room_count,
        m.username as merchant_name
      FROM hotel h
      LEFT JOIN merchant m ON h.merchant_id = m.merchant_id
      WHERE h.hotel_id = ?
    `
    const [rows] = await pool.query(sql, [hotelId])
    
    if (rows.length === 0) return null

    const hotel = rows[0]
    
    // 获取房型列表
    const rooms = await this.getRooms(hotelId)
    
    // 获取酒店标签
    const tags = await this.getTags(hotelId)
 

    return {
      ...hotel,
      images: parseImages(hotel.images),
      facilities: tags,  // 使用数据库中的标签作为设施
      rooms,
      tags,
      score: 4.5,
    }
  },

  /**
   * 获取酒店房型
   */
  async getRooms(hotelId) {
    const sql = `
      SELECT 
        hr.room_id as id,
        rt.type_name as name,
        hr.price,
        hr.room_count as stock,
        hr.images
      FROM hotel_room hr
      LEFT JOIN room_type rt ON hr.room_type_id = rt.type_id
      WHERE hr.hotel_id = ?
      ORDER BY hr.price ASC
    `
    const [rows] = await pool.query(sql, [hotelId])

    return rows.map((r, idx) => ({
      ...r,
      image: parseImages(r.images)[0] || null,
      originalPrice: Math.round(r.price * 1.15),
      area: 25 + idx * 5,
      floor: `${3 + idx * 2}-${8 + idx * 3}层`,
      bed: idx % 2 === 0 ? '大床 1.8m' : '双床 1.2m×2',
      maxGuests: idx % 2 === 0 ? 2 : 3,
      breakfast: idx === 0 ? '不含早' : '含早餐',
      cancel: '可免费取消',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调']
    }))
  },

  /**
   * 获取酒店标签
   */
  async getTags(hotelId) {
    const sql = `
      SELECT t.tag_name
      FROM hotel_tag_relation htr
      JOIN tag t ON htr.tag_id = t.tag_id
      WHERE htr.hotel_id = ?
    `
    const [rows] = await pool.query(sql, [hotelId])
    return rows.map(r => r.tag_name)
  },

  /**
   * 批量获取多个酒店的标签
   */
  async getTagsForHotels(hotelIds) {
    if (!hotelIds || hotelIds.length === 0) {
      return {}
    }

    const sql = `
      SELECT htr.hotel_id, t.tag_name
      FROM hotel_tag_relation htr
      JOIN tag t ON htr.tag_id = t.tag_id
      WHERE htr.hotel_id IN (${hotelIds.map(() => '?').join(',')})
    `
    const [rows] = await pool.query(sql, hotelIds)

    // 按酒店ID分组
    const tagsMap = {}
    rows.forEach(r => {
      if (!tagsMap[r.hotel_id]) {
        tagsMap[r.hotel_id] = []
      }
      tagsMap[r.hotel_id].push(r.tag_name)
    })

    return tagsMap
  },

  /**
   * 全文搜索酒店（使用 FULLTEXT 索引）
   * 支持多关键词、相关度排序
   */
  async fulltextSearch(params = {}) {
    const { keyword, page = 1, pageSize = 20 } = params

    if (!keyword) {
      return this.getList(params)
    }

    // 处理多关键词：用空格分隔，转为 +word 格式（必须包含）
    const keywords = keyword.trim().split(/\s+/)
    const searchTerms = keywords.map(kw => `+${kw}*`).join(' ')

    const sql = `
      SELECT 
        h.hotel_id as id,
        h.hotel_name as name,
        h.city,
        h.hotel_address as address,
        h.hotel_level as star,
        h.price_start as price,
        h.cover_image,
        h.images,
        h.score,
        MATCH(h.hotel_name, h.hotel_address, h.city) AGAINST(? IN BOOLEAN MODE) as relevance
      FROM hotel h
      WHERE h.audit_status = 1 AND h.publish_status = 1
        AND MATCH(h.hotel_name, h.hotel_address, h.city) AGAINST(? IN BOOLEAN MODE)
      ORDER BY relevance DESC, h.score DESC
      LIMIT ? OFFSET ?
    `
    const offset = (Number(page) - 1) * Number(pageSize)
    const values = [searchTerms, searchTerms, Number(pageSize), offset]

    try {
      const [rows] = await pool.query(sql, values)
      
      // 获取总数
      const countSql = `
        SELECT COUNT(*) as total FROM hotel h
        WHERE h.audit_status = 1 AND h.publish_status = 1
          AND MATCH(h.hotel_name, h.hotel_address, h.city) AGAINST(? IN BOOLEAN MODE)
      `
      const [countResult] = await pool.query(countSql, [searchTerms])
      const total = countResult[0]?.total || 0

      // 批量获取标签
      const hotelIds = rows.map(h => h.id)
      const tagsMap = await this.getTagsForHotels(hotelIds)

      let hotels = rows.map(h => ({
        ...h,
        image: h.cover_image || (parseImages(h.images)[0] || null),
        images: parseImages(h.images),
        facilities: tagsMap[h.id] || [],
        tags: tagsMap[h.id] || []
      }))

      // 全文搜索结果可能跨城市，根据第一个结果的城市计算距离
      const firstCity = hotels[0]?.city
      if (firstCity) {
        hotels = await calculateHotelDistances(hotels, firstCity)
      } else {
        hotels = hotels.map(h => ({ ...h, distance: '—' }))
      }

      return { hotels, total, page: Number(page), pageSize: Number(pageSize) }
    } catch (error) {
      // 如果全文索引不可用，回退到 LIKE 搜索
      console.log('全文搜索不可用，使用 LIKE 搜索:', error.message)
      return this.getList(params)
    }
  },

  /**
   * 获取推荐酒店
   */
  async getRecommend(params = {}) {
    const { location, limit = 5 } = params

    let sql = `
      SELECT 
        h.hotel_id as id,
        h.hotel_name as name,
        h.city,
        h.hotel_address as address,
        h.hotel_level as star,
        h.price_start as price,
        h.images,
        h.score
      FROM hotel h
      WHERE h.audit_status = 1 AND h.publish_status = 1
    `
    const values = []

    if (location) {
      sql += ` AND h.city = ?`
      values.push(location)
    }

    sql += ` ORDER BY h.hotel_level DESC, h.price_start DESC LIMIT ?`
    values.push(Number(limit))

    const [rows] = await pool.query(sql, values)

    // 批量获取标签
    const hotelIds = rows.map(h => h.id)
    const tagsMap = await this.getTagsForHotels(hotelIds)

    let hotels = rows.map(h => ({
      ...h,
      image: parseImages(h.images)[0] || null,
      images: parseImages(h.images),
      facilities: tagsMap[h.id] || [],
      tags: tagsMap[h.id] || []
    }))

    // 使用高德API计算距离
    if (location) {
      hotels = await calculateHotelDistances(hotels, location)
    } else {
      hotels = hotels.map(h => ({ ...h, distance: '—' }))
    }

    return hotels
  }
}

module.exports = Hotel

