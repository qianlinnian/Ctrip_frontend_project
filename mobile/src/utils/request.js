/**
 * 网络请求封装工具
 */

import Taro from '@tarojs/taro'
import { API_BASE_URL } from '../config/api'

/**
 * 封装的请求方法
 * @param {string} url - 请求URL
 * @param {object} options - 请求配置
 * @returns {Promise} 请求结果
 */
export function request(url, options = {}) {
  const {
    method = 'GET',
    data = {},
    header = {}
  } = options

  // 完整URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

  return new Promise((resolve, reject) => {
    Taro.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          Taro.showToast({
            title: '请求失败',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
export function get(url, data = {}) {
  return request(url, {
    method: 'GET',
    data
  })
}

/**
 * POST 请求
 */
export function post(url, data = {}) {
  return request(url, {
    method: 'POST',
    data
  })
}

/**
 * PUT 请求
 */
export function put(url, data = {}) {
  return request(url, {
    method: 'PUT',
    data
  })
}

/**
 * DELETE 请求
 */
export function del(url, data = {}) {
  return request(url, {
    method: 'DELETE',
    data
  })
}
