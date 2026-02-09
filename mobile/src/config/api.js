/**
 * API 配置
 * 自动根据环境读取不同的配置
 */

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
  HOTEL_DETAIL: '/hotels/:id',    // 获取酒店详情
  HOTEL_SEARCH: '/hotels/search', // 搜索酒店

  // 房间相关
  ROOMS: '/rooms',                // 获取房间列表
  ROOM_DETAIL: '/rooms/:id',      // 获取房间详情

  // 订单相关
  ORDERS: '/orders',              // 订单列表
  CREATE_ORDER: '/orders/create', // 创建订单

  // 用户相关
  LOGIN: '/auth/login',           // 登录
  REGISTER: '/auth/register',     // 注册
  USER_INFO: '/user/info',        // 用户信息
}

/**
 * 构建完整的 API URL
 * @param {string} endpoint - API 端点
 * @param {object} params - URL 参数 (可选)
 * @returns {string} 完整的 URL
 */
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint

  // 替换路径参数，如 /hotels/:id -> /hotels/123
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key])
  })

  return `${API_BASE_URL}${url}`
}

/**
 * 通用请求方法
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export const request = async (url, options = {}) => {
  const fullUrl = url.startsWith('http') ? url : buildUrl(url)

  if (DEBUG) {
    console.log('[API Request]', fullUrl, options)
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (DEBUG) {
      console.log('[API Response]', data)
    }

    return data
  } catch (error) {
    console.error('[API Error]', error)
    throw error
  }
}
