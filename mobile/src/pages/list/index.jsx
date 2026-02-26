import { View, Text, ScrollView, Button, Input, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import CalendarPicker from '../../components/CalendarPicker'
import PriceRangeSlider from '../../components/PriceRangeSlider'
import { searchHotels } from '../../services/hotel'
import { getAllTags } from '../../services/tag'
import './index.scss'

// filter-bar 的 tab，key 与 API sortBy 参数对应
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
      { key: 'distance_asc',  label: '由近到远' },
      { key: 'distance_desc', label: '由远到近' },
    ]
  },
  { key: 'tags', label: '筛选', sub: null, isTagFilter: true },
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

// 根据评分返回评价标签
function getScoreLabel(score) {
  const s = Number(score) || 4.5
  if (s >= 4.8) return '超赞'
  if (s >= 4.5) return '很棒'
  if (s >= 4.0) return '不错'
  if (s >= 3.5) return '还行'
  return '一般'
}

export default function HotelList() {
  const [params, setParams] = useState({})
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortKey, setSortKey] = useState(null)
  const [openTab, setOpenTab] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页状态
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const PAGE_SIZE = 10

  // ScrollView 动态高度
  const [scrollHeight, setScrollHeight] = useState(0)

  // 编辑面板状态
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [draft, setDraft] = useState({})

  // 标签筛选状态
  const [hotTags, setHotTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // 从路由参数初始化，没有则从本地存储读取，然后请求 API
  useEffect(() => {
    const p = Taro.getCurrentInstance()?.router?.params || {}
    
    // 先尝试从本地存储读取
    let saved = {}
    try {
      saved = Taro.getStorageSync('bookingInfo') || {}
    } catch (e) {
      console.log('读取本地存储失败', e)
    }

    const initParams = {
      destination: decodeURIComponent(p.destination || saved.destination || '上海'),
      checkInDate: p.checkInDate || saved.checkInDate || '',
      checkOutDate: p.checkOutDate || saved.checkOutDate || '',
      nights: Number(p.nights) || saved.nights || 1,
      guests: Number(p.guests) || saved.guests || 2,
      rooms: Number(p.rooms) || saved.rooms || 1,
      starLevel: Number(p.starLevel) || saved.starLevel || 0,
      priceMin: p.priceMin !== undefined ? Number(p.priceMin) : (saved.priceMin != null ? saved.priceMin : -1),
      priceMax: p.priceMax !== undefined ? Number(p.priceMax) : (saved.priceMax != null ? saved.priceMax : -1),
      keyword: p.keyword ? decodeURIComponent(p.keyword) : '',
      tags: p.tags ? decodeURIComponent(p.tags) : '', // 多标签筛选（逗号分隔）
    }

    // 如果有关键词参数，同步到搜索框
    if (initParams.keyword) {
      setSearchKeyword(initParams.keyword)
    }
    // 如果有标签参数，设置已选标签
    if (initParams.tags) {
      setSelectedTags(initParams.tags.split(',').filter(Boolean))
    }
    setParams(initParams)
    fetchHotels(initParams, 1, true)

    // 获取所有标签（优先读缓存）
    try {
      const cached = Taro.getStorageSync('allTags')
      if (cached && cached.length > 0) {
        setHotTags(cached)
      } else {
        getAllTags().then(tags => {
          const list = tags || []
          setHotTags(list)
          Taro.setStorageSync('allTags', list)
        }).catch(() => setHotTags([]))
      }
    } catch {
      getAllTags().then(tags => {
        setHotTags(tags || [])
      }).catch(() => setHotTags([]))
    }
  }, [])

  // 动态计算 ScrollView 高度（确保 onScrollToLower 正确触发）
  useEffect(() => {
    const calcHeight = () => {
      const sysInfo = Taro.getSystemInfoSync()
      const windowHeight = sysInfo.windowHeight
      const query = Taro.createSelectorQuery()
      query.select('.list-header').boundingClientRect()
      query.select('.filter-bar').boundingClientRect()
      query.exec((res) => {
        const headerH = (res[0] && res[0].height) || 0
        const filterH = (res[1] && res[1].height) || 0
        const h = windowHeight - headerH - filterH
        console.log('[ScrollHeight] window:', windowHeight, 'header:', headerH, 'filter:', filterH, 'scroll:', h)
        if (h > 0) {
          setScrollHeight(h)
        } else {
          // 兜底：如果查询失败，使用 windowHeight 减去估算的头部高度
          setScrollHeight(windowHeight - 180)
        }
      })
    }
    // 延迟执行，确保 DOM 渲染完成；失败则重试一次
    setTimeout(calcHeight, 300)
    setTimeout(calcHeight, 800)
  }, [])

  // 获取酒店列表（支持分页）
  const fetchHotels = async (p, pageNum = 1, isRefresh = false) => {
    if (isRefresh) {
      setLoading(true)
      setPage(1)
      setHasMore(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const res = await searchHotels({ ...p, page: pageNum, pageSize: PAGE_SIZE })
      console.log('[fetchHotels] API响应:', JSON.stringify(res).slice(0, 200), 'keys:', Object.keys(res || {}))
      // API 返回 { hotels: [], total, page, pageSize }
      const newHotels = Array.isArray(res) ? res : (res.hotels || res.data || [])
      const total = res.total || newHotels.length

      if (isRefresh) {
        setHotels(newHotels)
      } else {
        setHotels(prev => [...prev, ...newHotels])
      }

      // 判断是否还有更多数据：本页返回满 PAGE_SIZE 条且累计未超 total
      const loadedCount = isRefresh ? newHotels.length : (hotels.length + newHotels.length)
      const more = newHotels.length >= PAGE_SIZE && loadedCount < total
      console.log('[fetchHotels] pageNum:', pageNum, 'newHotels:', newHotels.length, 'total:', total, 'loadedCount:', loadedCount, 'hasMore:', more)
      setHasMore(more)
      setPage(pageNum)
    } catch (e) {
      if (isRefresh) setHotels([])
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // 上滑加载更多
  const loadMore = () => {
    console.log('[loadMore] 触发, loadingMore:', loadingMore, 'hasMore:', hasMore, 'page:', page)
    if (loadingMore || !hasMore) return
    console.log('[loadMore] 开始加载第', page + 1, '页')
    fetchHotels(params, page + 1, false)
  }

  // 搜索关键词（调用后端 API）
  // 后端会自动识别地点名称并计算距离
  const handleSearch = () => {
    const input = searchKeyword.trim()
    let newParams = { ...params, keyword: input || undefined, nearBy: undefined }
    setParams(newParams)
    fetchHotels(newParams, 1, true)
  }

  // 搜索结果直接使用 hotels（后端已过滤）
  const sorted = hotels

  // 点击标签（只更新选中状态，不立即搜索）
  const handleTagClick = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  // 确认筛选（点击确定按钮时触发搜索）
  const handleTagConfirm = () => {
    const newParams = { ...params, tag: selectedTags.join(',') }
    setParams(newParams)
    setOpenTab(null)
    fetchHotels(newParams, 1, true)
  }

  // 清除筛选
  const handleTagClear = () => {
    setSelectedTags([])
    const newParams = { ...params, tag: '' }
    setParams(newParams)
    fetchHotels(newParams, 1, true)
  }

  const goBack = () => Taro.reLaunch({ url: '/pages/home/index' })

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
    fetchHotels(newParams, 1, true)
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
          <AtIcon value='search' size='16' color='#999' onClick={handleSearch} />
          <Input
            className="header-search-input"
            placeholder="搜索"
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
            onConfirm={handleSearch}
            confirmType="search"
          />
        </View>
      </View>

      {/* 筛选排序栏 */}
      <View className="filter-bar">
        {FILTER_TABS.map((tab, idx) => {
          // 筛选 tab 的激活状态：有选中的标签
          const isTagActive = tab.isTagFilter && selectedTags.length > 0
          const isActive = tab.sub
            ? tab.sub.some(s => s.key === sortKey)
            : (tab.isTagFilter ? isTagActive : sortKey === tab.key)
          const isOpen = openTab === tab.key
          return (
            <View key={tab.key || 'default'} className="filter-tab-wrap">
              {idx > 0 && <View className="filter-divider" />}
              <View
                className={`filter-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (tab.isTagFilter) {
                    // 筛选 tab：展开/收起标签面板
                    setOpenTab(isOpen ? null : 'tags')
                  } else if (!tab.sub) {
                    setSortKey(null); setOpenTab(null); fetchHotels({ ...params, sortBy: null }, 1, true)
                  } else {
                    setOpenTab(isOpen ? null : tab.key)
                  }
                }}
              >
                <Text className="filter-text">
                  {tab.isTagFilter && selectedTags.length > 0 
                    ? `筛选(${selectedTags.length})` 
                    : tab.label}
                </Text>
                {(tab.sub || tab.isTagFilter) && (
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
                      onClick={() => { setSortKey(s.key); setOpenTab(null); fetchHotels({ ...params, sortBy: s.key }, 1, true) }}
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
      {openTab && openTab !== 'tags' && (
        <View className="submenu-mask" onClick={() => setOpenTab(null)} />
      )}

      {/* 标签筛选展开面板 */}
      {openTab === 'tags' && (
        <View className="tag-filter-panel">
          <View className="tag-filter-header">
            <Text className="tag-filter-title">选择筛选条件</Text>
            <View className="tag-filter-clear" onClick={handleTagClear}>
              <Text className="tag-filter-clear-text">清除</Text>
            </View>
          </View>
          <View className="tag-filter-content">
            {hotTags.map(tag => {
              const tagName = tag.name || tag.tag_name  // 兼容两种字段名
              return (
                <View 
                  key={tag.id || tagName} 
                  className={`tag-filter-item ${selectedTags.includes(tagName) ? 'active' : ''}`}
                  onClick={() => handleTagClick(tagName)}
                >
                  <Text className="tag-filter-text">{tagName}</Text>
                </View>
              )
            })}
          </View>
          <View className="tag-filter-footer">
            <View className="tag-filter-btn-cancel" onClick={() => setOpenTab(null)}>
              <Text>取消</Text>
            </View>
            <View className="tag-filter-btn-confirm" onClick={handleTagConfirm}>
              <Text>确定</Text>
            </View>
          </View>
        </View>
      )}
      {openTab === 'tags' && (
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
                valueMin={draft.priceMin}
                valueMax={draft.priceMax}
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
      <ScrollView
        className="hotel-scroll"
        scrollY
        enhanced
        onScrollToLower={loadMore}
        lowerThreshold={150}
        style={{ height: scrollHeight ? `${scrollHeight}px` : 'calc(100vh - 180px)' }}
      >
        {loading && (
          <View className="loading-state">
            <Text className="loading-text">加载中...</Text>
          </View>
        )}
        {!loading && sorted.map(hotel => (
          <View key={hotel.id} className="hotel-card" onClick={() => goDetail(hotel)}>
            {/* 酒店封面图片 */}
            <Image
              className="hotel-image"
              src={hotel.cover_image || hotel.coverImage || `https://loremflickr.com/400/300/hotel?lock=${hotel.id}`}
              mode="aspectFill"
              lazyLoad
            />

            {/* 酒店信息 */}
            <View className="hotel-info">
              <View className="hotel-name-row">
                <Text className="hotel-name">{hotel.name}</Text>
              </View>

              <View className="hotel-meta-row">
                <View className="hotel-star-info">
                  <Text className="star-level">{hotel.star || 3}星级</Text>
                  <StarRow count={hotel.star || 3} />
                </View>
                <View className="hotel-score">
                  <Text className="score-value">{Number(hotel.score || 4.5).toFixed(1)}</Text>
                  <Text className="score-label">{getScoreLabel(hotel.score)}</Text>
                </View>
              </View>

              {/* 位置和距离 */}
              <View className="hotel-location-row">
                <Text className="hotel-address" numberOfLines={1}>
                  {hotel.address || hotel.hotel_address || ''}
                </Text>
                {hotel.distance && hotel.distance !== '—' && (
                  <Text className="hotel-distance">距离 {hotel.distance}</Text>
                )}
              </View>

              {/* 标签 */}
              <View className="hotel-tags">
                {(hotel.tags || hotel.facilities || []).slice(0, 3).map((tag, i) => (
                  <Text key={i} className="hotel-tag">{tag}</Text>
                ))}
              </View>

              <View className="hotel-price-row">
                <View className="price-block">
                  <Text className="current-price">¥{hotel.price}</Text>
                  <Text className="price-unit">起/晚</Text>
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

        {/* 底部加载状态 */}
        {!loading && sorted.length > 0 && (
          <View className="list-footer">
            {loadingMore ? (
              <Text className="list-footer-text">加载中...</Text>
            ) : hasMore ? (
              <Text className="list-footer-text" onClick={loadMore}>点击或上滑加载更多</Text>
            ) : (
              <Text className="list-footer-text">— 已显示全部结果 —</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

