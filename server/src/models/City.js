/**
 * 城市模型
 */
const pool = require('../config/db')

// 热门城市列表（静态数据）
const HOT_CITIES = [
  { id: 1, name: '上海', pinyin: 'shanghai', hot: true },
  { id: 2, name: '北京', pinyin: 'beijing', hot: true },
  { id: 3, name: '广州', pinyin: 'guangzhou', hot: true },
  { id: 4, name: '深圳', pinyin: 'shenzhen', hot: true },
  { id: 5, name: '杭州', pinyin: 'hangzhou', hot: true },
  { id: 6, name: '成都', pinyin: 'chengdu', hot: true },
  { id: 7, name: '重庆', pinyin: 'chongqing', hot: true },
  { id: 8, name: '南京', pinyin: 'nanjing', hot: true },
  { id: 9, name: '西安', pinyin: 'xian', hot: true },
  { id: 10, name: '武汉', pinyin: 'wuhan', hot: true },
  { id: 11, name: '苏州', pinyin: 'suzhou', hot: false },
  { id: 12, name: '厦门', pinyin: 'xiamen', hot: false },
  { id: 13, name: '青岛', pinyin: 'qingdao', hot: false },
  { id: 14, name: '大连', pinyin: 'dalian', hot: false },
  { id: 15, name: '三亚', pinyin: 'sanya', hot: false }
]

const City = {
  /**
   * 获取所有城市
   */
  async getAll() {
    return HOT_CITIES
  },

  /**
   * 获取热门城市
   */
  async getHot() {
    return HOT_CITIES.filter(c => c.hot).map(c => c.name)
  },

  /**
   * 根据名称搜索城市
   */
  async search(keyword) {
    if (!keyword) return HOT_CITIES

    const kw = keyword.toLowerCase()
    return HOT_CITIES.filter(c => 
      c.name.includes(keyword) || c.pinyin.includes(kw)
    )
  },

  /**
   * 从数据库获取有酒店的城市
   */
  async getCitiesWithHotels() {
    try {
      const sql = `
        SELECT DISTINCT city as name, COUNT(*) as hotelCount
        FROM hotel
        WHERE audit_status = 1 AND publish_status = 1
        GROUP BY city
        ORDER BY hotelCount DESC
      `
      const [rows] = await pool.query(sql)
      return rows
    } catch (error) {
      // 如果数据库查询失败，返回静态数据
      console.log('使用静态城市数据')
      return HOT_CITIES.map(c => ({ name: c.name, hotelCount: 0 }))
    }
  }
}

module.exports = City

