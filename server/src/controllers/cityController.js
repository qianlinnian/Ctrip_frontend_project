/**
 * 城市控制器 - 移动端 API
 */

// 热门城市
const HOT_CITIES = ['上海', '北京', '广州', '深圳', '杭州', '成都', '重庆', '南京']

// 所有城市
const ALL_CITIES = [
  { id: 1, name: '上海', pinyin: 'shanghai' },
  { id: 2, name: '北京', pinyin: 'beijing' },
  { id: 3, name: '广州', pinyin: 'guangzhou' },
  { id: 4, name: '深圳', pinyin: 'shenzhen' },
  { id: 5, name: '杭州', pinyin: 'hangzhou' },
  { id: 6, name: '成都', pinyin: 'chengdu' },
  { id: 7, name: '重庆', pinyin: 'chongqing' },
  { id: 8, name: '南京', pinyin: 'nanjing' },
  { id: 9, name: '西安', pinyin: 'xian' },
  { id: 10, name: '武汉', pinyin: 'wuhan' },
  { id: 11, name: '苏州', pinyin: 'suzhou' },
  { id: 12, name: '厦门', pinyin: 'xiamen' },
  { id: 13, name: '青岛', pinyin: 'qingdao' },
  { id: 14, name: '大连', pinyin: 'dalian' },
  { id: 15, name: '三亚', pinyin: 'sanya' }
]

/**
 * 获取所有城市
 * GET /api/cities
 */
exports.getAll = async (req, res) => {
  res.json({ code: 200, data: ALL_CITIES })
}

/**
 * 获取热门城市
 * GET /api/cities/hot
 */
exports.getHot = async (req, res) => {
  res.json({ code: 200, data: HOT_CITIES })
}

/**
 * 搜索城市
 * GET /api/cities/search
 */
exports.search = async (req, res) => {
  const { keyword } = req.query
  
  if (!keyword) {
    return res.json({ code: 200, data: ALL_CITIES })
  }

  const kw = keyword.toLowerCase()
  const result = ALL_CITIES.filter(c => 
    c.name.includes(keyword) || c.pinyin.includes(kw)
  )
  
  res.json({ code: 200, data: result })
}

/**
 * 获取有酒店的城市
 * GET /api/cities/with-hotels
 */
exports.getCitiesWithHotels = async (req, res) => {
  res.json({ 
    code: 200, 
    data: HOT_CITIES.map((name, index) => ({ 
      id: index + 1, 
      name, 
      hotelCount: Math.floor(Math.random() * 1000) + 100 
    })) 
  })
}
