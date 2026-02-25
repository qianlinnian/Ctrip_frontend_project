/**
 * 价格格式化工具函数
 */

/**
 * 格式化价格,添加货币符号和千分位
 * @param {number} price - 价格数字
 * @param {string} currency - 货币符号,默认 '¥'
 * @returns {string} 格式化后的价格字符串
 */
export function formatPrice(price, currency = '¥') {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0
  }

  // 添加千分位分隔符
  const priceStr = price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return `${currency}${priceStr}`
}

/**
 * 格式化价格范围
 * @param {number} minPrice - 最低价格
 * @param {number} maxPrice - 最高价格
 * @returns {string} 格式化后的价格范围
 */
export function formatPriceRange(minPrice, maxPrice) {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

/**
 * 计算总价
 * @param {number} pricePerNight - 每晚价格
 * @param {number} nights - 入住天数
 * @param {number} rooms - 房间数量
 * @returns {number} 总价
 */
export function calculateTotalPrice(pricePerNight, nights, rooms = 1) {
  return pricePerNight * nights * rooms
}
