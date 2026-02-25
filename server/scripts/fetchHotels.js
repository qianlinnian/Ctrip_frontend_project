/**
 * 从高德地图 POI API 获取真实酒店数据
 * 用于填充数据库
 * 
 * 使用方法：
 * 1. 确保 .env 中配置了 AMAP_KEY
 * 2. 运行: node scripts/fetchHotels.js
 * 3. 生成的 SQL 文件在 scripts/hotels_data.sql
 */

require('dotenv').config()

const fs = require('fs')
const path = require('path')

const AMAP_KEY = process.env.AMAP_KEY

// 要获取酒店的城市列表
const CITIES = [
  '上海', '北京', '广州', '深圳', '杭州',
  '成都', '重庆', '南京', '西安', '武汉',
  '苏州', '厦门', '青岛', '大连', '三亚'
]

// 每个城市获取的酒店数量（高德单次最多25条，分页获取）
const HOTELS_PER_CITY = 50

// 酒店类型关键词
const HOTEL_TYPES = ['酒店', '宾馆', '度假村', '民宿']

/**
 * 调用高德 POI 搜索 API
 */
async function searchPOI(keyword, city, page = 1, pageSize = 25) {
  const params = new URLSearchParams({
    key: AMAP_KEY,
    keywords: keyword,
    city: city,
    types: '100000',  // 住宿服务
    offset: pageSize,
    page: page,
    extensions: 'all',
    output: 'json'
  })

  try {
    const response = await fetch(`https://restapi.amap.com/v3/place/text?${params}`)
    const data = await response.json()

    if (data.status === '1' && data.pois) {
      return data.pois
    }
    return []
  } catch (error) {
    console.error(`搜索失败 [${city} ${keyword}]:`, error.message)
    return []
  }
}

/**
 * 获取单个城市的酒店
 */
