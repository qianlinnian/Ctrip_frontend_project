import { request, API_ENDPOINTS } from '../config/api'

/**
 * 获取热门标签
 */
export async function getHotTags() {
  const res = await request({
    url: API_ENDPOINTS.TAGS_HOT,
    method: 'GET',
  })
  return res.data || res || []
}

/**
 * 获取所有标签
 */
export async function getAllTags() {
  const res = await request({
    url: API_ENDPOINTS.TAGS,
    method: 'GET',
  })
  return res.data || res || []
}

