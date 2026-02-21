/**
 * 高德地图API服务
 * 用于地理编码和距离计算
 */

const AMAP_KEY = process.env.AMAP_KEY

// 城市中心点缓存（避免重复请求）
const cityCenterCache = {}

// 地址经纬度缓存
const geocodeCache = {}

/**
 * 地理编码：地址 → 经纬度
 * @param {string} address 地址字符串
 * @param {string} city 城市名（提高准确度）
 * @returns {Promise<{lng: number, lat: number} | null>}
 */
async function geocode(address, city = '') {
  const cacheKey = `${city}_${address}`
  if (geocodeCache[cacheKey]) {
    return geocodeCache[cacheKey]
  }

  try {
    const params = new URLSearchParams({
      key: AMAP_KEY,
      address: address,
      city: city,
      output: 'json'
    })

    const response = await fetch(`https://restapi.amap.com/v3/geocode/geo?${params}`)
    const data = await response.json()

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      const location = data.geocodes[0].location.split(',')
      const result = {
        lng: parseFloat(location[0]),
        lat: parseFloat(location[1])
      }
      geocodeCache[cacheKey] = result
      return result
    }
    return null
  } catch (error) {
    console.error('高德地理编码失败:', error.message)
    return null
  }
}

/**
 * 获取城市中心点
 * @param {string} city 城市名
 * @returns {Promise<{lng: number, lat: number} | null>}
 */
async function getCityCenter(city) {
  if (cityCenterCache[city]) {
    return cityCenterCache[city]
  }

  // 使用城市名 + "市中心" 作为参考点
  const result = await geocode(`${city}市中心`, city)
  if (result) {
    cityCenterCache[city] = result
  }
  return result
}

/**
 * 计算两点之间的直线距离（Haversine公式）
 * @param {number} lat1 点1纬度
 * @param {number} lng1 点1经度
 * @param {number} lat2 点2纬度
 * @param {number} lng2 点2经度
 * @returns {number} 距离（米）
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000 // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 格式化距离显示
 * @param {number} meters 距离（米）
 * @returns {string} 格式化的距离字符串
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * 批量计算酒店到城市中心的距离
 * @param {Array} hotels 酒店列表（需包含 address 和 city 字段）
 * @param {string} city 目标城市
 * @returns {Promise<Array>} 带距离的酒店列表
 */
async function calculateHotelDistances(hotels, city) {
  if (!AMAP_KEY) {
    console.warn('⚠️ 未配置 AMAP_KEY，跳过距离计算')
    return hotels.map(h => ({ ...h, distance: '—' }))
  }

  if (!city || hotels.length === 0) {
    return hotels.map(h => ({ ...h, distance: '—' }))
  }

  try {
    // 1. 获取城市中心点
    const cityCenter = await getCityCenter(city)
    if (!cityCenter) {
      console.warn(`⚠️ 无法获取城市 ${city} 的中心点`)
      return hotels.map(h => ({ ...h, distance: '—' }))
    }

    // 2. 并行获取所有酒店的经纬度
    const hotelPromises = hotels.map(async (hotel) => {
      const address = hotel.address || `${city}${hotel.name}`
      const coords = await geocode(address, city)
      
      if (coords) {
        const meters = calculateDistance(
          cityCenter.lat, cityCenter.lng,
          coords.lat, coords.lng
        )
        return { ...hotel, distance: formatDistance(meters), distanceMeters: meters }
      }
      return { ...hotel, distance: '—', distanceMeters: 999999 }
    })

    const results = await Promise.all(hotelPromises)
    return results
  } catch (error) {
    console.error('距离计算失败:', error.message)
    return hotels.map(h => ({ ...h, distance: '—' }))
  }
}

/**
 * 计算酒店到指定地点的距离（用于"附近"搜索）
 * @param {Array} hotels 酒店列表
 * @param {string} poiName 地点名称
 * @param {string} city 城市名
 * @returns {Promise<Array>} 带距离的酒店列表（按距离排序）
 */
async function calculateDistanceToPOI(hotels, poiName, city) {
  if (!AMAP_KEY) {
    console.warn('⚠️ 未配置 AMAP_KEY，跳过附近搜索')
    return hotels.map(h => ({ ...h, distance: '—' }))
  }

  if (!poiName || hotels.length === 0) {
    return hotels.map(h => ({ ...h, distance: '—' }))
  }

  try {
    // 1. 获取目标地点的经纬度
    const poiCoords = await geocode(poiName, city)
    if (!poiCoords) {
      console.warn(`⚠️ 无法获取地点 ${poiName} 的坐标`)
      return hotels.map(h => ({ ...h, distance: '—' }))
    }

    console.log(`📍 搜索 "${poiName}" 附近酒店，坐标: ${poiCoords.lng}, ${poiCoords.lat}`)

    // 2. 计算每个酒店到该地点的距离
    const hotelPromises = hotels.map(async (hotel) => {
      const address = hotel.address || `${city}${hotel.name}`
      const coords = await geocode(address, city)
      
      if (coords) {
        const meters = calculateDistance(
          poiCoords.lat, poiCoords.lng,
          coords.lat, coords.lng
        )
        return { ...hotel, distance: formatDistance(meters), distanceMeters: meters }
      }
      return { ...hotel, distance: '—', distanceMeters: 999999 }
    })

    const results = await Promise.all(hotelPromises)
    
    // 3. 按距离排序
    results.sort((a, b) => a.distanceMeters - b.distanceMeters)
    
    return results
  } catch (error) {
    console.error('附近搜索失败:', error.message)
    return hotels.map(h => ({ ...h, distance: '—' }))
  }
}

module.exports = {
  geocode,
  getCityCenter,
  calculateDistance,
  formatDistance,
  calculateHotelDistances,
  calculateDistanceToPOI
}

