import { View, Text } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import './index.scss'

let _uid = 0

export default function PriceRangeSlider({ min = 0, max = 2000, step = 100, valueMin, valueMax, onChange }) {
  const id = useRef(`prs${++_uid}`).current
  const innerMax = max + step  // 超出一格，最右端表示"以上"

  const toLocal = (v, fallback) => (v != null && v !== -1) ? v : fallback

  const [localMin, setLocalMin] = useState(() => toLocal(valueMin, min))
  const [localMax, setLocalMax] = useState(() => toLocal(valueMax, innerMax))

  const minRef = useRef(toLocal(valueMin, min))
  const maxRef = useRef(toLocal(valueMax, innerMax))
  const dragging = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const v = toLocal(valueMin, min)
    minRef.current = v; setLocalMin(v)
  }, [valueMin])

  useEffect(() => {
    const v = toLocal(valueMax, innerMax)
    maxRef.current = v; setLocalMax(v)
  }, [valueMax])

  const emitChange = () => {
    const mn = minRef.current
    const mx = maxRef.current
    if (mn === min && mx >= innerMax) { onChangeRef.current(-1, -1); return }
    onChangeRef.current(mn, mx >= innerMax ? -1 : mx)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // 在 wrapper 上注册，{ passive: false } 才能 preventDefault 阻止父容器滚动
      const wrapper = document.getElementById(`${id}-wrapper`)
      const trackEl = document.getElementById(`${id}-track`)
      if (!wrapper || !trackEl) return

      const onStart = (e) => {
        e.preventDefault()
        const rect = trackEl.getBoundingClientRect()
        const tx = e.touches[0].clientX
        // 哪个把手离触摸点近就拖哪个
        const minPx = rect.left + ((minRef.current - min) / (innerMax - min)) * rect.width
        const maxPx = rect.left + ((maxRef.current - min) / (innerMax - min)) * rect.width
        dragging.current = Math.abs(tx - minPx) <= Math.abs(tx - maxPx) ? 'min' : 'max'

        const onMove = (ev) => {
          ev.preventDefault()
          const r = trackEl.getBoundingClientRect()
          const ratio = Math.max(0, Math.min(1, (ev.touches[0].clientX - r.left) / r.width))
          const val = Math.round(ratio * (innerMax - min) / step) * step + min
          if (dragging.current === 'min') {
            const v = Math.max(min, Math.min(val, maxRef.current - step))
            minRef.current = v; setLocalMin(v)
          } else {
            const v = Math.min(innerMax, Math.max(val, minRef.current + step))
            maxRef.current = v; setLocalMax(v)
          }
        }
        const onEnd = () => {
          emitChange()
          dragging.current = null
          document.removeEventListener('touchmove', onMove)
          document.removeEventListener('touchend', onEnd)
        }
        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('touchend', onEnd)
      }

      wrapper.addEventListener('touchstart', onStart, { passive: false })
      return () => wrapper.removeEventListener('touchstart', onStart)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const isUnlimited = localMin === min && localMax >= innerMax
  const valueLabel = isUnlimited
    ? '价格不限'
    : localMax >= innerMax
      ? `¥${localMin} 以上`
      : `¥${localMin} - ¥${localMax}`

  const minPct = ((localMin - min) / (innerMax - min)) * 100
  const maxPct = ((localMax - min) / (innerMax - min)) * 100

  return (
    <View className="price-slider">
      <View className="slider-value-row">
        <Text className="slider-value-text">{valueLabel}</Text>
      </View>

      <View id={`${id}-wrapper`} className="slider-track-wrapper">
        <View id={`${id}-track`} className="slider-track" />
        <View
          className="slider-range"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <View
          className="slider-handle slider-handle-left"
          style={{ left: `${minPct}%` }}
        />
        <View
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
