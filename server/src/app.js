/**
 * 易宿酒店预订平台 - 后端服务
 */
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(express.json())

// Mock 数据 - 酒店列表
const mockHotels = [
  {
    id: 1,
    name: '如家精选酒店(上海外滩店)',
    star: 4,
    price: 288,
    image: 'https://via.placeholder.com/300x200/4A90E2/ffffff?text=Hotel+1',
    score: 4.5,
    reviewCount: 1234,
    address: '黄浦区南京东路123号',
    distance: '1.2km',
    facilities: ['WiFi', '停车场', '早餐'],
    tags: ['商务出行', '地铁周边'],
    city: '上海'
  },
  {
    id: 2,
    name: '汉庭酒店(上海人民广场店)',
    star: 3,
    price: 198,
    image: 'https://via.placeholder.com/300x200/50C878/ffffff?text=Hotel+2',
    score: 4.3,
    reviewCount: 856,
    address: '黄浦区福州路88号',
    distance: '2.5km',
    facilities: ['WiFi', '停车场'],
    tags: ['经济实惠', '交通便利'],
    city: '上海'
  },
  {
    id: 3,
    name: '锦江之星(上海南京路步行街店)',
    star: 3,
    price: 228,
    image: 'https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Hotel+3',
    score: 4.4,
    reviewCount: 967,
    address: '黄浦区南京东路456号',
    distance: '800m',
    facilities: ['WiFi', '早餐'],
    tags: ['地铁周边', '景区周边'],
    city: '上海'
  },
  {
    id: 4,
    name: '全季酒店(上海外滩金融中心店)',
    star: 4,
    price: 358,
    image: 'https://via.placeholder.com/300x200/9B59B6/ffffff?text=Hotel+4',
    score: 4.6,
    reviewCount: 1456,
    address: '黄浦区中山东一路789号',
    distance: '1.8km',
    facilities: ['WiFi', '停车场', '早餐', '健身房'],
    tags: ['商务出行', '豪华酒店'],
    city: '上海'
  },
  {
    id: 5,
    name: '7天连锁酒店(上海人民广场店)',
    star: 2,
    price: 158,
    image: 'https://via.placeholder.com/300x200/F39C12/ffffff?text=Hotel+5',
    score: 4.1,
    reviewCount: 634,
    address: '黄浦区西藏中路234号',
    distance: '3.2km',
    facilities: ['WiFi'],
    tags: ['经济实惠'],
    city: '上海'
  },
  {
    id: 6,
    name: '希尔顿酒店(北京王府井店)',
    star: 5,
    price: 888,
    image: 'https://via.placeholder.com/300x200/E74C3C/ffffff?text=Hotel+6',
    score: 4.8,
    reviewCount: 2345,
    address: '东城区王府井大街1号',
    distance: '500m',
    facilities: ['WiFi', '停车场', '早餐', '健身房', '游泳池'],
    tags: ['豪华酒店', '景区周边'],
    city: '北京'
  },
  {
    id: 7,
    name: '亚朵酒店(杭州西湖店)',
    star: 4,
    price: 458,
    image: 'https://via.placeholder.com/300x200/3498DB/ffffff?text=Hotel+7',
    score: 4.7,
    reviewCount: 1876,
    address: '西湖区湖滨路88号',
    distance: '300m',
    facilities: ['WiFi', '早餐', '健身房'],
    tags: ['景区周边', '商务出行'],
    city: '杭州'
  }
]

