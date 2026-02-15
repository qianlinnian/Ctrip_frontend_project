import { get } from '../utils/request'

// 统一取 data 字段，兼容裸返回
const unwrap = (res) => (res && res.data !== undefined ? res.data : res)

/**
 * 获取酒店列表
 * GET /hotels/list
 * @param {object} params
 *   - location       城市名
 *   - checkInDate    入住日期 YYYY-MM-DD
 *   - checkOutDate   离店日期 YYYY-MM-DD
 *   - guests         人数
 *   - rooms          房间数
 *   - starLevel      星级，多选逗号分隔，如 "4,5"；不传=不限
 *   - minPrice       最低价（不传=不限）
 *   - maxPrice       最高价（不传=不限）
 *   - sortBy         排序: price_asc | price_desc | score_desc | score_asc | distance_asc
 *   - page / pageSize
 */
export async function searchHotels(params) {
  const {
    destination,
    checkInDate,
    checkOutDate,
    guests,
    rooms,
    starLevel,
    priceMin,
    priceMax,
    sortBy,
    page = 1,
    pageSize = 20,
  } = params

  const query = {
    location: destination,
    checkInDate,
    checkOutDate,
    guests,
    rooms,
    page,
    pageSize,
  }

  if (starLevel && starLevel > 0) query.starLevel = String(starLevel)
  if (priceMin != null && priceMin !== -1) query.minPrice = priceMin
  if (priceMax != null && priceMax !== -1) query.maxPrice = priceMax
  if (sortBy) query.sortBy = sortBy

  const res = await get('/hotels/list', query)
  return unwrap(res)  // 返回 { hotels: [], total, page, pageSize }
}

/**
 * 获取酒店详情
 * GET /hotels/:id
 */
export async function getHotelDetail(id, params = {}) {
  const query = {}
  if (params.checkInDate)  query.checkInDate  = params.checkInDate
  if (params.checkOutDate) query.checkOutDate = params.checkOutDate
  const res = await get(`/hotels/${id}`, query)
  return unwrap(res)  // 返回 hotel 详情对象
}

/**
 * 获取推荐酒店
 * GET /hotels/recommend
 */
export async function getRecommendHotels(params = {}) {
  const query = {}
  if (params.location) query.location = params.location
  if (params.limit)    query.limit    = params.limit
  const res = await get('/hotels/recommend', query)
  return unwrap(res)  // 返回 hotel[]
}

/**
 * 获取热门城市
 * GET /cities/hot
 */
export async function getHotCities() {
  const res = await get('/cities/hot')
  return unwrap(res)  // 返回 city[]
}
