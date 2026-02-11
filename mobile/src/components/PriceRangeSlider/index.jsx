import { View, Text } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import './index.scss'

// 生成唯一 id，挂到 DOM 上用原生事件
let _uid = 0
const uid = () => `prs${++_uid}`

export default function PriceRangeSlider({ min = 0, max = 2000, step = 100, valueMin, valueMax, onChange }) {
  const id = useRef(uid()).current
  // 内部轨道多一格，最右端（max+step）表示"以上"
  const innerMax = max + step

  const initMin = (valueMin != null && valueMin !== -1) ? valueMin : min
  const initMax = (valueMax != null && valueMax !== -1) ? valueMax : innerMax

  const [localMin, setLocalMin] = useState(initMin)
  const [localMax, setLocalMax] = useState(initMax)

  const localMinRef = useRef(initMin)
  const localMaxRef = useRef(initMax)
  const dragging = useRef(null)
  const trackRectRef = useRef(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const v = (valueMin != null && valueMin !== -1) ? valueMin : min
    localMinRef.current = v; setLocalMin(v)
  }, [valueMin])

  useEffect(() => {
    const v = (valueMax != null && valueMax !== -1) ? valueMax : innerMax
    localMaxRef.current = v; setLocalMax(v)
  }, [valueMax])

  const rectToVal = (clientX) => {
    const rect = trackRectRef.current
    if (!rect || rect.width === 0) return min
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(ratio * (innerMax - min) / step) * step + min
  }

  const emitChange = (mn, mx) => {
    // 两端都在极值 → 不限
    if (mn === min && mx >= innerMax) { onChangeRef.current(-1, -1); return }
    // 右端到最右（innerMax = max+step）→ 无上限，传 -1
    onChangeRef.current(mn, mx >= innerMax ? -1 : mx)
  }

  useEffect(() => {
    // 用 setTimeout 确保 picker 弹层 DOM 已渲染
    const timer = setTimeout(() => {
      const minEl  = document.getElementById(`${id}-min`)
      const maxEl  = document.getElementById(`${id}-max`)
      const trackEl = document.getElementById(`${id}-track`)
      if (!minEl || !maxEl || !trackEl) {
        console.warn('[PriceRangeSlider] 未找到 DOM 节点', id)
        return
      }

      const onMinStart = (e) => {
        e.preventDefault(); e.stopPropagation()
        trackRectRef.current = trackEl.getBoundingClientRect()
        dragging.current = 'min'
      }
      const onMaxStart = (e) => {
        e.preventDefault(); e.stopPropagation()
        trackRectRef.current = trackEl.getBoundingClientRect()
        dragging.current = 'max'
      }
      const onMove = (e) => {
        if (!dragging.current) return
        e.preventDefault()
        const val = rectToVal(e.touches[0].clientX)
        if (dragging.current === 'min') {
          const v = Math.max(min, Math.min(val, localMaxRef.current - step))
          localMinRef.current = v; setLocalMin(v)
        } else {
          const v = Math.min(innerMax, Math.max(val, localMinRef.current + step))
          localMaxRef.current = v; setLocalMax(v)
        }
      }
      const onEnd = () => {
        if (!dragging.current) return
        emitChange(localMinRef.current, localMaxRef.current)
        dragging.current = null
      }

      minEl.addEventListener('touchstart',  onMinStart, { passive: false })
      maxEl.addEventListener('touchstart',  onMaxStart, { passive: false })
      document.addEventListener('touchmove', onMove,    { passive: false })
      document.addEventListener('touchend',  onEnd)

      // 清理
      ;(window._prsCleanup = window._prsCleanup || {})[id] = () => {
        minEl.removeEventListener('touchstart',  onMinStart)
        maxEl.removeEventListener('touchstart',  onMaxStart)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend',  onEnd)
      }
    }, 150)

    return () => {
      clearTimeout(timer)
      window._prsCleanup?.[id]?.()
    }
  }, [])

  const isUnlimited = localMin === min && localMax >= innerMax
  const isAbove = !isUnlimited && localMax >= innerMax
  const valueLabel = isUnlimited
    ? '价格不限'
    : isAbove
      ? `¥${localMin} 以上`
      : `¥${localMin} - ¥${localMax}`

  const minPct = ((localMin - min) / (innerMax - min)) * 100
  const maxPct = ((localMax - min) / (innerMax - min)) * 100

  return (
    <View className="price-slider">
      <View className="slider-value-row">
        <Text className="slider-value-text">{valueLabel}</Text>
      </View>

      <View className="slider-track-wrapper">
        <View id={`${id}-track`} className="slider-track" />
        <View
          className="slider-range"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <View
          id={`${id}-min`}
          className="slider-handle slider-handle-left"
          style={{ left: `${minPct}%` }}
        />
        <View
          id={`${id}-max`}
          className="slider-handle slider-handle-right"
          style={{ left: `${maxPct}%` }}
        />
      </View>

      <View className="slider-ticks">
        <Text className="tick-label">0</Text>
        <Text className="tick-label">1000</Text>
        <Text className="tick-label">2000+</Text>
      </View>
    </View>
  )
}