// Mock 数据 - 酒店详情
const mockHotelDetails = {
  1: {
    id: 1,
    name: '如家精选酒店(上海外滩店)',
    star: 4,
    score: 4.5,
    reviewCount: 1234,
    address: '上海市黄浦区南京东路123号',
    phone: '021-12345678',
    images: [
      'https://via.placeholder.com/400x300/4A90E2/ffffff?text=Hotel+Image+1',
      'https://via.placeholder.com/400x300/50C878/ffffff?text=Hotel+Image+2',
      'https://via.placeholder.com/400x300/FF6B6B/ffffff?text=Hotel+Image+3',
      'https://via.placeholder.com/400x300/9B59B6/ffffff?text=Hotel+Image+4'
    ],
    facilities: ['WiFi', '停车场', '餐厅', '健身房', '会议室', '洗衣服务'],
    description: '酒店位于市中心繁华地段，毗邻南京路步行街，交通便利。酒店设施齐全，服务周到，是您商务出行和休闲旅游的理想选择。',
    rooms: [
      {
        id: 101,
        name: '商务大床房',
        price: 288,
        originalPrice: 328,
        area: 25,
        floor: '6-12层',
        bed: '大床 1.8m',
        maxGuests: 2,
        breakfast: '含早餐',
        cancel: '可免费取消',
        image: 'https://via.placeholder.com/200x150/4A90E2/ffffff?text=Room+1',
        facilities: ['WiFi', '独立卫浴', '24小时热水', '空调'],
        stock: 5
      },
      {
        id: 102,
        name: '豪华双床房',
        price: 358,
        originalPrice: 398,
        area: 30,
        floor: '8-15层',
        bed: '双床 1.2m×2',
        maxGuests: 3,
        breakfast: '含双早',
        cancel: '可免费取消',
        image: 'https://via.placeholder.com/200x150/50C878/ffffff?text=Room+2',
        facilities: ['WiFi', '独立卫浴', '24小时热水', '空调', '浴缸'],
        stock: 3
      },
      {
        id: 103,
        name: '行政套房',
        price: 588,
        originalPrice: 688,
        area: 45,
        floor: '18-22层',
        bed: '大床 2.0m',
        maxGuests: 2,
        breakfast: '含双早',
        cancel: '限时取消',
        image: 'https://via.placeholder.com/200x150/9B59B6/ffffff?text=Room+3',
        facilities: ['WiFi', '独立卫浴', '24小时热水', '空调', '浴缸', '客厅'],
        stock: 2
      }
    ],
    reviews: [
      {
        id: 1,
        user: '张三',
        avatar: '张',
        score: 5,
        content: '酒店位置很好，离地铁站很近，房间干净整洁，服务态度好。',
        tags: ['位置优越', '干净整洁', '服务好'],
        date: '2026-02-10'
      },
      {
        id: 2,
        user: '李四',
        avatar: '李',
        score: 4,
        content: '性价比不错，早餐种类丰富，就是停车位比较少。',
        tags: ['性价比高', '早餐丰富'],
        date: '2026-02-08'
      },
      {
        id: 3,
        user: '王五',
        avatar: '王',
        score: 5,
        content: '房间很大，设施齐全，下次还会再来！',
        tags: ['房间宽敞', '设施齐全'],
        date: '2026-02-05'
      }
    ]
  }
}

// 热门城市
const hotCities = ['上海', '北京', '广州', '深圳', '杭州', '成都', '重庆', '南京']

// ==================== 路由 ====================

// 健康检查
app.get('/', (req, res) => {
  res.json({ code: 200, message: '易宿后端服务运行中', timestamp: new Date().toISOString() })
})

/**
 * 获取酒店列表
 * GET /api/hotels/list
 */
