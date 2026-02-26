/**
 * 地理定位工具函数 - 支持 H5 和微信小程序
 */
import Taro from '@tarojs/taro'

// 逆地理编码使用 Web服务 Key（REST API 只接受 Web服务类型的 Key）
const getAmapKey = () => {
  return process.env.TARO_APP_AMAP_WEB_KEY || ''
}

/**
 * 将经纬度转换为城市名（逆地理编码）
 * @param {number} longitude - 经度
 * @param {number} latitude - 纬度
 * @returns {Promise<string>} 城市名
 */
export async function convertLocationToCity(longitude, latitude) {
  const AMAP_KEY = getAmapKey()
  
  if (!AMAP_KEY) {
    console.error('高德地图 Key 未配置')
    return '定位失败'
  }

  try {
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${AMAP_KEY}&radius=1000&extensions=base`
    
    console.log('调用高德地图API:', url.replace(AMAP_KEY, '***'))
    
    const response = await Taro.request({ url, method: 'GET' })
    const data = response.data
    
    console.log('高德地图返回:', data)
    
    if (data.status === '1' && data.regeocode) {
      // 获取城市名
      const addressComponent = data.regeocode.addressComponent
      let city = addressComponent.city || addressComponent.province
      
      // 处理直辖市情况（city 为空数组）
      if (Array.isArray(city) && city.length === 0) {
        city = addressComponent.province
      }
      
      // 去掉"市"字，保持简洁
      city = city.replace('市', '')
      
      console.log('✅ 逆地理编码成功:', {
        platform: process.env.TARO_ENV,
        city,
        district: addressComponent.district,
        address: data.regeocode.formatted_address
      })
      
      return city
    } else {
      console.error('❌ 逆地理编码失败:', data.info)
      return '定位失败'
    }
  } catch (error) {
    console.error('❌ 逆地理编码请求失败:', error)
    return '定位失败'
  }
}
