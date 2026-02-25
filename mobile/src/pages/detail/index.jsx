import { View, Text, ScrollView, Swiper, SwiperItem, Button, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { getHotelDetail } from '../../services/hotel'
import CalendarPicker from '../../components/CalendarPicker'
import './index.scss'

function StarRow({ count }) {
  return (
    <View className="star-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} className={`star-icon ${i < count ? 'filled' : ''}`}>★</Text>
      ))}
    </View>
  )
}

const TABS = ['概况', '设施', '政策']

// 获取 banner 图片列表，确保至少有默认图片且每张不同
function getBannerImages(images, hotelId = 1) {
  if (images && images.length > 0) {
    // 检查图片是否都相同（可能是相同 lock 值）
    const uniqueImages = [...new Set(images)]
    if (uniqueImages.length >= 2) {
      return uniqueImages.slice(0, 5)
    }
  }
  // 使用 hotelId 生成不同的默认图片
  const base = hotelId * 10
  return [
    `https://loremflickr.com/800/400/hotel,room?lock=${base + 1}`,
    `https://loremflickr.com/800/400/hotel,lobby?lock=${base + 2}`,
    `https://loremflickr.com/800/400/hotel,bedroom?lock=${base + 3}`,
    `https://loremflickr.com/800/400/hotel,pool?lock=${base + 4}`
  ]
}

// 获取房间图片，确保有默认值
function getRoomImage(room, index = 0) {
  if (room.image) return room.image
  if (room.images && room.images.length > 0) {
    return typeof room.images === 'string' ? room.images.split(',')[0] : room.images[0]
  }
  // 默认房间图片
  return `https://loremflickr.com/400/300/hotel,room?lock=${100 + index}`
}

// 日期格式化辅助函数
function formatDateDisplay(dateStr) {
  if (!dateStr) return { month: '', day: '', weekday: '' }
  const d = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return {
    month: d.getMonth() + 1,
    day: d.getDate(),
    weekday: weekdays[d.getDay()]
  }
}

// 计算晚数
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1
  const d1 = new Date(checkIn)
  const d2 = new Date(checkOut)
  return Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)))
}

