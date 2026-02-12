import { View, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import './index.scss'

// 与 list 页共用的 mock 数据（按 id 查找）
const MOCK_HOTELS = [
  { id: 1, name: '上海外滩茂悦大酒店',        star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 3241, distance: '距外滩步行5分钟',       price: 1280, originalPrice: 1680, tags: ['免费早餐', '可免费取消'], color: '#1a73e8',
    address: '上海市黄浦区中山东二路111号', phone: '021-23218888',
    facilities: ['免费WiFi', '停车场', '健身房', '游泳池', '餐厅', '商务中心', '洗衣服务', '24小时前台'],
    rooms: [
      { id: 'r1', name: '豪华大床房', area: 42, floor: '18-32层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 1280, originalPrice: 1680 },
      { id: 'r2', name: '外滩景观大床房', area: 48, floor: '25-40层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 1680, originalPrice: 2100 },
      { id: 'r3', name: '豪华双床房', area: 42, floor: '18-32层', bed: '2张大床', breakfast: '不含早餐', cancel: '不可取消', price: 1180, originalPrice: null },
    ]
  },
  { id: 2, name: '上海迪士尼乐园酒店',         star: 5, score: 4.8, scoreLabel: '超赞', reviewCount: 5892, distance: '距迪士尼步行3分钟',      price: 2180, originalPrice: 2680, tags: ['含早餐', '主题客房'],     color: '#e91e63',
    address: '上海市浦东新区川沙新镇黄赵路1号', phone: '021-20998888',
    facilities: ['免费WiFi', '停车场', '游泳池', '儿童乐园', '餐厅', '主题商店', '24小时前台', '行李寄存'],
    rooms: [
      { id: 'r1', name: '标准主题客房', area: 38, floor: '2-5层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 2180, originalPrice: 2680 },
      { id: 'r2', name: '梦幻套房', area: 65, floor: '3-5层', bed: '1张特大床+沙发床', breakfast: '含早餐', cancel: '可免费取消', price: 3580, originalPrice: 4200 },
    ]
  },
  { id: 3, name: '上海中心J酒店',              star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 1024, distance: '距陆家嘴地铁步行8分钟',  price: 3200, originalPrice: null,  tags: ['超高层景观', '米其林餐厅'], color: '#ff6f00',
    address: '上海市陆家嘴银城中路501号上海中心大厦', phone: '021-20158888',
    facilities: ['免费WiFi', '代客泊车', '游泳池', '健身房', '米其林餐厅', 'SPA', '商务中心', '管家服务'],
    rooms: [
      { id: 'r1', name: '高层景观大床房', area: 55, floor: '84-98层', bed: '1张特大床', breakfast: '不含早餐', cancel: '可免费取消', price: 3200, originalPrice: null },
      { id: 'r2', name: '景观套房', area: 120, floor: '90-110层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 6800, originalPrice: 8000 },
    ]
  },
  { id: 4, name: '上海静安香格里拉大酒店',     star: 5, score: 4.7, scoreLabel: '很赞', reviewCount: 2156, distance: '距静安寺步行8分钟',      price: 880,  originalPrice: 1200, tags: ['免费早餐', '健身房'],     color: '#4caf50',
    address: '上海市静安区威海路1218号', phone: '021-22036888',
    facilities: ['免费WiFi', '停车场', '游泳池', '健身房', '餐厅', 'SPA', '商务中心', '儿童俱乐部'],
    rooms: [
      { id: 'r1', name: '豪华大床房', area: 40, floor: '6-20层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 880, originalPrice: 1200 },
      { id: 'r2', name: '豪华双床房', area: 40, floor: '6-20层', bed: '2张大床', breakfast: '含早餐', cancel: '不可取消', price: 820, originalPrice: null },
    ]
  },
  { id: 5, name: '上海虹桥宾馆',               star: 4, score: 4.5, scoreLabel: '很赞', reviewCount: 892,  distance: '距虹桥机场车程15分钟',  price: 420,  originalPrice: 580,  tags: ['含早餐', '接机服务'],     color: '#9c27b0',
    address: '上海市长宁区虹桥路2419号', phone: '021-62688888',
    facilities: ['免费WiFi', '停车场', '餐厅', '接机服务', '商务中心', '24小时前台'],
    rooms: [
      { id: 'r1', name: '标准大床房', area: 32, floor: '3-8层', bed: '1张大床', breakfast: '含早餐', cancel: '可免费取消', price: 420, originalPrice: 580 },
      { id: 'r2', name: '标准双床房', area: 32, floor: '3-8层', bed: '2张单床', breakfast: '含早餐', cancel: '不可取消', price: 380, originalPrice: null },
    ]
  },
  { id: 6, name: '汉庭酒店（上海人民广场店）', star: 3, score: 4.3, scoreLabel: '不错', reviewCount: 4320, distance: '距人民广场步行3分钟',    price: 238,  originalPrice: 320,  tags: ['地铁附近', '24小时前台'], color: '#607d8b',
    address: '上海市黄浦区西藏中路268号', phone: '021-63117777',
    facilities: ['免费WiFi', '24小时前台', '行李寄存', '叫车服务'],
    rooms: [
      { id: 'r1', name: '智尚大床房', area: 20, floor: '3-10层', bed: '1张大床', breakfast: '不含早餐', cancel: '可免费取消', price: 238, originalPrice: 320 },
      { id: 'r2', name: '智尚双床房', area: 22, floor: '3-10层', bed: '2张单床', breakfast: '不含早餐', cancel: '不可取消', price: 218, originalPrice: null },
    ]
  },
  { id: 7, name: '如家酒店（南京路步行街店）', star: 3, score: 4.2, scoreLabel: '不错', reviewCount: 2100, distance: '距南京路步行街步行1分钟', price: 198,  originalPrice: 268,  tags: ['绝佳位置', '近地铁'],     color: '#795548',
    address: '上海市黄浦区南京东路388号', phone: '021-63226666',
    facilities: ['免费WiFi', '24小时前台', '行李寄存', '自动售货机'],
    rooms: [
      { id: 'r1', name: '温馨大床房', area: 18, floor: '2-8层', bed: '1张大床', breakfast: '不含早餐', cancel: '可免费取消', price: 198, originalPrice: 268 },
      { id: 'r2', name: '温馨双床房', area: 20, floor: '2-8层', bed: '2张单床', breakfast: '不含早餐', cancel: '不可取消', price: 188, originalPrice: null },
    ]
  },
  { id: 8, name: '亚朵酒店（上海徐汇滨江店）', star: 4, score: 4.6, scoreLabel: '很赞', reviewCount: 763,  distance: '距龙华寺步行20分钟',    price: 560,  originalPrice: 720,  tags: ['免费早餐', '健身房'],     color: '#00bcd4',
    address: '上海市徐汇区龙腾大道2066号', phone: '021-54668888',
    facilities: ['免费WiFi', '停车场', '健身房', '餐厅', '图书馆', '24小时前台', '行李寄存'],
    rooms: [
      { id: 'r1', name: '轻奢大床房', area: 28, floor: '4-12层', bed: '1张特大床', breakfast: '含早餐', cancel: '可免费取消', price: 560, originalPrice: 720 },
      { id: 'r2', name: '轻奢双床房', area: 30, floor: '4-12层', bed: '2张大床', breakfast: '不含早餐', cancel: '不可取消', price: 480, originalPrice: null },
    ]
  },
]

const MOCK_REVIEWS = [
  { id: 1, user: '旅行达人小王', avatar: 'W', date: '2026-01-15', score: 5, content: '酒店位置绝佳，服务非常周到，早餐种类丰富，下次还会再来！', tags: ['位置好', '服务佳', '早餐棒'] },
  { id: 2, user: '商务出行李总', avatar: 'L', date: '2026-01-08', score: 5, content: '出差必选，房间宽敞整洁，床很舒适，隔音效果好，WiFi网速也很快。', tags: ['房间大', '隔音好', '网速快'] },
  { id: 3, user: '蜜月旅行张女士', avatar: 'Z', date: '2025-12-28', score: 4, content: '整体不错，景观很好，就是停车稍微麻烦一点，其他都很满意。', tags: ['景观好', '环境佳'] },
]

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

export default function HotelDetail() {
  const [hotel, setHotel] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    const p = Taro.getCurrentInstance()?.router?.params || {}
    const id = Number(p.id)
    const found = MOCK_HOTELS.find(h => h.id === id)
    if (found) {
      setHotel(found)
    } else {
      // fallback：用 name 造一个最小对象
      setHotel({ name: decodeURIComponent(p.name || '酒店详情'), star: 5, score: 4.8, scoreLabel: '超赞', reviewCount: 0, color: '#1a73e8', address: '', phone: '', facilities: [], rooms: [], tags: [], price: 0, originalPrice: null, distance: '' })
    }
  }, [])

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
            {MOCK_REVIEWS.map(r => (
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
    </View>
  )
}
