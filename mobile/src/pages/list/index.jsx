import { View, Text, ScrollView, Button, Input } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import CalendarPicker from '../../components/CalendarPicker'
import PriceRangeSlider from '../../components/PriceRangeSlider'
import { searchHotels } from '../../services/hotel'
import './index.scss'

// filter-bar 的四个 tab，key 与 API sortBy 参数对应
const FILTER_TABS = [
  { key: null,           label: '综合排序', sub: null },
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
      { key: 'distance_asc',  label: '距市中心由近到远' },
      { key: 'distance_desc', label: '距市中心由远到近' },
    ]
  },
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

export default function HotelList() {
  const [params, setParams] = useState({})
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortKey, setSortKey] = useState(null)
  const [openTab, setOpenTab] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 编辑面板状态
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [draft, setDraft] = useState({})

  // 从路由参数初始化，然后请求 API
  useEffect(() => {
    const p = Taro.getCurrentInstance()?.router?.params || {}
    const initParams = {
      destination: decodeURIComponent(p.destination || '上海'),
      checkInDate: p.checkInDate || '',
      checkOutDate: p.checkOutDate || '',
      nights: Number(p.nights) || 1,
      guests: Number(p.guests) || 2,
      rooms: Number(p.rooms) || 1,
      starLevel: Number(p.starLevel) || 0,
      priceMin: Number(p.priceMin) || -1,
      priceMax: Number(p.priceMax) || -1,
    }
    setParams(initParams)
    fetchHotels(initParams)
  }, [])

  const fetchHotels = async (p) => {
    setLoading(true)
    try {
      const res = await searchHotels(p)
      // API 返回 { hotels: [], total, page, pageSize }
      setHotels(Array.isArray(res) ? res : (res.hotels || res.data || []))
    } catch (e) {
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  // 本地仅做关键词过滤（排序已由 API 处理）
  const sorted = hotels.filter(h =>
    !searchKeyword.trim() || h.name.includes(searchKeyword.trim())
  )


  const goBack = () => Taro.navigateBack()

  // 打开编辑面板：把当前 params 复制到草稿
  const openEditPanel = () => {
    setDraft({ ...params })
    setShowEditPanel(true)
  }

  // 确认：草稿写回 params，重新请求 API
  const confirmEdit = () => {
    const newParams = { ...draft }
    setParams(newParams)
    setShowEditPanel(false)
    fetchHotels(newParams)
  }

  // 草稿中的计数器操作
  const incGuests = () => { if (draft.guests < 8) setDraft(d => ({ ...d, guests: d.guests + 1 })) }
  const decGuests = () => { if (draft.guests > 1) setDraft(d => ({ ...d, guests: d.guests - 1 })) }
  const incRooms  = () => { if (draft.rooms < 5)  setDraft(d => ({ ...d, rooms: d.rooms + 1 })) }
  const decRooms  = () => { if (draft.rooms > 1)   setDraft(d => ({ ...d, rooms: d.rooms - 1 })) }

  const goDetail = (hotel) => {
    const query = [
      `id=${hotel.id}`,
      `name=${encodeURIComponent(hotel.name)}`,
      `checkInDate=${params.checkInDate}`,
      `checkOutDate=${params.checkOutDate}`,
      `nights=${params.nights}`,
      `guests=${params.guests}`,
      `rooms=${params.rooms}`
    ].join('&')
    Taro.navigateTo({ url: `/pages/detail/index?${query}` })
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
            : sortKey === tab.key  // 综合排序：sortKey=null, tab.key=null
          const isOpen = openTab === tab.key
          return (
            <View key={tab.key} className="filter-tab-wrap">
              {idx > 0 && <View className="filter-divider" />}
              <View
                className={`filter-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (!tab.sub) { setSortKey(null); setOpenTab(null); fetchHotels({ ...params, sortBy: null }) }
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
                      onClick={() => { setSortKey(s.key); setOpenTab(null); fetchHotels({ ...params, sortBy: s.key }) }}
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
        {loading && (
          <View className="loading-state">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}
        {!loading && sorted.map(hotel => (
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

        {!loading && sorted.length === 0 && (
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
