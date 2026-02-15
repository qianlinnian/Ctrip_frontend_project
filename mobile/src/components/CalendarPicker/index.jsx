import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import './index.scss'

// 星期标题
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

// 展示未来 12 个月
const MONTH_COUNT = 12

/**
 * 获取某月的日历网格数据
 * @returns {Array<Array<number|null>>} 每行 7 格，null 为空白
 */
function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const grid = []
  let day = 1
  for (let row = 0; row < 6; row++) {
    const week = []
    for (let col = 0; col < 7; col++) {
      const cell = row * 7 + col
      if (cell < firstDay || day > daysInMonth) {
        week.push(null)
      } else {
        week.push(day++)
      }
    }
    if (week.every(d => d === null)) break
    grid.push(week)
  }
  return grid
}

function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 判断当前是否是凌晨时段（0:00-6:00）
function isEarlyMorning() {
  const hour = new Date().getHours()
  return hour >= 0 && hour < 6
}

// 获取昨天的日期字符串
function getYesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return toDateStr(d)
}

function parseDateStr(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return { year: y, month: m, day: d }
}

function compareDateStr(a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/**
 * 生成从今天所在月开始、共 MONTH_COUNT 个月的列表
 * @returns {Array<{year, month, grid}>}
 */
function buildMonthList(todayYear, todayMonth) {
  const list = []
  for (let i = 0; i < MONTH_COUNT; i++) {
    const totalMonth = todayMonth - 1 + i
    const year = todayYear + Math.floor(totalMonth / 12)
    const month = (totalMonth % 12) + 1
    list.push({ year, month, grid: buildMonthGrid(year, month) })
  }
  return list
}

/**
 * CalendarPicker - 仿携程多月滚动日历区间选择器
 *
 * Props:
 *   visible {boolean}
 *   checkInDate {string}   'YYYY-MM-DD'
 *   checkOutDate {string}  'YYYY-MM-DD'
 *   onConfirm(checkIn, checkOut, nights)
 *   onClose()
 */
export default function CalendarPicker({ visible, checkInDate, checkOutDate, onConfirm, onClose }) {
  const today = toDateStr(new Date())
  const todayParsed = parseDateStr(today)
  const yesterday = getYesterdayStr()
  const earlyMorning = isEarlyMorning()  // 是否凌晨时段（0:00-6:00）

  const [tempCheckIn, setTempCheckIn] = useState(checkInDate || '')
  const [tempCheckOut, setTempCheckOut] = useState(checkOutDate || '')
  // 记录是否选择了深夜入住（初始化时根据传入的日期判断）
  const [isEarlyCheckIn, setIsEarlyCheckIn] = useState(() => {
    // 如果是凌晨时段且传入的入住日期是昨天，则标记为深夜入住
    return earlyMorning && checkInDate === yesterday
  })

  // 每次打开日历时，同步外部传入的日期状态
  useEffect(() => {
    if (visible) {
      setTempCheckIn(checkInDate || '')
      setTempCheckOut(checkOutDate || '')
      // 判断是否是深夜入住
      setIsEarlyCheckIn(earlyMorning && checkInDate === yesterday)
    }
  }, [visible, checkInDate, checkOutDate, earlyMorning, yesterday])

  // 所有月份数据（静态，只算一次）
  const monthList = useMemo(
    () => buildMonthList(todayParsed.year, todayParsed.month),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const nights = useMemo(() => {
    if (!tempCheckIn || !tempCheckOut) return 0
    return Math.round((new Date(tempCheckOut) - new Date(tempCheckIn)) / (1000 * 60 * 60 * 24))
  }, [tempCheckIn, tempCheckOut])

  const handleDayClick = (dateStr) => {
    // 凌晨时段允许选择昨天作为入住日期（凌晨入住）
    const minDate = earlyMorning ? yesterday : today
    if (compareDateStr(dateStr, minDate) < 0) return
    
    if (!tempCheckIn || (tempCheckIn && tempCheckOut)) {
      setTempCheckIn(dateStr)
      setTempCheckOut('')
      // 如果是凌晨时段且选择了昨天，标记为凌晨入住
      setIsEarlyCheckIn(earlyMorning && dateStr === yesterday)
    } else {
      if (compareDateStr(dateStr, tempCheckIn) <= 0) {
        setTempCheckIn(dateStr)
        setTempCheckOut('')
        setIsEarlyCheckIn(earlyMorning && dateStr === yesterday)
      } else {
        setTempCheckOut(dateStr)
      }
    }
  }

  const handleConfirm = () => {
    if (!tempCheckIn || !tempCheckOut) return
    onConfirm(tempCheckIn, tempCheckOut, nights)
  }

  const getDayState = (dateStr) => {
    // 凌晨时段允许选择昨天
    const minDate = earlyMorning ? yesterday : today
    if (compareDateStr(dateStr, minDate) < 0) return 'past'
    if (dateStr === tempCheckIn) return 'check-in'
    if (dateStr === tempCheckOut) return 'check-out'
    if (tempCheckIn && tempCheckOut &&
        compareDateStr(dateStr, tempCheckIn) > 0 &&
        compareDateStr(dateStr, tempCheckOut) < 0) return 'range'
    // 凌晨时段的昨天日期特殊标识
    if (earlyMorning && dateStr === yesterday) return 'early-morning'
    return 'normal'
  }

  if (!visible) return null

  const checkInParsed = parseDateStr(tempCheckIn)
  const checkOutParsed = parseDateStr(tempCheckOut)
  const checkInLabel = checkInParsed 
    ? `${checkInParsed.month}月${checkInParsed.day}日${isEarlyCheckIn ? '(深夜)' : ''}` 
    : '入住'
  const checkOutLabel = checkOutParsed ? `${checkOutParsed.month}月${checkOutParsed.day}日` : '离店'

  return (
    <View className="calendar-mask" onClick={onClose}>
      <View className="calendar-panel" onClick={(e) => e.stopPropagation()}>

        {/* 顶部摘要 */}
        <View className="calendar-header">
          <View className="calendar-summary">
            <View className={`summary-date ${tempCheckIn ? 'selected' : ''}`}>
              <Text className="summary-label">入住</Text>
              <Text className="summary-value">{checkInLabel}</Text>
            </View>
            <View className="summary-nights">
              {nights > 0
                ? <Text className="summary-nights-text">共{nights}晚</Text>
                : <Text className="summary-nights-arrow">→</Text>
              }
            </View>
            <View className={`summary-date ${tempCheckOut ? 'selected' : ''}`}>
              <Text className="summary-label">离店</Text>
              <Text className="summary-value">{checkOutLabel}</Text>
            </View>
          </View>
          <View className="calendar-close" onClick={onClose}>
            <Text className="calendar-close-text">✕</Text>
          </View>
        </View>

        {/* 固定星期标题行 */}
        <View className="week-header">
          {WEEK_DAYS.map((d, i) => (
            <View key={i} className={`week-cell ${i === 0 || i === 6 ? 'weekend' : ''}`}>
              <Text className="week-text">{d}</Text>
            </View>
          ))}
        </View>

        {/* 多月份可滚动区域 */}
        <ScrollView className="calendar-scroll" scrollY>
          {monthList.map(({ year, month, grid }) => (
            <View key={`${year}-${month}`} className="month-block">
              {/* 月份标题 */}
              <View className="month-title">
                <Text className="month-title-text">{year}年{month}月</Text>
              </View>

              {/* 日期网格 */}
              {grid.map((week, ri) => (
                <View key={ri} className="calendar-row">
                  {week.map((day, ci) => {
                    if (day === null) {
                      return <View key={ci} className="day-cell empty" />
                    }
                    const ds = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const state = getDayState(ds)
                    const isWeekend = ci === 0 || ci === 6
                    const isToday = ds === today
                    const isYesterday = ds === yesterday
                    const isRangeStart = state === 'check-in' && !!tempCheckOut
                    const isRangeEnd = state === 'check-out'
                    const showEarlyMorningLabel = earlyMorning && isYesterday && state !== 'check-in'

                    return (
                      <View
                        key={ci}
                        className={[
                          'day-cell',
                          state,
                          isWeekend && (state === 'normal' || state === 'early-morning') ? 'weekend-day' : '',
                          isRangeStart ? 'range-start' : '',
                          isRangeEnd ? 'range-end' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => handleDayClick(ds)}
                      >
                        <View className="day-inner">
                          <Text className="day-number">{day}</Text>
                          {isToday && (state === 'normal' || state === 'early-morning') && (
                            <Text className="day-sub-label today-label">今</Text>
                          )}
                          {showEarlyMorningLabel && (
                            <Text className="day-sub-label early-label">深夜入住</Text>
                          )}
                          {state === 'check-in' && (
                            <Text className="day-sub-label">{isEarlyCheckIn ? '深夜入住' : '入住'}</Text>
                          )}
                          {state === 'check-out' && (
                            <Text className="day-sub-label">离店</Text>
                          )}
                        </View>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* 底部确认 */}
        <View className="calendar-footer">
          {!tempCheckIn && <Text className="footer-hint">请选择入住日期</Text>}
          {tempCheckIn && !tempCheckOut && <Text className="footer-hint">请选择离店日期</Text>}
          {tempCheckIn && tempCheckOut && <Text className="footer-hint">已选 {nights} 晚</Text>}
          <View
            className={`confirm-btn ${tempCheckIn && tempCheckOut ? 'active' : 'inactive'}`}
            onClick={handleConfirm}
          >
            <Text className="confirm-btn-text">确定</Text>
          </View>
        </View>

      </View>
    </View>
  )
}
