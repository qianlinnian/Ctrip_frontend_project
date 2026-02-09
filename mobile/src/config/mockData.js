/**
 * Mock 数据 - 用于开发阶段测试
 */

// 搜索查询参数 (人间夜)
export const defaultSearchParams = {
  city: '上海',
  checkInDate: '2026-02-20',
  checkOutDate: '2026-02-21',
  guests: 2,                       // 👤 入住人数
  rooms: 1,                        // 🏠 房间数量
  nights: 1,                       // 🌙 入住天数
  keyword: '',
  priceRange: [0, 1000],
  starLevel: [],
  facilities: []
}

// 酒店列表 Mock 数据
export const mockHotelList = [
  {
    id: 1,
    name: '如家精选酒店(上海外滩店)',
    star: 4,
    price: 288,
    image: 'https://via.placeholder.com/300x200/4A90E2/ffffff?text=Hotel+1',
    rating: 4.5,
    reviewCount: 1234,
    location: '黄浦区南京东路123号',
    distance: '1.2km',
    facilities: ['WiFi', '停车场', '早餐'],
    tags: ['商务出行', '地铁周边']
  },
  {
    id: 2,
    name: '汉庭酒店(上海人民广场店)',
    star: 3,
    price: 198,
    image: 'https://via.placeholder.com/300x200/50C878/ffffff?text=Hotel+2',
    rating: 4.3,
    reviewCount: 856,
    location: '黄浦区福州路88号',
    distance: '2.5km',
    facilities: ['WiFi', '停车场'],
    tags: ['经济实惠', '交通便利']
  },
  {
    id: 3,
    name: '锦江之星(上海南京路步行街店)',
    star: 3,
    price: 228,
    image: 'https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Hotel+3',
    rating: 4.4,
    reviewCount: 967,
    location: '黄浦区南京东路456号',
    distance: '800m',
    facilities: ['WiFi', '早餐'],
    tags: ['地铁周边', '景区周边']
  },
  {
    id: 4,
    name: '全季酒店(上海外滩金融中心店)',
    star: 4,
    price: 358,
    image: 'https://via.placeholder.com/300x200/9B59B6/ffffff?text=Hotel+4',
    rating: 4.6,
    reviewCount: 1456,
    location: '黄浦区中山东一路789号',
    distance: '1.8km',
    facilities: ['WiFi', '停车场', '早餐', '健身房'],
    tags: ['商务出行', '豪华酒店']
  },
  {
    id: 5,
    name: '7天连锁酒店(上海人民广场店)',
    star: 2,
    price: 158,
    image: 'https://via.placeholder.com/300x200/F39C12/ffffff?text=Hotel+5',
    rating: 4.1,
    reviewCount: 634,
    location: '黄浦区西藏中路234号',
    distance: '3.2km',
    facilities: ['WiFi'],
    tags: ['经济实惠']
  }
]

// 酒店详情 Mock 数据
export const mockHotelDetail = {
  id: 1,
  name: '如家精选酒店(上海外滩店)',
  star: 4,
  rating: 4.5,
  reviewCount: 1234,
  location: '上海市黄浦区南京东路123号',
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
      area: 25,
      bedType: '大床 1.8m',
      maxGuests: 2,
      image: 'https://via.placeholder.com/200x150/4A90E2/ffffff?text=Room+1',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调'],
      stock: 5
    },
    {
      id: 102,
      name: '豪华双床房',
      price: 358,
      area: 30,
      bedType: '双床 1.2m×2',
      maxGuests: 3,
      image: 'https://via.placeholder.com/200x150/50C878/ffffff?text=Room+2',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调', '浴缸'],
      stock: 3
    },
    {
      id: 103,
      name: '行政套房',
      price: 588,
      area: 45,
      bedType: '大床 2.0m',
      maxGuests: 2,
      image: 'https://via.placeholder.com/200x150/9B59B6/ffffff?text=Room+3',
      facilities: ['WiFi', '独立卫浴', '24小时热水', '空调', '浴缸', '客厅'],
      stock: 2
    }
  ],
  reviews: [
    {
      id: 1,
      userName: '张三',
      avatar: 'https://via.placeholder.com/50/4A90E2/ffffff?text=User',
      rating: 5,
      content: '酒店位置很好，离地铁站很近，房间干净整洁，服务态度好。',
      images: [
        'https://via.placeholder.com/100/4A90E2/ffffff?text=Review+1',
        'https://via.placeholder.com/100/50C878/ffffff?text=Review+2'
      ],
      date: '2026-02-10'
    },
    {
      id: 2,
      userName: '李四',
      avatar: 'https://via.placeholder.com/50/50C878/ffffff?text=User',
      rating: 4,
      content: '性价比不错，早餐种类丰富，就是停车位比较少。',
      images: [],
      date: '2026-02-08'
    },
    {
      id: 3,
      userName: '王五',
      avatar: 'https://via.placeholder.com/50/FF6B6B/ffffff?text=User',
      rating: 5,
      content: '非常满意，下次还会选择这家酒店！',
      images: [
        'https://via.placeholder.com/100/FF6B6B/ffffff?text=Review+3'
      ],
      date: '2026-02-05'
    }
  ]
}

// 城市列表 Mock 数据
export const mockCityList = {
  hot: ['上海', '北京', '广州', '深圳', '杭州', '成都', '重庆', '南京'],
  all: [
    { letter: 'A', cities: ['安庆', '安阳'] },
    { letter: 'B', cities: ['北京', '保定'] },
    { letter: 'C', cities: ['成都', '重庆', '长沙', '常州'] },
    { letter: 'G', cities: ['广州', '贵阳'] },
    { letter: 'H', cities: ['杭州', '合肥', '哈尔滨'] },
    { letter: 'N', cities: ['南京', '宁波', '南昌'] },
    { letter: 'S', cities: ['上海', '深圳', '苏州', '沈阳'] },
    { letter: 'W', cities: ['武汉', '无锡'] },
    { letter: 'X', cities: ['西安', '厦门'] },
    { letter: 'Z', cities: ['郑州', '珠海'] }
  ]
}
