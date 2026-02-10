import { View, Text, Input, Button, Picker, Swiper, SwiperItem, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { convertLocationToCity } from '../../utils/location'
import './index.scss'

export default function Home() {
  // 搜索参数状态
  const [searchParams, setSearchParams] = useState({
    destination: '上海',
    checkInDate: '2026-01-09',
    checkOutDate: '2026-01-10',
    guests: 2,
    rooms: 1,
    nights: 1,
    keyword: ''
  })
  const [currentLocation, setCurrentLocation] = useState('定位中...') // 当前定位
  const [isLocating, setIsLocating] = useState(false) // 是否正在定位

  // 控制选择器显示
  const [showDestinationPicker, setShowDestinationPicker] = useState(false)
  const [showGuestRoomPicker, setShowGuestRoomPicker] = useState(false)

  // Banner 数据
  const bannerList = [
    {
      id: 1,
      image: 'https://via.placeholder.com/750x300/FF6B35/ffffff?text=酒店折扣',
      title: '酒店折扣'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/750x300/4ECDC4/ffffff?text=周末优惠',
      title: '周末优惠'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/750x300/556270/ffffff?text=春节特惠',
      title: '春节特惠'
    }
  ]
  const getCurrentLocation = () => {
    setIsLocating(true)
    setCurrentLocation('定位中...')

    // 使用真实定位
    Taro.getLocation({
      type: 'wgs84',
      success: async (res) => {
        console.log('📍 定位成功:', res)
        console.log('🔧 当前平台:', process.env.TARO_ENV)

        try {
          const city = await convertLocationToCity(res.longitude, res.latitude)

          console.log('✅ 定位城市:', city)

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
  const tabs = ['国内', '海外', '特价房', '民宿']
  const [activeTab, setActiveTab] = useState(0)

  // 目的地列表
  const destinationList = [
    '上海',
    '北京',
    '广州',
    '深圳',
    '杭州',
    '成都',
    '重庆',
    '南京',
    '西安',
    '苏州'
  ]

  // 快捷标签
  const quickTags = ['免费早餐', '上海环球影城', '上海迪士尼乐园']

  // 格式化日期显示
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]
    return { month, day, weekday }
  }

  // 计算天数
  const calculateNights = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 处理目的地选择
  const handleDestinationSelect = (destination) => {
    setSearchParams({
      ...searchParams,
      destination: destination
    })
    setShowDestinationPicker(false)
  }

  // 处理入住日期变化
  const handleCheckInDateChange = (e) => {
    const newCheckInDate = e.detail.value
    setSearchParams({
      ...searchParams,
      checkInDate: newCheckInDate,
      nights: calculateNights(newCheckInDate, searchParams.checkOutDate)
    })
  }

  // 处理离店日期变化
  const handleCheckOutDateChange = (e) => {
    const newCheckOutDate = e.detail.value
    setSearchParams({
      ...searchParams,
      checkOutDate: newCheckOutDate,
      nights: calculateNights(searchParams.checkInDate, newCheckOutDate)
    })
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

  // 处理查询
  const handleSearch = () => {
    console.log('搜索参数:', searchParams)
    // TODO: 跳转到列表页
  }

  const checkInDateObj = formatDateDisplay(searchParams.checkInDate)
  const checkOutDateObj = formatDateDisplay(searchParams.checkOutDate)

  return (
    <View className="home">
      {/* 顶部 Banner */}
      <Swiper
        className="banner-swiper"
        indicatorColor="rgba(255, 255, 255, 0.5)"
        indicatorActiveColor="#ffffff"
        circular
        autoplay
        interval={3000}
        duration={500}
      >
        {bannerList.map((banner) => (
          <SwiperItem key={banner.id}>
            <Image className="banner-image" src={banner.image} mode="aspectFill" />
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
              onClick={() => setActiveTab(index)}
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
            placeholder="位置/品牌/酒店"
            value={searchParams.keyword}
            onInput={(e) => setSearchParams({ ...searchParams, keyword: e.detail.value })}
          />
        </View>

        {/* 日期选择 */}
        <View className="date-row">
          <Picker mode="date" value={searchParams.checkInDate} onChange={handleCheckInDateChange}>
            <View className="date-item">
              <Text className="date-number">
                {checkInDateObj.month}月{checkInDateObj.day}日
              </Text>
              <Text className="date-week">{checkInDateObj.weekday}</Text>
            </View>
          </Picker>

          <View className="date-divider">
            <Text className="nights-text">共{searchParams.nights}晚</Text>
          </View>

          <Picker mode="date" value={searchParams.checkOutDate} onChange={handleCheckOutDateChange}>
            <View className="date-item">
              <Text className="date-number">
                {checkOutDateObj.month}月{checkOutDateObj.day}日
              </Text>
              <Text className="date-week">{checkOutDateObj.weekday}</Text>
            </View>
          </Picker>
        </View>

        {/* 入住人数/房间数 */}
        <View className="guest-room-row" onClick={() => setShowGuestRoomPicker(true)}>
          <Text className="guest-room-text">
            {searchParams.rooms}间{searchParams.guests}人，星级不限，不限入住人数，通宵订"今天夜"
          </Text>
        </View>

        {/* 快捷标签 */}
        <View className="quick-tags">
          {quickTags.map((tag, index) => (
            <View key={index} className="tag-item">
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
        <View className="picker-mask" onClick={() => setShowDestinationPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">选择目的地</Text>
              <View onClick={() => setShowDestinationPicker(false)}>
                <AtIcon value='close' size='24' color='#999' />
              </View>
            </View>
            <View className="destination-list">
              {destinationList.map((destination, index) => (
                <View
                  key={index}
                  className="destination-item"
                  onClick={() => handleDestinationSelect(destination)}
                >
                  <Text>{destination}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

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
              <View className="picker-row-item">
                <Text className="picker-label">入住人数</Text>
                <View className="counter">
                  <Button
                    className="counter-btn"
                    onClick={decreaseGuests}
                    disabled={searchParams.guests <= 1}
                  >
                    -
                  </Button>
                  <Text className="counter-value">{searchParams.guests}</Text>
                  <Button
                    className="counter-btn"
                    onClick={increaseGuests}
                    disabled={searchParams.guests >= 8}
                  >
                    +
                  </Button>
                </View>
              </View>
              <View className="picker-row-item">
                <Text className="picker-label">房间数量</Text>
                <View className="counter">
                  <Button
                    className="counter-btn"
                    onClick={decreaseRooms}
                    disabled={searchParams.rooms <= 1}
                  >
                    -
                  </Button>
                  <Text className="counter-value">{searchParams.rooms}</Text>
                  <Button
                    className="counter-btn"
                    onClick={increaseRooms}
                    disabled={searchParams.rooms >= 5}
                  >
                    +
                  </Button>
                </View>
              </View>
              <View className="picker-row-item">
                <Text className="picker-label">入住天数</Text>
                <Text className="counter-value">{searchParams.nights} 晚</Text>
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