app.get('/api/hotels/list', (req, res) => {
  const { 
    location, 
    keyword,
    starLevel, 
    minPrice, 
    maxPrice, 
    sortBy,
    page = 1, 
    pageSize = 20 
  } = req.query

  let result = [...mockHotels]

  // 按城市筛选
  if (location) {
    result = result.filter(h => h.city === location)
  }

  // 按关键字筛选
  if (keyword) {
    result = result.filter(h => h.name.includes(keyword) || h.address.includes(keyword))
  }

  // 按价格筛选
  if (minPrice && Number(minPrice) > 0) {
    result = result.filter(h => h.price >= Number(minPrice))
  }
  if (maxPrice && Number(maxPrice) > 0) {
    result = result.filter(h => h.price <= Number(maxPrice))
  }

  // 按星级筛选
  if (starLevel) {
    const starLevels = String(starLevel).split(',').map(Number)
    result = result.filter(h => starLevels.includes(h.star))
  }

  // 排序
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'score_desc':
        result.sort((a, b) => b.score - a.score)
        break
      case 'score_asc':
        result.sort((a, b) => a.score - b.score)
        break
      case 'distance_asc':
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        break
    }
  }

  // 分页
  const total = result.length
  const start = (Number(page) - 1) * Number(pageSize)
  const hotels = result.slice(start, start + Number(pageSize))

  res.json({
    code: 200,
    data: {
      hotels,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  })
})

/**
 * 获取推荐酒店
 * GET /api/hotels/recommend
 */
app.get('/api/hotels/recommend', (req, res) => {
  const { location, limit = 5 } = req.query

  let result = [...mockHotels]

  if (location) {
    result = result.filter(h => h.city === location)
  }

  // 按评分排序取前 N 个
  result.sort((a, b) => b.score - a.score)
  result = result.slice(0, Number(limit))

  res.json({
    code: 200,
    data: result
  })
})

/**
 * 获取酒店详情
 * GET /api/hotels/:id
 */
app.get('/api/hotels/:id', (req, res) => {
  const { id } = req.params
  const hotel = mockHotelDetails[id]

  if (hotel) {
    // 房型按价格从低到高排序
    const sortedRooms = [...(hotel.rooms || [])].sort((a, b) => a.price - b.price)
    res.json({ code: 200, data: { ...hotel, rooms: sortedRooms } })
  } else {
    // 如果没有详细数据，返回列表中的基础数据
    const basicHotel = mockHotels.find(h => h.id === Number(id))
    if (basicHotel) {
      res.json({
        code: 200,
        data: {
          ...basicHotel,
          images: [basicHotel.image],
          rooms: [
            {
              id: 101,
              name: '标准大床房',
              price: basicHotel.price,
              originalPrice: Math.round(basicHotel.price * 1.15),
              area: 25,
              floor: '3-8层',
              bed: '大床 1.8m',
              maxGuests: 2,
              breakfast: '含早餐',
              cancel: '可免费取消',
              image: basicHotel.image,
              facilities: ['WiFi', '独立卫浴', '空调'],
              stock: 5
            },
            {
              id: 102,
              name: '豪华双床房',
              price: Math.round(basicHotel.price * 1.3),
              originalPrice: Math.round(basicHotel.price * 1.5),
              area: 30,
              floor: '5-10层',
              bed: '双床 1.2m×2',
              maxGuests: 3,
              breakfast: '含双早',
              cancel: '可免费取消',
              image: basicHotel.image,
              facilities: ['WiFi', '独立卫浴', '空调', '浴缸'],
              stock: 3
            }
          ],
          reviews: [
            {
              id: 1,
              user: '住客',
              avatar: '住',
              score: 4,
              content: '酒店整体不错，服务态度好。',
              tags: ['服务好', '干净'],
              date: '2026-02-15'
            }
          ]
        }
      })
    } else {
      res.status(404).json({ code: 404, message: '酒店不存在' })
    }
  }
})

/**
 * 获取热门城市
 * GET /api/cities/hot
 */
app.get('/api/cities/hot', (req, res) => {
  res.json({ code: 200, data: hotCities })
})

// 启动服务
app.listen(PORT, () => {
  console.log(`🏨 易宿后端服务已启动: http://localhost:${PORT}`)
  console.log(`📚 API 接口:`)
  console.log(`   GET  /api/hotels/list      - 获取酒店列表`)
  console.log(`   GET  /api/hotels/recommend - 获取推荐酒店`)
  console.log(`   GET  /api/hotels/:id       - 获取酒店详情`)
  console.log(`   GET  /api/cities/hot       - 获取热门城市`)
})