export default function HotelDetail() {
  const [hotel, setHotel] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [refreshing, setRefreshing] = useState(false)  // 下拉刷新状态
  
  // 从 URL 获取入住信息
  const [bookingInfo, setBookingInfo] = useState({
    checkInDate: '',
    checkOutDate: '',
    nights: 1,
    guests: 2,
    rooms: 1
  })
  
  // 弹窗控制
  const [showCalendar, setShowCalendar] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  // 获取酒店数据的函数（可重用于刷新）
  const fetchHotelData = async (hotelId) => {
    try {
      const raw = await getHotelDetail(hotelId)
      // 字段适配：将 API 返回字段映射到页面使用的字段名
      const d = {
        ...raw,
        star:        raw.starLevel  ?? raw.star ?? 0,
        score:       raw.rating     ?? raw.score ?? 0,
        scoreLabel:  raw.ratingDesc ?? raw.scoreLabel ?? '',
        reviewCount: raw.reviewCount ?? 0,
        address:     raw.address    ?? raw.location ?? '',
        distance:    raw.distance   ?? '',
        tags:        raw.tags       ?? [],
        facilities:  raw.facilities ?? [],
        rooms:       raw.rooms      ?? [],
        phone:       raw.phone      ?? '',
        price:       raw.price      ?? raw.minPrice ?? 0,
        originalPrice: raw.originalPrice ?? null,
        color:       raw.color      ?? '#1a73e8',
      }
      setHotel(d)
      return true
    } catch (e) {
      console.error('获取酒店数据失败', e)
      return false
    }
  }

  // 下拉刷新处理
  const onRefresh = async () => {
    if (refreshing) return
    setRefreshing(true)
    const p = Taro.getCurrentInstance()?.router?.params || {}
    const id = Number(p.id)
    const success = await fetchHotelData(id)
    setRefreshing(false)
    if (success) {
      Taro.showToast({ title: '已刷新', icon: 'success', duration: 1500 })
    } else {
      Taro.showToast({ title: '刷新失败', icon: 'none' })
    }
  }

  useEffect(() => {
    const p = Taro.getCurrentInstance()?.router?.params || {}
    const id = Number(p.id)
    
    // 解析入住信息：优先从 URL 读取，没有则从本地存储读取
    let checkIn = p.checkInDate || ''
    let checkOut = p.checkOutDate || ''
    let guests = p.guests ? Number(p.guests) : 0
    let rooms = p.rooms ? Number(p.rooms) : 0
    let nights = p.nights ? Number(p.nights) : 0

    // 如果 URL 没有完整信息，从本地存储读取
    if (!checkIn || !checkOut) {
      try {
        const saved = Taro.getStorageSync('bookingInfo')
        if (saved) {
          checkIn = checkIn || saved.checkInDate || ''
          checkOut = checkOut || saved.checkOutDate || ''
          guests = guests || saved.guests || 2
          rooms = rooms || saved.rooms || 1
          nights = nights || saved.nights || calcNights(checkIn, checkOut)
        }
      } catch (e) {
        console.log('读取本地存储失败', e)
      }
    }

    setBookingInfo({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights: nights || calcNights(checkIn, checkOut),
      guests: guests || 2,
      rooms: rooms || 1
    })
    
    fetchHotelData(id).catch(() => {
      Taro.showToast({ title: '加载失败', icon: 'none' })
    })
  }, [])

  // 日历确认回调
  const handleCalendarConfirm = (checkIn, checkOut, nights) => {
    setBookingInfo(prev => ({
      ...prev,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights
    }))
    setShowCalendar(false)
  }

  // 人数/房间操作
  const incGuests = () => {
    if (bookingInfo.guests < 8) {
      setBookingInfo(prev => ({ ...prev, guests: prev.guests + 1 }))
    }
  }
  const decGuests = () => {
    if (bookingInfo.guests > 1) {
      setBookingInfo(prev => ({ ...prev, guests: prev.guests - 1 }))
    }
  }
  const incRooms = () => {
    if (bookingInfo.rooms < 5) {
      setBookingInfo(prev => ({ ...prev, rooms: prev.rooms + 1 }))
    }
  }
  const decRooms = () => {
    if (bookingInfo.rooms > 1) {
      setBookingInfo(prev => ({ ...prev, rooms: prev.rooms - 1 }))
    }
  }

  const goBack = () => Taro.navigateTo({ url: '/pages/list/index' })

  if (!hotel) return <View className="detail-loading"><Text>加载中…</Text></View>

  return (
    <View className="hotel-detail">
      {/* 顶部轮播图区 */}
      <View className="detail-banner">
        <Swiper
          className="banner-swiper"
          circular
          autoplay
          interval={4000}
          onChange={e => setBannerIndex(e.detail.current)}
        >
          {getBannerImages(hotel.images, hotel.id).map((img, i) => (
            <SwiperItem key={i}>
              <Image 
                className="banner-image" 
                src={img} 
                mode="aspectFill"
              />
            </SwiperItem>
          ))}
        </Swiper>

        {/* 顶部酒店名称 */}
        <View className="banner-hotel-name">
          <Text className="hotel-name-text">{hotel.hotel_name || hotel.name}</Text>
          <View className="hotel-star-badge">
            <Text className="star-text">{hotel.star || 4}星级</Text>
          </View>
        </View>

        {/* 返回 / 刷新 / 分享 / 收藏 浮在轮播图上 */}
        <View className="banner-actions">
          <View className="banner-btn banner-btn-back" onClick={goBack}>
            <AtIcon value='chevron-left' size='26' color='#fff' />
          </View>
          <View className="banner-right-actions">
            <View className="banner-btn" onClick={onRefresh}>
              <AtIcon value='reload' size='24' color='#fff' />
            </View>
            <View className="banner-btn">
              <AtIcon value='share' size='24' color='#fff' />
            </View>
            <View className="banner-btn">
              <AtIcon value='heart' size='24' color='#fff' />
            </View>
          </View>
        </View>

        {/* 右下角：当前张数 */}
        <View className="banner-photo-count">
          <AtIcon value='image' size='14' color='#fff' />
          <Text className="photo-count-text">{bannerIndex + 1} / {getBannerImages(hotel.images, hotel.id).length}</Text>
        </View>
      </View>

      {/* 主要内容滚动区 - 支持下拉刷新 */}
      <ScrollView 
        className="detail-scroll" 
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        refresherBackground="#f5f5f5"
      >
        {/* 酒店基础信息 */}
        <View className="hotel-base-info">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-meta">
            <StarRow count={hotel.star} />
            <View className="score-badge">
              <Text className="score-num">{hotel.score}</Text>
              <Text className="score-label-text">{hotel.scoreLabel}</Text>
            </View>
          </View>
          <View className="hotel-location-row">
            <AtIcon value='map-pin' size='14' color='#999' />
            <Text className="hotel-address">{hotel.address}</Text>
          </View>
          {hotel.distance ? (
            <View className="hotel-distance-row">
              <AtIcon value='map' size='14' color='#0086F6' />
              <Text className="hotel-distance">{hotel.distance}</Text>
            </View>
          ) : null}
          <View className="hotel-tags-row">
            {hotel.tags.map((tag, i) => (
              <Text key={i} className="hotel-tag">{tag}</Text>
            ))}
          </View>
        </View>

        {/* 人间夜 Banner */}
        {bookingInfo.checkInDate && (
          <View className="booking-info-banner">
            <View className="booking-date-section" onClick={() => setShowCalendar(true)}>
              <View className="date-item">
                <Text className="date-label">入住</Text>
                <Text className="date-value">
                  {formatDateDisplay(bookingInfo.checkInDate).month}月{formatDateDisplay(bookingInfo.checkInDate).day}日
                </Text>
                <Text className="date-week">{formatDateDisplay(bookingInfo.checkInDate).weekday}</Text>
              </View>
              <View className="date-divider">
                <Text className="nights-text">共{bookingInfo.nights}晚</Text>
              </View>
              <View className="date-item">
                <Text className="date-label">离店</Text>
                <Text className="date-value">
                  {formatDateDisplay(bookingInfo.checkOutDate).month}月{formatDateDisplay(bookingInfo.checkOutDate).day}日
                </Text>
                <Text className="date-week">{formatDateDisplay(bookingInfo.checkOutDate).weekday}</Text>
              </View>
              <View className="date-edit-icon">
                <AtIcon value="chevron-right" size="18" color="#999" />
              </View>
            </View>
            <View className="booking-guest-section" onClick={() => setShowGuestPicker(true)}>
              <Text className="guest-info">{bookingInfo.rooms}间 · {bookingInfo.guests}人</Text>
              <AtIcon value="chevron-right" size="18" color="#999" />
            </View>
          </View>
        )}

        {/* Tabs */}
        <View className="detail-tabs">
          {TABS.map((tab, i) => (
            <View
              key={tab}
              className={`detail-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <Text className="detail-tab-text">{tab}</Text>
            </View>
          ))}
        </View>

        {/* Tab 内容：概况 */}
        {activeTab === 0 && (
          <View className="tab-content">
            <View className="section">
              <Text className="section-title">酒店介绍</Text>
              <Text className="section-body">
                {hotel.description}
                </Text>
            </View>

            {/* 热门设施速览 */}
            <View className="section">
              <Text className="section-title">热门设施</Text>
              <View className="facility-grid">
                {hotel.facilities.slice(0, 6).map((f, i) => (
                  <View key={i} className="facility-chip">
                    <Text className="facility-chip-text">{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Tab 内容：设施 */}
        {activeTab === 1 && (
          <View className="tab-content">
            <View className="section">
              <Text className="section-title">酒店设施</Text>
              <View className="facility-list">
                {hotel.facilities.map((f, i) => (
                  <View key={i} className="facility-item">
                    <AtIcon value='check-circle' size='16' color='#0086F6' />
                    <Text className="facility-item-text">{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Tab 内容：政策 */}
        {activeTab === 2 && (
          <View className="tab-content">
            <View className="section">
              <Text className="section-title">入住须知</Text>
              <View className="policy-list">
                {[
                  { label: '入住时间', value: '14:00之后' },
                  { label: '退房时间', value: '12:00之前' },
                  { label: '前台服务', value: '24小时' },
                  { label: '吸烟政策', value: '全面禁烟' },
                ].map((p, i) => (
                  <View key={i} className="policy-item">
                    <Text className="policy-label">{p.label}</Text>
                    <Text className="policy-value">{p.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="section">
              <Text className="section-title">联系方式</Text>
              <View className="policy-item">
                <Text className="policy-label">电话</Text>
                <Text className="policy-value policy-phone">{hotel.phone}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 客房选择（始终显示在 tab 内容下方） */}
        <View className="rooms-section">
          <Text className="section-title">选择房型</Text>
          {hotel.rooms.map((room, idx) => (
            <View key={room.id} className="room-card">
              <Image 
                className="room-image" 
                src={getRoomImage(room, idx)} 
                mode="aspectFill"
              />
              <View className="room-info">
                <Text className="room-name">{room.name}</Text>
                <View className="room-meta-row">
                  <Text className="room-meta">{room.area}㎡</Text>
                  <Text className="room-meta-sep">·</Text>
                  <Text className="room-meta">{room.floor}</Text>
                  <Text className="room-meta-sep">·</Text>
                  <Text className="room-meta">{room.bed}</Text>
                </View>
                <View className="room-tags-row">
                  <Text className={`room-tag ${room.breakfast.includes('含') ? 'green' : 'gray'}`}>{room.breakfast}</Text>
                  <Text className={`room-tag ${room.cancel.includes('可免费') ? 'green' : 'red'}`}>{room.cancel}</Text>
                </View>
                <View className="room-price-row">
                  <View className="room-price-block">
                    {room.originalPrice && (
                      <Text className="room-original-price">¥{room.originalPrice}</Text>
                    )}
                    <Text className="room-current-price">¥{room.price}</Text>
                    <Text className="room-price-unit">/晚</Text>
                  </View>
                  <View className="room-book-btn">
                    <Text className="room-book-text">订</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 底部间距，避免被底栏遮挡 */}
        <View className="detail-bottom-space" />
      </ScrollView>

      {/* 底部固定预订栏 */}
      <View className="detail-footer">
        <View className="footer-price-block">
          <Text className="footer-price-from">起</Text>
          <Text className="footer-price">¥{hotel.price}</Text>
          <Text className="footer-price-unit">/晚</Text>
        </View>
        <View className="footer-book-btn">
          <Text className="footer-book-text">立即预订</Text>
        </View>
      </View>

      {/* 日历选择器 */}
      <CalendarPicker
        visible={showCalendar}
        checkInDate={bookingInfo.checkInDate}
        checkOutDate={bookingInfo.checkOutDate}
        onConfirm={handleCalendarConfirm}
        onClose={() => setShowCalendar(false)}
      />

      {/* 人数房间选择器 */}
      {showGuestPicker && (
        <View className="picker-mask" onClick={() => setShowGuestPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-title">入住信息</Text>
              <View onClick={() => setShowGuestPicker(false)}>
                <AtIcon value="close" size="24" color="#999" />
              </View>
            </View>
            <View className="guest-room-picker">
              {/* 人数 */}
              <View className="picker-row-item">
                <Text className="picker-label">入住人数</Text>
                <View className="counter">
                  <Button className="counter-btn" onClick={decGuests} disabled={bookingInfo.guests <= 1}>-</Button>
                  <Text className="counter-value">{bookingInfo.guests}</Text>
                  <Button className="counter-btn" onClick={incGuests} disabled={bookingInfo.guests >= 8}>+</Button>
                </View>
              </View>
              {/* 房间 */}
              <View className="picker-row-item">
                <Text className="picker-label">房间数量</Text>
                <View className="counter">
                  <Button className="counter-btn" onClick={decRooms} disabled={bookingInfo.rooms <= 1}>-</Button>
                  <Text className="counter-value">{bookingInfo.rooms}</Text>
                  <Button className="counter-btn" onClick={incRooms} disabled={bookingInfo.rooms >= 5}>+</Button>
                </View>
              </View>
              <Button className="confirm-btn" onClick={() => setShowGuestPicker(false)}>
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
