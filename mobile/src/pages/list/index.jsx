import { View, Text, ScrollView, Button, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import CalendarPicker from '../../components/CalendarPicker'
import PriceRangeSlider from '../../components/PriceRangeSlider'
import './index.scss'

// Mock 酒店数据（distanceKm = 距市中心距离，单位km）
const MOCK_HOTELS = [
  { id: 1, name: '上海外滩茂悦大酒店',        star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 3241, distance: '距外滩步行5分钟',       distanceKm: 0.8,  price: 1280, originalPrice: 1680, tags: ['免费早餐', '可免费取消'], color: '#1a73e8' },
  { id: 2, name: '上海迪士尼乐园酒店',         star: 5, score: 4.8, scoreLabel: '超赞', reviewCount: 5892, distance: '距迪士尼步行3分钟',      distanceKm: 38.0, price: 2180, originalPrice: 2680, tags: ['含早餐', '主题客房'],     color: '#e91e63' },
  { id: 3, name: '上海中心J酒店',              star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 1024, distance: '距陆家嘴地铁步行8分钟',  distanceKm: 4.5,  price: 3200, originalPrice: null,  tags: ['超高层景观', '米其林餐厅'], color: '#ff6f00' },
  { id: 4, name: '上海静安香格里拉大酒店',     star: 5, score: 4.7, scoreLabel: '很赞', reviewCount: 2156, distance: '距静安寺步行8分钟',      distanceKm: 3.2,  price: 880,  originalPrice: 1200, tags: ['免费早餐', '健身房'],     color: '#4caf50' },
  { id: 5, name: '上海虹桥宾馆',               star: 4, score: 4.5, scoreLabel: '很赞', reviewCount: 892,  distance: '距虹桥机场车程15分钟',  distanceKm: 18.5, price: 420,  originalPrice: 580,  tags: ['含早餐', '接机服务'],     color: '#9c27b0' },
  { id: 6, name: '汉庭酒店（上海人民广场店）', star: 3, score: 4.3, scoreLabel: '不错', reviewCount: 4320, distance: '距人民广场步行3分钟',    distanceKm: 1.2,  price: 238,  originalPrice: 320,  tags: ['地铁附近', '24小时前台'], color: '#607d8b' },
  { id: 7, name: '如家酒店（南京路步行街店）', star: 3, score: 4.2, scoreLabel: '不错', reviewCount: 2100, distance: '距南京路步行街步行1分钟', distanceKm: 1.5,  price: 198,  originalPrice: 268,  tags: ['绝佳位置', '近地铁'],     color: '#795548' },
  { id: 8, name: '亚朵酒店（上海徐汇滨江店）', star: 4, score: 4.6, scoreLabel: '很赞', reviewCount: 763,  distance: '距龙华寺步行20分钟',    distanceKm: 9.0,  price: 560,  originalPrice: 720,  tags: ['免费早餐', '健身房'],     color: '#00bcd4' },
]

// filter-bar 的四个 tab
const FILTER_TABS = [
  { key: 'default',  label: '综合排序', sub: null },
  {
    key: 'price', label: '价格', sub: [
      { key: 'price_asc',  label: '价格从低到高' },
      { key: 'price_desc', label: '价格从高到低' },
    ]
  },
  {
    key: 'score', label: '评分', sub: [
      { key: 'score_desc', label: '评分从高到低' },
      { key: 'score_asc',  label: '评分从低到高' },
    ]
  },
  {
    key: 'distance', label: '距离', sub: [
      { key: 'dist_asc',  label: '距市中心由近到远' },
      { key: 'dist_desc', label: '距市中心由远到近' },
    ]
  },
]

function sortHotels(hotels, sortKey) {
  const list = [...hotels]
  if (sortKey === 'price_asc')  return list.sort((a, b) => a.price - b.price)
  if (sortKey === 'price_desc') return list.sort((a, b) => b.price - a.price)
  if (sortKey === 'score_desc') return list.sort((a, b) => b.score - a.score)
  if (sortKey === 'score_asc')  return list.sort((a, b) => a.score - b.score)
  if (sortKey === 'dist_asc')   return list.sort((a, b) => a.distanceKm - b.distanceKm)
  if (sortKey === 'dist_desc')  return list.sort((a, b) => b.distanceKm - a.distanceKm)
  return list // default
}

function filterHotels(hotels, params) {
  return hotels.filter(h => {
    if (params.starLevel && params.starLevel > 0 && h.star !== params.starLevel) return false
    if (params.priceMin && params.priceMin !== -1 && h.price < params.priceMin) return false
    if (params.priceMax && params.priceMax !== -1 && h.price > params.priceMax) return false
    return true
  })
}

function StarRow({ count }) {
  return (
    <View className="star-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} className={`star-icon ${i < count ? 'filled' : ''}`}>★</Text>
      ))}
    </View>
  )
}