async function fetchCityHotels(city) {
  console.log(`\n📍 正在获取 ${city} 的酒店...`)
  
  const hotels = []
  const seen = new Set()  // 去重
  
  for (const type of HOTEL_TYPES) {
    let page = 1
    while (hotels.length < HOTELS_PER_CITY && page <= 3) {
      const pois = await searchPOI(type, city, page)
      
      for (const poi of pois) {
        if (seen.has(poi.id)) continue
        seen.add(poi.id)
        
        // 转换为数据库格式
        const hotel = {
          name: poi.name?.replace(/'/g, "''") || '',
          city: city,
          address: poi.address?.replace(/'/g, "''") || poi.pname + poi.cityname + poi.adname,
          level: getStarLevel(poi.name, poi.type),
          phone: poi.tel?.split(';')[0] || '400-000-0000',
          price: getRandomPrice(poi.name),
          roomCount: Math.floor(Math.random() * 200) + 50,
          description: generateDescription(poi),
          images: '',  // 可以后续补充
          score: (Math.random() * 1.5 + 3.5).toFixed(1),  // 3.5-5.0
          lat: poi.location?.split(',')[1] || '',
          lng: poi.location?.split(',')[0] || ''
        }
        
        hotels.push(hotel)
        
        if (hotels.length >= HOTELS_PER_CITY) break
      }
      
      page++
      // 避免请求过快
      await sleep(200)
    }
  }
  
  console.log(`   ✅ 获取到 ${hotels.length} 家酒店`)
  return hotels
}

/**
 * 根据酒店名称判断星级
 */
function getStarLevel(name, type) {
  if (!name) return 3
  if (name.includes('五星') || name.includes('豪华') || name.includes('国际') || 
      name.includes('希尔顿') || name.includes('万豪') || name.includes('香格里拉') ||
      name.includes('洲际') || name.includes('丽思卡尔顿') || name.includes('四季')) {
    return 5
  }
  if (name.includes('四星') || name.includes('精选') || name.includes('假日') ||
      name.includes('皇冠') || name.includes('喜来登') || name.includes('威斯汀')) {
    return 4
  }
  if (name.includes('三星') || name.includes('商务') || name.includes('智选') ||
      name.includes('汉庭') || name.includes('如家') || name.includes('锦江')) {
    return 3
  }
  if (name.includes('快捷') || name.includes('经济') || name.includes('青年旅舍')) {
    return 2
  }
  return 3
}

/**
 * 根据星级生成随机价格
 */
function getRandomPrice(name) {
  const level = getStarLevel(name)
  const priceRanges = {
    5: [800, 2500],
    4: [400, 900],
    3: [200, 500],
    2: [100, 300]
  }
  const [min, max] = priceRanges[level] || [200, 500]
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * 生成酒店描述
 */
function generateDescription(poi) {
  const features = [
    '位置优越，交通便利',
    '设施齐全，服务周到',
    '环境优雅，舒适温馨',
    '性价比高，值得推荐'
  ]
  const random = features[Math.floor(Math.random() * features.length)]
  return `${poi.name}${random}。${poi.address ? '地址：' + poi.address : ''}`?.replace(/'/g, "''")
}

/**
 * 生成 SQL 插入语句
 */
function generateSQL(allHotels) {
  let sql = `-- 酒店数据（从高德地图 POI API 获取）
-- 生成时间: ${new Date().toISOString()}
-- 共 ${allHotels.length} 条数据

-- 清空现有酒店数据（可选，取消注释执行）
-- DELETE FROM hotel_tag_relation;
-- DELETE FROM hotel_room;
-- DELETE FROM hotel;

-- 插入酒店数据
`

  // 分批插入（每批 50 条）
  const batchSize = 50
  for (let i = 0; i < allHotels.length; i += batchSize) {
    const batch = allHotels.slice(i, i + batchSize)
    
    sql += `\nINSERT INTO hotel (merchant_id, hotel_name, city, hotel_address, hotel_level, phone, price_start, room_count, description, images, cover_image, score, audit_status, publish_status) VALUES\n`
    
    const values = batch.map((h, idx) => {
      const isLast = idx === batch.length - 1
      return `(1, '${h.name}', '${h.city}', '${h.address}', ${h.level}, '${h.phone}', ${h.price}, ${h.roomCount}, '${h.description}', '', '', ${h.score}, 1, 1)${isLast ? ';' : ','}`
    })
    
    sql += values.join('\n')
    sql += '\n'
  }

  // 为新插入的酒店添加标签关联
  sql += `
-- 为酒店添加标签（随机分配）
-- 获取最新插入的酒店ID范围
SET @start_id = (SELECT MIN(hotel_id) FROM hotel WHERE hotel_name IN (${allHotels.slice(0, 5).map(h => `'${h.name}'`).join(',')}));
SET @end_id = (SELECT MAX(hotel_id) FROM hotel);

-- 为每个酒店随机添加2-4个标签
INSERT IGNORE INTO hotel_tag_relation (hotel_id, tag_id)
SELECT h.hotel_id, t.tag_id
FROM hotel h
CROSS JOIN tag t
WHERE h.hotel_id >= @start_id
  AND RAND() < 0.4
LIMIT 1000;
`

  return sql
}

/**
 * 延时函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 主函数
 */
async function main() {
  if (!AMAP_KEY) {
    console.error('❌ 请在 .env 中配置 AMAP_KEY')
    process.exit(1)
  }

  console.log('🏨 开始从高德地图获取酒店数据...')
  console.log(`📋 目标城市: ${CITIES.join(', ')}`)
  console.log(`📊 每城市获取: ${HOTELS_PER_CITY} 家酒店`)
  
  const allHotels = []
  
  for (const city of CITIES) {
    const hotels = await fetchCityHotels(city)
    allHotels.push(...hotels)
    // 城市间间隔
    await sleep(500)
  }

  console.log(`\n📊 总计获取 ${allHotels.length} 家酒店`)

  // 生成 SQL 文件
  const sql = generateSQL(allHotels)
  const outputPath = path.join(__dirname, 'hotels_data.sql')
  fs.writeFileSync(outputPath, sql, 'utf8')
  
  console.log(`\n✅ SQL 文件已生成: ${outputPath}`)
  console.log('\n📝 下一步:')
  console.log('   1. 检查生成的 SQL 文件')
  console.log('   2. 在 MySQL 中执行: source scripts/hotels_data.sql')
  
  // 同时生成 JSON 备份
  const jsonPath = path.join(__dirname, 'hotels_data.json')
  fs.writeFileSync(jsonPath, JSON.stringify(allHotels, null, 2), 'utf8')
  console.log(`   3. JSON 备份: ${jsonPath}`)
}

main().catch(console.error)


