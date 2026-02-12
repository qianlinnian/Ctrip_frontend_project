import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import './index.scss'

// Mock 酒店数据
const MOCK_HOTELS = [
  { id: 1, name: '上海外滩茂悦大酒店',        star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 3241, distance: '距外滩步行5分钟',       price: 1280, originalPrice: 1680, tags: ['免费早餐', '可免费取消'], color: '#1a73e8' },
  { id: 2, name: '上海迪士尼乐园酒店',         star: 5, score: 4.8, scoreLabel: '超赞', reviewCount: 5892, distance: '距迪士尼步行3分钟',      price: 2180, originalPrice: 2680, tags: ['含早餐', '主题客房'],     color: '#e91e63' },
  { id: 3, name: '上海中心J酒店',              star: 5, score: 4.9, scoreLabel: '超赞', reviewCount: 1024, distance: '距陆家嘴地铁步行8分钟',  price: 3200, originalPrice: null,  tags: ['超高层景观', '米其林餐厅'], color: '#ff6f00' },
  { id: 4, name: '上海静安香格里拉大酒店',     star: 5, score: 4.7, scoreLabel: '很赞', reviewCount: 2156, distance: '距静安寺步行8分钟',      price: 880,  originalPrice: 1200, tags: ['免费早餐', '健身房'],     color: '#4caf50' },
  { id: 5, name: '上海虹桥宾馆',               star: 4, score: 4.5, scoreLabel: '很赞', reviewCount: 892,  distance: '距虹桥机场车程15分钟',  price: 420,  originalPrice: 580,  tags: ['含早餐', '接机服务'],     color: '#9c27b0' },
  { id: 6, name: '汉庭酒店（上海人民广场店）', star: 3, score: 4.3, scoreLabel: '不错', reviewCount: 4320, distance: '距人民广场步行3分钟',    price: 238,  originalPrice: 320,  tags: ['地铁附近', '24小时前台'], color: '#607d8b' },
  { id: 7, name: '如家酒店（南京路步行街店）', star: 3, score: 4.2, scoreLabel: '不错', reviewCount: 2100, distance: '距南京路步行街步行1分钟', price: 198,  originalPrice: 268,  tags: ['绝佳位置', '近地铁'],     color: '#795548' },
  { id: 8, name: '亚朵酒店（上海徐汇滨江店）', star: 4, score: 4.6, scoreLabel: '很赞', reviewCount: 763,  distance: '距龙华寺步行20分钟',    price: 560,  originalPrice: 720,  tags: ['免费早餐', '健身房'],     color: '#00bcd4' },
]

const SORT_OPTIONS = [
  { key: 'default', label: '综合排序' },
  { key: 'price_asc', label: '价格最低' },
  { key: 'score', label: '评分最高' },
  { key: 'distance', label: '距离最近' },
]

function sortHotels(hotels, sortKey) {
  const list = [...hotels]
  if (sortKey === 'price_asc') return list.sort((a, b) => a.price - b.price)
  if (sortKey === 'score') return list.sort((a, b) => b.score - a.score)
  return list
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
  const [showSortMenu, setShowSortMenu] = useState(false)

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

  const filtered = filterHotels(MOCK_HOTELS, params)
  const sorted = sortHotels(filtered, sortKey)

  const currentSort = SORT_OPTIONS.find(o => o.key === sortKey)

  const goBack = () => Taro.navigateBack()

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
        <View className="header-info">
          <Text className="header-city">{params.destination}</Text>
          <Text className="header-detail">
            {formatDate(params.checkInDate)} - {formatDate(params.checkOutDate)} · {params.nights}晚 · {params.rooms}间
          </Text>
        </View>
        <View className="header-search">
          <AtIcon value='search' size='20' color='#666' />
        </View>
      </View>

      {/* 筛选排序栏 */}
      <View className="filter-bar">
        <View
          className={`filter-item ${sortKey !== 'default' ? 'active' : ''}`}
          onClick={() => setShowSortMenu(!showSortMenu)}
        >
          <Text className="filter-text">{currentSort.label}</Text>
          <AtIcon value='chevron-down' size='14' color={sortKey !== 'default' ? '#0086F6' : '#666'} />
        </View>
        <View className="filter-divider" />
        <View className={`filter-item ${params.priceMin !== -1 || params.priceMax !== -1 ? 'active' : ''}`}>
          <Text className="filter-text">价格</Text>
          <AtIcon value='chevron-down' size='14' color={params.priceMin !== -1 || params.priceMax !== -1 ? '#0086F6' : '#666'} />
        </View>
        <View className="filter-divider" />
        <View className={`filter-item ${params.starLevel > 0 ? 'active' : ''}`}>
          <Text className="filter-text">星级</Text>
          <AtIcon value='chevron-down' size='14' color={params.starLevel > 0 ? '#0086F6' : '#666'} />
        </View>
        <View className="filter-divider" />
        <View className="filter-item">
          <AtIcon value='equalizer' size='14' color='#666' />
          <Text className="filter-text">筛选</Text>
        </View>
      </View>

      {/* 排序下拉菜单 */}
      {showSortMenu && (
        <View className="sort-mask" onClick={() => setShowSortMenu(false)}>
          <View className="sort-menu" onClick={e => e.stopPropagation()}>
            {SORT_OPTIONS.map(opt => (
              <View
                key={opt.key}
                className={`sort-option ${sortKey === opt.key ? 'active' : ''}`}
                onClick={() => { setSortKey(opt.key); setShowSortMenu(false) }}
              >
                <Text className="sort-option-text">{opt.label}</Text>
                {sortKey === opt.key && <AtIcon value='check' size='16' color='#0086F6' />}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 结果数量 */}
      <View className="result-count">
        <Text className="result-count-text">共找到 {sorted.length} 家酒店</Text>
      </View>

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