export default function HotelList() {
  const [params, setParams] = useState({})
  const [sortKey, setSortKey] = useState('default')
  const [openTab, setOpenTab] = useState(null) // 当前展开的 filter tab key
  const [searchKeyword, setSearchKeyword] = useState('')

  // 编辑面板状态
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  // 面板内的草稿，打开时从 params 复制，确认才写入
  const [draft, setDraft] = useState({})

  useEffect(() => {
    // 从路由参数获取搜索条件
    const p = Taro.getCurrentInstance()?.router?.params || {}
    setParams({
      destination: decodeURIComponent(p.destination || '上海'),
      checkInDate: p.checkInDate || '',
      checkOutDate: p.checkOutDate || '',
      nights: Number(p.nights) || 1,
      guests: Number(p.guests) || 2,
      rooms: Number(p.rooms) || 1,
      starLevel: Number(p.starLevel) || 0,
      priceMin: Number(p.priceMin) || -1,
      priceMax: Number(p.priceMax) || -1,
    })
  }, [])

  const filtered = filterHotels(MOCK_HOTELS, params).filter(h =>
    !searchKeyword.trim() || h.name.includes(searchKeyword.trim())
  )
  const sorted = sortHotels(filtered, sortKey)

  const goBack = () => Taro.navigateBack()

  // 打开编辑面板：把当前 params 复制到草稿
  const openEditPanel = () => {
    setDraft({ ...params })
    setShowEditPanel(true)
  }

  // 确认：草稿写回 params，关闭面板
  const confirmEdit = () => {
    setParams({ ...draft })
    setShowEditPanel(false)
  }

  // 草稿中的计数器操作
  const incGuests = () => { if (draft.guests < 8) setDraft(d => ({ ...d, guests: d.guests + 1 })) }
  const decGuests = () => { if (draft.guests > 1) setDraft(d => ({ ...d, guests: d.guests - 1 })) }
  const incRooms  = () => { if (draft.rooms < 5)  setDraft(d => ({ ...d, rooms: d.rooms + 1 })) }
  const decRooms  = () => { if (draft.rooms > 1)   setDraft(d => ({ ...d, rooms: d.rooms - 1 })) }

  const goDetail = (hotel) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${hotel.id}&name=${encodeURIComponent(hotel.name)}`
    })
  }

  // 日期格式化：2026-02-11 → 2月11日
  const formatDate = (str) => {
    if (!str) return ''
    const parts = str.split('-')
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
  }

  return (
    <View className="hotel-list">
      {/* 顶部搜索栏 */}
      <View className="list-header">
        <View className="header-back" onClick={goBack}>
          <AtIcon value='chevron-left' size='24' color='#333' />
        </View>
        <View className="header-info" onClick={openEditPanel}>
          <Text className="header-city">{params.destination}</Text>
          <Text className="header-detail">
            {formatDate(params.checkInDate)} - {formatDate(params.checkOutDate)} · {params.nights}晚 · {params.rooms}间
          </Text>
        </View>
        <View className="header-search-box">
          <AtIcon value='search' size='16' color='#999' />
          <Input
            className="header-search-input"
            placeholder="搜索酒店名称"
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
          />
        </View>
      </View>

      {/* 筛选排序栏 */}
      <View className="filter-bar">
        {FILTER_TABS.map((tab, idx) => {
          const isActive = tab.sub
            ? tab.sub.some(s => s.key === sortKey)
            : sortKey === tab.key
          const isOpen = openTab === tab.key
          return (
            <View key={tab.key} className="filter-tab-wrap">
              {idx > 0 && <View className="filter-divider" />}
              <View
                className={`filter-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (!tab.sub) { setSortKey('default'); setOpenTab(null) }
                  else setOpenTab(isOpen ? null : tab.key)
                }}
              >
                <Text className="filter-text">{tab.label}</Text>
                {tab.sub && (
                  <AtIcon
                    value={isOpen ? 'chevron-up' : 'chevron-down'}
                    size='14'
                    color={isActive ? '#0086F6' : '#666'}
                  />
                )}
              </View>
              {/* 子菜单下拉 */}
              {tab.sub && isOpen && (
                <View className="sub-menu">
                  {tab.sub.map(s => (
                    <View
                      key={s.key}
                      className={`sub-option ${sortKey === s.key ? 'active' : ''}`}
                      onClick={() => { setSortKey(s.key); setOpenTab(null) }}
                    >
                      <Text className="sub-option-text">{s.label}</Text>
                      {sortKey === s.key && <AtIcon value='check' size='16' color='#0086F6' />}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        })}
      </View>

      {/* 点遮罩关闭子菜单 */}
      {openTab && (
        <View className="submenu-mask" onClick={() => setOpenTab(null)} />
      )}

      {/* ── 编辑搜索条件面板 ── */}
      {showEditPanel && (
        <View className="edit-mask" onClick={() => setShowEditPanel(false)}>
          <View className="edit-panel" onClick={e => e.stopPropagation()}>
            <View className="edit-panel-header">
              <Text className="edit-panel-title">修改搜索条件</Text>
              <View onClick={() => setShowEditPanel(false)}>
                <AtIcon value='close' size='24' color='#999' />
              </View>
            </View>

            {/* 日期 */}
            <View className="edit-row" onClick={() => setShowCalendar(true)}>
              <Text className="edit-label">入离日期</Text>
              <View className="edit-value-row">
                <Text className="edit-value">
                  {formatDate(draft.checkInDate)} - {formatDate(draft.checkOutDate)}
                </Text>
                <Text className="edit-nights">共{draft.nights}晚</Text>
                <AtIcon value='chevron-right' size='16' color='#ccc' />
              </View>
            </View>

            {/* 人数 */}
            <View className="edit-row">
              <Text className="edit-label">入住人数</Text>
              <View className="edit-counter">
                <Button className="counter-btn" onClick={decGuests} disabled={draft.guests <= 1}>-</Button>
                <Text className="counter-val">{draft.guests}</Text>
                <Button className="counter-btn" onClick={incGuests} disabled={draft.guests >= 8}>+</Button>
              </View>
            </View>

            {/* 房间 */}
            <View className="edit-row">
              <Text className="edit-label">房间数量</Text>
              <View className="edit-counter">
                <Button className="counter-btn" onClick={decRooms} disabled={draft.rooms <= 1}>-</Button>
                <Text className="counter-val">{draft.rooms}</Text>
                <Button className="counter-btn" onClick={incRooms} disabled={draft.rooms >= 5}>+</Button>
              </View>
            </View>

            {/* 星级 */}
            <View className="edit-section">
              <Text className="edit-label">酒店星级</Text>
              <View className="edit-chips">
                {[{ label: '不限', value: 0 }, { label: '2星', value: 2 }, { label: '3星', value: 3 }, { label: '4星', value: 4 }, { label: '5星', value: 5 }].map(item => (
                  <View
                    key={item.value}
                    className={`edit-chip ${draft.starLevel === item.value ? 'active' : ''}`}
                    onClick={() => setDraft(d => ({ ...d, starLevel: item.value }))}
                  >
                    <Text className="edit-chip-text">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 价格区间 */}
            <View className="edit-section">
              <Text className="edit-label">价格区间</Text>
              <PriceRangeSlider
                min={0}
                max={2000}
                step={50}
                valueMin={draft.priceMin === -1 ? 0 : draft.priceMin}
                valueMax={draft.priceMax === -1 ? 2000 : draft.priceMax}
                onChange={(mn, mx) => setDraft(d => ({ ...d, priceMin: mn, priceMax: mx }))}
              />
            </View>

            <Button className="edit-confirm-btn" onClick={confirmEdit}>确认</Button>
          </View>
        </View>
      )}

      {/* 日历（挂在面板外层，避免被 stopPropagation 拦截） */}
      <CalendarPicker
        visible={showCalendar}
        checkInDate={draft.checkInDate}
        checkOutDate={draft.checkOutDate}
        onConfirm={(checkIn, checkOut, nights) => {
          setDraft(d => ({ ...d, checkInDate: checkIn, checkOutDate: checkOut, nights }))
          setShowCalendar(false)
        }}
        onClose={() => setShowCalendar(false)}
      />

      {/* 酒店列表 */}
      <ScrollView className="hotel-scroll" scrollY>
        {sorted.map(hotel => (
          <View key={hotel.id} className="hotel-card" onClick={() => goDetail(hotel)}>
            {/* 酒店图片色块 */}
            <View className="hotel-image" style={{ backgroundColor: hotel.color }} />

            {/* 酒店信息 */}
            <View className="hotel-info">
              <View className="hotel-name-row">
                <Text className="hotel-name">{hotel.name}</Text>
              </View>

              <View className="hotel-meta-row">
                <StarRow count={hotel.star} />
                <View className="hotel-score">
                  <Text className="score-value">{hotel.score}</Text>
                  <Text className="score-label">{hotel.scoreLabel}</Text>
                  <Text className="score-count">{hotel.reviewCount}条</Text>
                </View>
              </View>

              <Text className="hotel-address" numberOfLines={1}>{hotel.distance}</Text>

              <View className="hotel-tags">
                {hotel.tags.slice(0, 2).map((tag, i) => (
                  <Text key={i} className="hotel-tag">{tag}</Text>
                ))}
              </View>

              <View className="hotel-price-row">
                <View className="price-block">
                  {hotel.originalPrice && (
                    <Text className="original-price">¥{hotel.originalPrice}</Text>
                  )}
                  <Text className="current-price">¥{hotel.price}</Text>
                  <Text className="price-unit">/晚</Text>
                </View>
                <View className="book-btn">
                  <Text className="book-btn-text">立即预订</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {sorted.length === 0 && (
          <View className="empty-state">
            <Text className="empty-text">暂无符合条件的酒店</Text>
            <Text className="empty-sub">试试调整筛选条件</Text>
          </View>
        )}

        <View className="list-footer">
          <Text className="list-footer-text">— 已显示全部结果 —</Text>
        </View>
      </ScrollView>
    </View>
  )
}
