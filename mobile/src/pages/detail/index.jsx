import { View, Text, ScrollView, Swiper, SwiperItem, Button } from '@tarojs/components'
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

const TABS = ['概况', '设施', '评价', '政策']

// 根据主色生成多张色调略有变化的"图片"色块
function getBannerSlides(color) {
  // 在主色基础上叠加不同透明度的黑/白，模拟不同光线的照片
  return [
    color,
    color + 'dd',
    color + 'bb',
    color + '99',
  ]
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
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [bannerIndex, setBannerIndex] = useState(0)
  
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

  useEffect(() => {
    const p = Taro.getCurrentInstance()?.router?.params || {}
    const id = Number(p.id)
    
    // 解析入住信息
    const checkIn = p.checkInDate || ''
    const checkOut = p.checkOutDate || ''
    setBookingInfo({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights: p.nights ? Number(p.nights) : calcNights(checkIn, checkOut),
      guests: p.guests ? Number(p.guests) : 2,
      rooms: p.rooms ? Number(p.rooms) : 1
    })
    
    getHotelDetail(id).then(raw => {
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
      setReviews(raw.reviews || [])
    }).catch(() => {
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
          onChange={e => setBannerIndex(e.detail.current)}
        >
          {getBannerSlides(hotel.color).map((bg, i) => (
            <SwiperItem key={i}>
              <View className="banner-slide" style={{ backgroundColor: bg }} />
            </SwiperItem>
          ))}
        </Swiper>

        {/* 返回 / 分享 / 收藏 浮在轮播图上 */}
        <View className="banner-actions">
          <View className="banner-btn banner-btn-back" onClick={goBack}>
            <AtIcon value='chevron-left' size='26' color='#fff' />
          </View>
          <View className="banner-right-actions">
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
          <Text className="photo-count-text">{bannerIndex + 1} / {getBannerSlides(hotel.color).length}</Text>
        </View>
      </View>

      {/* 主要内容滚动区 */}
      <ScrollView className="detail-scroll" scrollY>
        {/* 酒店基础信息 */}
        <View className="hotel-base-info">
          <Text className="hotel-name">{hotel.name}</Text>
          <View className="hotel-meta">
            <StarRow count={hotel.star} />
            <View className="score-badge">
              <Text className="score-num">{hotel.score}</Text>
              <Text className="score-label-text">{hotel.scoreLabel}</Text>
            </View>
            <Text className="review-count">{hotel.reviewCount}条评价</Text>
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
                {hotel.name}坐落于上海市中心优越地段，{hotel.address}。酒店拥有{hotel.rooms.length > 0 ? `${hotel.rooms.length}种房型` : '多种房型'}，全部配备高速WiFi、豪华卫浴及现代化设施，是商务出行与休闲度假的理想之选。
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

        {/* Tab 内容：评价 */}
        {activeTab === 2 && (
          <View className="tab-content">
            <View className="score-overview">
              <Text className="score-big">{hotel.score}</Text>
              <View className="score-overview-right">
                <Text className="score-big-label">{hotel.scoreLabel}</Text>
                <Text className="score-big-count">共{hotel.reviewCount}条评价</Text>
              </View>
            </View>
            {reviews.map(r => (
              <View key={r.id} className="review-card">
                <View className="review-header">
                  <View className="review-avatar">
                    <Text className="avatar-text">{r.avatar}</Text>
                  </View>
                  <View className="review-user-info">
                    <Text className="review-user">{r.user}</Text>
                    <Text className="review-date">{r.date}</Text>
                  </View>
                  <View className="review-score-stars">
                    {Array.from({ length: r.score }).map((_, i) => (
                      <Text key={i} className="review-star">★</Text>
                    ))}
                  </View>
                </View>
                <Text className="review-content">{r.content}</Text>
                <View className="review-tags">
                  {r.tags.map((t, i) => (
                    <Text key={i} className="review-tag">{t}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab 内容：政策 */}
        {activeTab === 3 && (
          <View className="tab-content">
            <View className="section">
              <Text className="section-title">入住须知</Text>
              <View className="policy-list">
                {[
                  { label: '入住时间', value: '14:00之后' },
                  { label: '退房时间', value: '12:00之前' },
                  { label: '前台服务', value: '24小时' },
                  { label: '宠物政策', value: '不允许携带宠物' },
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
          {hotel.rooms.map(room => (
            <View key={room.id} className="room-card">
              <View className="room-color-block" style={{ backgroundColor: hotel.color }} />
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
