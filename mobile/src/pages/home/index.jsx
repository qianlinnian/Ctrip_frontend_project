import { View, Text, Input, Button, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { convertLocationToCity } from '../../utils/location'
import CalendarPicker from '../../components/CalendarPicker'
import PriceRangeSlider from '../../components/PriceRangeSlider'
import { API_BASE_URL } from '../../config/api'
import './index.scss'

// 热门城市数据
const HOT_DESTINATIONS = {
  domestic: ['上海', '北京', '广州', '深圳', '杭州', '成都', '重庆', '南京', '西安', '苏州', '厦门', '三亚'],
  overseas: ['东京', '大阪', '曼谷', '新加坡', '首尔', '巴黎', '伦敦', '纽约', '迪拜', '悉尼', '吉隆坡', '巴厘岛']
}

// 完整城市库，含拼音首字母和国内/海外标记
const ALL_CITIES = [
  // 国内
  { name: '北京', pinyin: 'B', type: 'domestic' },
  { name: '成都', pinyin: 'C', type: 'domestic' },
  { name: '常州', pinyin: 'C', type: 'domestic' },
  { name: '大连', pinyin: 'D', type: 'domestic' },
  { name: '东莞', pinyin: 'D', type: 'domestic' },
  { name: '福州', pinyin: 'F', type: 'domestic' },
  { name: '佛山', pinyin: 'F', type: 'domestic' },
  { name: '广州', pinyin: 'G', type: 'domestic' },
  { name: '贵阳', pinyin: 'G', type: 'domestic' },
  { name: '哈尔滨', pinyin: 'H', type: 'domestic' },
  { name: '杭州', pinyin: 'H', type: 'domestic' },
  { name: '海口', pinyin: 'H', type: 'domestic' },
  { name: '合肥', pinyin: 'H', type: 'domestic' },
  { name: '惠州', pinyin: 'H', type: 'domestic' },
  { name: '呼和浩特', pinyin: 'H', type: 'domestic' },
  { name: '济南', pinyin: 'J', type: 'domestic' },
  { name: '昆明', pinyin: 'K', type: 'domestic' },
  { name: '兰州', pinyin: 'L', type: 'domestic' },
  { name: '拉萨', pinyin: 'L', type: 'domestic' },
  { name: '南京', pinyin: 'N', type: 'domestic' },
  { name: '南宁', pinyin: 'N', type: 'domestic' },
  { name: '南昌', pinyin: 'N', type: 'domestic' },
  { name: '宁波', pinyin: 'N', type: 'domestic' },
  { name: '青岛', pinyin: 'Q', type: 'domestic' },
  { name: '重庆', pinyin: 'Q', type: 'domestic' },
  { name: '上海', pinyin: 'S', type: 'domestic' },
  { name: '深圳', pinyin: 'S', type: 'domestic' },
  { name: '沈阳', pinyin: 'S', type: 'domestic' },
  { name: '石家庄', pinyin: 'S', type: 'domestic' },
  { name: '苏州', pinyin: 'S', type: 'domestic' },
  { name: '三亚', pinyin: 'S', type: 'domestic' },
  { name: '天津', pinyin: 'T', type: 'domestic' },
  { name: '太原', pinyin: 'T', type: 'domestic' },
  { name: '温州', pinyin: 'W', type: 'domestic' },
  { name: '武汉', pinyin: 'W', type: 'domestic' },
  { name: '无锡', pinyin: 'W', type: 'domestic' },
  { name: '乌鲁木齐', pinyin: 'W', type: 'domestic' },
  { name: '厦门', pinyin: 'X', type: 'domestic' },
  { name: '西安', pinyin: 'X', type: 'domestic' },
  { name: '西宁', pinyin: 'X', type: 'domestic' },
  { name: '银川', pinyin: 'Y', type: 'domestic' },
  { name: '郑州', pinyin: 'Z', type: 'domestic' },
  { name: '珠海', pinyin: 'Z', type: 'domestic' },
  { name: '长春', pinyin: 'Z', type: 'domestic' },
  { name: '长沙', pinyin: 'Z', type: 'domestic' },
  { name: '中山', pinyin: 'Z', type: 'domestic' },
  // 海外
  { name: '阿姆斯特丹', pinyin: 'A', type: 'overseas' },
  { name: '奥克兰', pinyin: 'A', type: 'overseas' },
  { name: '巴黎', pinyin: 'B', type: 'overseas' },
  { name: '巴塞罗那', pinyin: 'B', type: 'overseas' },
  { name: '巴厘岛', pinyin: 'B', type: 'overseas' },
  { name: '柏林', pinyin: 'B', type: 'overseas' },
  { name: '布拉格', pinyin: 'B', type: 'overseas' },
  { name: '布达佩斯', pinyin: 'B', type: 'overseas' },
  { name: '釜山', pinyin: 'F', type: 'overseas' },
  { name: '多伦多', pinyin: 'D', type: 'overseas' },
  { name: '多哈', pinyin: 'D', type: 'overseas' },
  { name: '迪拜', pinyin: 'D', type: 'overseas' },
  { name: '芝加哥', pinyin: 'Z', type: 'overseas' },
  { name: '吉隆坡', pinyin: 'J', type: 'overseas' },
  { name: '济州岛', pinyin: 'J', type: 'overseas' },
  { name: '京都', pinyin: 'J', type: 'overseas' },
  { name: '开罗', pinyin: 'K', type: 'overseas' },
  { name: '开普敦', pinyin: 'K', type: 'overseas' },
  { name: '伦敦', pinyin: 'L', type: 'overseas' },
  { name: '洛杉矶', pinyin: 'L', type: 'overseas' },
  { name: '拉斯维加斯', pinyin: 'L', type: 'overseas' },
  { name: '马尼拉', pinyin: 'M', type: 'overseas' },
  { name: '曼谷', pinyin: 'M', type: 'overseas' },
  { name: '迈阿密', pinyin: 'M', type: 'overseas' },
  { name: '墨尔本', pinyin: 'M', type: 'overseas' },
  { name: '莫斯科', pinyin: 'M', type: 'overseas' },
  { name: '纽约', pinyin: 'N', type: 'overseas' },
  { name: '普吉岛', pinyin: 'P', type: 'overseas' },
  { name: '清迈', pinyin: 'Q', type: 'overseas' },
  { name: '罗马', pinyin: 'L', type: 'overseas' },
  { name: '首尔', pinyin: 'S', type: 'overseas' },
  { name: '新加坡', pinyin: 'X', type: 'overseas' },
  { name: '悉尼', pinyin: 'X', type: 'overseas' },
  { name: '旧金山', pinyin: 'J', type: 'overseas' },
  { name: '雅加达', pinyin: 'Y', type: 'overseas' },
  { name: '伊斯坦布尔', pinyin: 'Y', type: 'overseas' },
  { name: '温哥华', pinyin: 'W', type: 'overseas' },
  { name: '维也纳', pinyin: 'W', type: 'overseas' },
  { name: '大阪', pinyin: 'D', type: 'overseas' },
  { name: '东京', pinyin: 'D', type: 'overseas' },
]

// 按拼音首字母分组（用于完整城市库展示）
const CITIES_BY_LETTER = ALL_CITIES.reduce((acc, city) => {
  if (!acc[city.pinyin]) acc[city.pinyin] = []
  acc[city.pinyin].push(city)
  return acc
}, {})
const SORTED_LETTERS = Object.keys(CITIES_BY_LETTER).sort()

// 判断当前是否是凌晨时段（0:00-6:00）
function isEarlyMorning() {
  const hour = new Date().getHours()
  return hour >= 0 && hour < 6
}

// 格式化日期为字符串
function formatDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取默认入住日期（凌晨时段返回昨天，否则返回今天）
function getDefaultCheckInDate() {
  const d = new Date()
  if (isEarlyMorning()) {
    d.setDate(d.getDate() - 1) // 凌晨入住，入住日期为昨天
  }
  return formatDateStr(d)
}

// 获取默认离店日期（入住日期的次日）
function getDefaultCheckOutDate() {
  const d = new Date()
  if (!isEarlyMorning()) {
    d.setDate(d.getDate() + 1) // 非凌晨，离店为明天
  }
  // 凌晨入住时，离店为今天（即当天中午12点后）
  return formatDateStr(d)
}

export default function Home() {
  // 从本地存储读取上次的入住信息，否则使用默认值
  const getInitialSearchParams = () => {
    try {
      const saved = Taro.getStorageSync('bookingInfo')
      if (saved) {
        return {
          destination: saved.destination || '上海',
          checkInDate: saved.checkInDate || getDefaultCheckInDate(),
          checkOutDate: saved.checkOutDate || getDefaultCheckOutDate(),
          guests: saved.guests || 2,
          rooms: saved.rooms || 1,
          nights: saved.nights || 1,
          keyword: '',
          starLevel: saved.starLevel || 0,
          priceMin: saved.priceMin ?? -1,
          priceMax: saved.priceMax ?? -1
        }
      }
    } catch (e) {
      console.log('读取本地存储失败', e)
    }
    return {
      destination: '上海',
      checkInDate: getDefaultCheckInDate(),
      checkOutDate: getDefaultCheckOutDate(),
      guests: 2,
      rooms: 1,
      nights: 1,
      keyword: '',
      starLevel: 0,
      priceMin: -1,
      priceMax: -1
    }
  }

  // 搜索参数状态
  const [searchParams, setSearchParams] = useState(getInitialSearchParams)
  const [currentLocation, setCurrentLocation] = useState('定位中...') // 当前定位
  const [isLocating, setIsLocating] = useState(false) // 是否正在定位

  // 当入住信息变化时，保存到本地存储
  useEffect(() => {
    try {
      Taro.setStorageSync('bookingInfo', {
        destination: searchParams.destination,
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        guests: searchParams.guests,
        rooms: searchParams.rooms,
        nights: searchParams.nights,
        starLevel: searchParams.starLevel,
        priceMin: searchParams.priceMin,
        priceMax: searchParams.priceMax
      })
    } catch (e) {
      console.log('保存本地存储失败', e)
    }
  }, [searchParams])

  // 控制选择器显示
  const [showDestinationPicker, setShowDestinationPicker] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  // 目的地搜索相关
  const [destinationTab, setDestinationTab] = useState(0) // 0=国内 1=海外
  const [destinationKeyword, setDestinationKeyword] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const debounceTimerRef = useRef(null)
  const [showGuestRoomPicker, setShowGuestRoomPicker] = useState(false)

  // Banner 数据（从数据库获取推荐酒店）
  const [bannerList, setBannerList] = useState([
    // 默认占位数据，防止初始渲染空白
    { id: 1, image: 'https://loremflickr.com/750/300/hotel?lock=1', title: '加载中...' },
    { id: 2, image: 'https://loremflickr.com/750/300/hotel?lock=2', title: '加载中...' },
    { id: 3, image: 'https://loremflickr.com/750/300/hotel?lock=3', title: '加载中...' },
  ])

  // 获取推荐酒店作为 Banner
  useEffect(() => {
    const fetchBannerHotels = async () => {
      try {
        const res = await Taro.request({
          url: `${API_BASE_URL}/hotels/recommend`,
          method: 'GET',
          data: { limit: 5 }
        })
        if (res.data && res.data.data && res.data.data.length > 0) {
          const hotels = res.data.data.slice(0, 5) // 最多取5个
          const banners = hotels.map(hotel => ({
            id: hotel.id,
            image: hotel.image || `https://loremflickr.com/750/300/hotel?lock=${hotel.id}`,
            title: hotel.name || hotel.hotel_name
          }))
          setBannerList(banners)
        }
      } catch (error) {
        console.log('获取 Banner 酒店失败，使用默认图片', error)
      }
    }
    fetchBannerHotels()
  }, [])

  // 点击 Banner 跳转到酒店详情页
  const handleBannerClick = (hotelId) => {
    const p = searchParams
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotelId}&checkInDate=${p.checkInDate}&checkOutDate=${p.checkOutDate}&nights=${p.nights}&guests=${p.guests}&rooms=${p.rooms}`
    })
  }

  const getCurrentLocation = () => {
    setIsLocating(true)
    setCurrentLocation('定位中...')

    // 使用真实定位
    Taro.getLocation({
      type: 'wgs84',
      success: async (res) => {
        console.log('定位成功:', res)
        console.log('当前平台:', process.env.TARO_ENV)

        try {
          const city = await convertLocationToCity(res.longitude, res.latitude)

          console.log('定位城市:', city)

          setCurrentLocation(city)
          setSearchParams({
            ...searchParams,
            destination: city
          })
          setIsLocating(false)

          Taro.showToast({
            title: `定位到: ${city}`,
            icon: 'success',
            duration: 2000
          })
        } catch (error) {
          console.error('❌ 获取城市失败:', error)
          setCurrentLocation('定位失败')
          setIsLocating(false)

          Taro.showToast({
            title: '获取城市失败',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('❌ 定位失败:', err)
        setCurrentLocation('定位失败')
        setIsLocating(false)

        Taro.showToast({
          title: '定位失败，请手动选择',
          icon: 'none'
        })
      }
    })
  }

  // Tab 数据
  const tabs = ['国内', '海外']
  const [activeTab, setActiveTab] = useState(0)

  // 切换主 Tab，同时更新默认目的地
  const handleTabChange = (index) => {
    setActiveTab(index)
    if (index === 1 && activeTab !== 1) {
      // 切到海外：默认东京
      setSearchParams(prev => ({ ...prev, destination: '东京' }))
    } else if (index === 0 && activeTab !== 0) {
      // 切回国内：默认上海
      setSearchParams(prev => ({ ...prev, destination: '上海' }))
    }
  }

  // 快捷标签（从 API 获取）
  const [quickTags, setQuickTags] = useState(['免费WiFi', '游泳池', '健身房']) // 默认值
  const [selectedTags, setSelectedTags] = useState([]) // 选中的标签
  
  // 获取热门标签
  useEffect(() => {
    const fetchHotTags = async () => {
      try {
        const res = await Taro.request({
          url: `${API_BASE_URL}/tags/hot`,
          method: 'GET',
          data: { limit: 8 }
        })
        if (res.data && res.data.data && res.data.data.length > 0) {
          setQuickTags(res.data.data.map(t => t.name))
        }
      } catch (error) {
        console.log('获取热门标签失败，使用默认标签', error)
      }
    }
    fetchHotTags()
  }, [])

  // 点击标签切换选中状态
  const handleTagClick = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        // 已选中，取消选中
        return prev.filter(t => t !== tagName)
      } else {
        // 未选中，添加选中
        return [...prev, tagName]
      }
    })
  }

  // 格式化日期显示
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]
    return { month, day, weekday }
  }

  // 本地城市搜索（不依赖网络）
  const searchDestination = (keyword) => {
    const kw = keyword.trim()
    if (!kw) { setSearchSuggestions([]); return }
    const results = ALL_CITIES.filter(city => city.name.includes(kw)).slice(0, 8)
    setSearchSuggestions(results)
  }

  // 搜索框输入处理（防抖 200ms）
  const handleDestinationKeywordChange = (e) => {
    const keyword = e.detail.value
    setDestinationKeyword(keyword)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    if (!keyword.trim()) {
      setSearchSuggestions([])
      return
    }
    debounceTimerRef.current = setTimeout(() => searchDestination(keyword), 200)
  }

  // 关闭目的地选择器并清理搜索状态
  const handleCloseDestinationPicker = () => {
    setShowDestinationPicker(false)
    setDestinationKeyword('')
    setSearchSuggestions([])
  }

  // 处理目的地选择
  const handleDestinationSelect = (destination, type) => {
    setSearchParams({ ...searchParams, destination })
    // 根据城市类型同步外部 Tab（0=国内, 1=海外）
    if (type === 'overseas') setActiveTab(1)
    else if (type === 'domestic') setActiveTab(0)
    setShowDestinationPicker(false)
    setDestinationKeyword('')
    setSearchSuggestions([])
  }

  // 处理日历确认
  const handleCalendarConfirm = (checkIn, checkOut, nights) => {
    setSearchParams({
      ...searchParams,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights
    })
    setShowCalendar(false)
  }

  // 人数/房间数操作
  const increaseGuests = () => {
    if (searchParams.guests < 8) {
      setSearchParams({ ...searchParams, guests: searchParams.guests + 1 })
    }
  }
  const decreaseGuests = () => {
    if (searchParams.guests > 1) {
      setSearchParams({ ...searchParams, guests: searchParams.guests - 1 })
    }
  }
  const increaseRooms = () => {
    if (searchParams.rooms < 5) {
      setSearchParams({ ...searchParams, rooms: searchParams.rooms + 1 })
    }
  }
  const decreaseRooms = () => {
    if (searchParams.rooms > 1) {
      setSearchParams({ ...searchParams, rooms: searchParams.rooms - 1 })
    }
  }

  // 处理查询，跳转到列表页
  const handleSearch = () => {
    const p = searchParams
    let url = `/pages/list/index?destination=${encodeURIComponent(p.destination)}&checkInDate=${p.checkInDate}&checkOutDate=${p.checkOutDate}&nights=${p.nights}&guests=${p.guests}&rooms=${p.rooms}&starLevel=${p.starLevel}&priceMin=${p.priceMin}&priceMax=${p.priceMax}`
    
    // 如果有选中的标签，添加到 URL
    if (selectedTags.length > 0) {
      url += `&tags=${encodeURIComponent(selectedTags.join(','))}`
    }
    
    Taro.navigateTo({ url })
  }

  const checkInDateObj = formatDateDisplay(searchParams.checkInDate)
  const checkOutDateObj = formatDateDisplay(searchParams.checkOutDate)

  return (
    <View className="home">
      {/* 顶部 Banner - 点击跳转酒店详情 */}
      <Swiper
        className="banner-swiper"
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#ffffff"
        indicatorDots
        circular
        autoplay
        interval={4000}
        duration={500}
      >
        {bannerList.map((banner) => (
          <SwiperItem key={banner.id} onClick={() => handleBannerClick(banner.id)}>
            <View className="banner-item">
              <Image className="banner-image" src={banner.image} mode="aspectFill" />
              <View className="banner-title-overlay">
                <Text className="banner-title-text">{banner.title}</Text>
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 主查询卡片 */}
      <View className="search-card">
        {/* Tab 切换 */}
        <View className="tabs">
          {tabs.map((tab, index) => (
            <View
              key={index}
              className={`tab-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              <Text className="tab-text">{tab}</Text>
            </View>
          ))}
        </View>

        {/* 目的地 */}
        <View className="destination-row">
          <View className="destination-left" onClick={() => setShowDestinationPicker(true)}>
            <Text className="destination-text">{searchParams.destination}</Text>
            <AtIcon value='chevron-down' size='18' color='#999' />
          </View>

          {/* 定位按钮 */}
          <View className="location-btn" onClick={getCurrentLocation}>
            {isLocating ? (
              <>
                <AtIcon value='loading-3' size='18' color='#0086F6' className='loading-icon' />
                <Text className="location-text">定位中</Text>
              </>
            ) : (
              <>
                <AtIcon value='map-pin' size='18' color='#0086F6' />
                <Text className="location-text">定位</Text>
              </>
            )}
          </View>
        </View>

        {/* 搜索框 */}
        <View className="search-input-wrapper">
          <AtIcon value='search' size='18' color='#999' className='search-icon-at' />
          <Input
            className="search-input"
            placeholder="搜索"
            value={searchParams.keyword}
            onInput={(e) => setSearchParams({ ...searchParams, keyword: e.detail.value })}
          />
        </View>

        {/* 日期选择 */}
        <View className="date-row" onClick={() => setShowCalendar(true)}>
          <View className="date-item">
            <Text className="date-number">
              {checkInDateObj.month}月{checkInDateObj.day}日
            </Text>
            <Text className="date-week">{checkInDateObj.weekday}</Text>
          </View>

          <View className="date-divider">
            <Text className="nights-text">共{searchParams.nights}晚</Text>
          </View>

          <View className="date-item">
            <Text className="date-number">
              {checkOutDateObj.month}月{checkOutDateObj.day}日
            </Text>
            <Text className="date-week">{checkOutDateObj.weekday}</Text>
          </View>
        </View>

        {/* 入住人数/房间数 */}
        <View className="guest-room-row" onClick={() => setShowGuestRoomPicker(true)}>
          <Text className="guest-room-text">
            {searchParams.rooms}间房 · {searchParams.guests}人 · {searchParams.starLevel === 0 ? '星级不限' : `${searchParams.starLevel}星`} · {searchParams.priceMin === -1 && searchParams.priceMax === -1 ? '价格不限' : searchParams.priceMax === -1 ? `¥${searchParams.priceMin} 以上` : `¥${searchParams.priceMin} - ¥${searchParams.priceMax}`}
          </Text>
        </View>

        {/* 快捷标签 - 点击选中作为筛选条件 */}
        <View className="quick-tags">
          {quickTags.map((tag, index) => (
            <View 
              key={index} 
              className={`tag-item ${selectedTags.includes(tag) ? 'selected' : ''}`} 
              onClick={() => handleTagClick(tag)}
            >
              <Text className="tag-text">{tag}</Text>
            </View>
          ))}
        </View>

        {/* 查询按钮 */}
        <Button className="search-btn" onClick={handleSearch}>
          查询
        </Button>
      </View>


      {/* 目的地选择器 */}
      {showDestinationPicker && (
        <View className="picker-mask" onClick={handleCloseDestinationPicker}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">选择目的地</Text>
              <View onClick={handleCloseDestinationPicker}>
                <AtIcon value='close' size='24' color='#999' />
              </View>
            </View>

            {/* 搜索框 */}
            <View className="destination-search-bar">
              <AtIcon value='search' size='18' color='#999' />
              <Input
                className="destination-search-input"
                placeholder="搜索城市"
                value={destinationKeyword}
                onInput={handleDestinationKeywordChange}
              />
              {destinationKeyword.length > 0 && (
                <View className="destination-search-clear" onClick={() => {
                  setDestinationKeyword('')
                  setSearchSuggestions([])
                }}>
                  <AtIcon value='close-circle' size='18' color='#ccc' />
                </View>
              )}
            </View>

            {destinationKeyword.trim() ? (
              /* 搜索结果 */
              <View className="destination-list">
                {searchSuggestions.length === 0 && (
                  <View className="destination-empty">
                    <Text className="destination-empty-text">未找到相关城市</Text>
                  </View>
                )}
                {searchSuggestions.map((city, index) => (
                  <View
                    key={index}
                    className="destination-item"
                    onClick={() => handleDestinationSelect(city.name, city.type)}
                  >
                    <Text className="destination-item-name">{city.name}</Text>
                    <Text className="destination-item-district">{city.type === 'overseas' ? '海外' : '国内'}</Text>
                  </View>
                ))}
              </View>
            ) : (
              /* 热门城市 + 完整城市库 */
              <View className="destination-hot">
                <View className="destination-tab-bar">
                  <View
                    className={`destination-tab-item ${destinationTab === 0 ? 'active' : ''}`}
                    onClick={() => setDestinationTab(0)}
                  >
                    <Text className="destination-tab-text">国内热门</Text>
                  </View>
                  <View
                    className={`destination-tab-item ${destinationTab === 1 ? 'active' : ''}`}
                    onClick={() => setDestinationTab(1)}
                  >
                    <Text className="destination-tab-text">海外热门</Text>
                  </View>
                </View>

                {/* 热门城市 */}
                <View className="destination-hot-grid">
                  {(destinationTab === 0 ? HOT_DESTINATIONS.domestic : HOT_DESTINATIONS.overseas).map((city, index) => (
                    <View
                      key={index}
                      className="destination-hot-item"
                      onClick={() => handleDestinationSelect(city, destinationTab === 0 ? 'domestic' : 'overseas')}
                    >
                      <Text>{city}</Text>
                    </View>
                  ))}
                </View>

                {/* 完整城市库，按首字母分组 */}
                <View className="destination-list">
                  {SORTED_LETTERS.map(letter => (
                    <View key={letter}>
                      <View className="destination-letter-header">
                        <Text className="destination-letter-text">{letter}</Text>
                      </View>
                      {CITIES_BY_LETTER[letter].map((city, index) => (
                        <View
                          key={index}
                          className="destination-item"
                          onClick={() => handleDestinationSelect(city.name, city.type)}
                        >
                          <Text className="destination-item-name">{city.name}</Text>
                          <Text className="destination-item-district">{city.type === 'overseas' ? '海外' : '国内'}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* 日历选择器 */}
      <CalendarPicker
        visible={showCalendar}
        checkInDate={searchParams.checkInDate}
        checkOutDate={searchParams.checkOutDate}
        onConfirm={handleCalendarConfirm}
        onClose={() => setShowCalendar(false)}
      />

      {/* 人间夜选择器 */}
      {showGuestRoomPicker && (
        <View className="picker-mask" onClick={() => setShowGuestRoomPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">入住信息</Text>
              <View onClick={() => setShowGuestRoomPicker(false)}>
                <AtIcon value='close' size='24' color='#999' />
              </View>
            </View>
            <View className="guest-room-picker">
              {/* 人数 */}
              <View className="picker-row-item">
                <Text className="picker-label">入住人数</Text>
                <View className="counter">
                  <Button className="counter-btn" onClick={decreaseGuests} disabled={searchParams.guests <= 1}>-</Button>
                  <Text className="counter-value">{searchParams.guests}</Text>
                  <Button className="counter-btn" onClick={increaseGuests} disabled={searchParams.guests >= 8}>+</Button>
                </View>
              </View>
              {/* 房间 */}
              <View className="picker-row-item">
                <Text className="picker-label">房间数量</Text>
                <View className="counter">
                  <Button className="counter-btn" onClick={decreaseRooms} disabled={searchParams.rooms <= 1}>-</Button>
                  <Text className="counter-value">{searchParams.rooms}</Text>
                  <Button className="counter-btn" onClick={increaseRooms} disabled={searchParams.rooms >= 5}>+</Button>
                </View>
              </View>
              {/* 星级 */}
              <View className="picker-section">
                <Text className="picker-label">酒店星级</Text>
                <View className="picker-chips">
                  {[{ label: '不限', value: 0 }, { label: '2星', value: 2 }, { label: '3星', value: 3 }, { label: '4星', value: 4 }, { label: '5星', value: 5 }].map(item => (
                    <View
                      key={item.value}
                      className={`picker-chip ${searchParams.starLevel === item.value ? 'active' : ''}`}
                      onClick={() => setSearchParams({ ...searchParams, starLevel: item.value })}
                    >
                      <Text className="picker-chip-text">{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {/* 价格区间 */}
              <View className="picker-section">
                <Text className="picker-label">价格区间</Text>
                <PriceRangeSlider
                  min={0}
                  max={2000}
                  step={50}
                  valueMin={searchParams.priceMin}
                  valueMax={searchParams.priceMax}
                  onChange={(mn, mx) => setSearchParams({ ...searchParams, priceMin: mn, priceMax: mx })}
                />
              </View>
              <Button className="confirm-btn" onClick={() => setShowGuestRoomPicker(false)}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
