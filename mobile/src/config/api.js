/**
 * API 配置
 * 移动端 - 酒店查询相关接口
 */
import Taro from '@tarojs/taro'

// 后端 API 基础地址
export const API_BASE_URL = process.env.TARO_APP_API_URL || 'http://localhost:5000/api'

// 小程序 AppID
export const APP_ID = process.env.TARO_APP_ID || 'touristappid'

// 是否开启调试模式
export const DEBUG = process.env.TARO_APP_DEBUG === 'true'

// API 端点
export const API_ENDPOINTS = {
  // 酒店相关
  HOTELS: '/hotels',              // 获取酒店列表
  HOTEL_DETAIL: '/hotels',        // 获取酒店详情 (使用 /hotels/:id)
  HOTEL_SEARCH: '/hotels/search', // 搜索酒店

  // 房间相关
  ROOMS: '/rooms',                // 获取房间列表
  ROOM_DETAIL: '/rooms',          // 获取房间详情 (使用 /rooms/:id)

  // 城市相关
  CITIES: '/cities',              // 获取城市列表
}

/**
 * 构建完整的 API URL
 * @param {string} endpoint - API 端点
 * @param {string|number} id - 资源 ID (可选)
 * @returns {string} 完整的 URL
 */
export const buildUrl = (endpoint, id = null) => {
  const path = id ? `${endpoint}/${id}` : endpoint
  return `${API_BASE_URL}${path}`
}

/**
 * 通用请求方法 (使用 Taro.request 兼容小程序)
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export const request = async (options = {}) => {
  const { url, method = 'GET', data = {}, header = {} } = options

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  if (DEBUG) {
    console.log('[API Request]', fullUrl, { method, data })
  }

  try {
    const response = await Taro.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
    })

    if (DEBUG) {
      console.log('[API Response]', response.data)
    }

    return response.data
  } catch (error) {
    console.error('[API Error]', error)
    throw error
  }
}

/**
 * 获取酒店列表
 * @param {object} params - 查询参数
 * @returns {Promise} 酒店列表
 */
export const getHotelList = (params = {}) => {
  return request({
    url: API_ENDPOINTS.HOTELS,
    method: 'GET',
    data: params,
  })
}

/**
 * 获取酒店详情
 * @param {number|string} id - 酒店 ID
 * @returns {Promise} 酒店详情
 */
export const getHotelDetail = (id) => {
  return request({
    url: `${API_ENDPOINTS.HOTEL_DETAIL}/${id}`,
    method: 'GET',
  })
}

/**
 * 搜索酒店
 * @param {object} params - 搜索参数
 * @returns {Promise} 搜索结果
 */
export const searchHotels = (params = {}) => {
  return request({
    url: API_ENDPOINTS.HOTEL_SEARCH,
    method: 'GET',
    data: params,
  })
}

/**
 * 获取城市列表
 * @returns {Promise} 城市列表
 */
export const getCityList = () => {
  return request({
    url: API_ENDPOINTS.CITIES,
    method: 'GET',
  })
}
