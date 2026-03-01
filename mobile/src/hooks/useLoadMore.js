/**
 * useLoadMore - 无限滚动加载 Hook
 * 
 * 实现原理：使用 IntersectionObserver（哨兵模式）
 * - 在列表底部放置一个"哨兵"元素
 * - 当哨兵进入视口时，触发加载更多
 * 
 * 多端适配：
 * - H5 环境：使用浏览器原生 IntersectionObserver API
 * - 小程序环境：使用 Taro.createIntersectionObserver API
 * 
 * 优势：
 * - 性能高：浏览器原生优化，按需触发
 * - 精度高：无需计算滚动位置，避免像素误差
 * - 代码简洁：逻辑清晰易维护
 */
import { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'

/**
 * @param {Object} options
 * @param {string} options.selector - 哨兵元素的 CSS 选择器（小程序环境使用）
 * @param {React.RefObject} options.ref - 哨兵元素的 ref（H5 环境使用）
 * @param {boolean} options.hasMore - 是否还有更多数据
 * @param {boolean} options.loading - 是否正在加载中
 * @param {Function} options.onLoadMore - 加载更多的回调函数
 * @param {any[]} options.deps - 额外的依赖项（可选）
 */
export function useLoadMore({
  selector = '.load-sentinel',
  ref,
  hasMore,
  loading,
  onLoadMore,
  deps = []
}) {
  // 用 ref 存储最新状态，避免闭包陷阱
  const stateRef = useRef({ loading, hasMore })

  // 同步状态到 ref
  useEffect(() => {
    stateRef.current = { loading, hasMore }
  }, [loading, hasMore])

  useEffect(() => {
    // 定义触发加载的回调
    const handleIntersect = () => {
      const { loading: isLoading, hasMore: canLoad } = stateRef.current
      if (!isLoading && canLoad) {
        console.log('[useLoadMore] 哨兵进入视口，触发加载')
        onLoadMore()
      }
    }

    // ========== H5 环境 ==========
    if (process.env.TARO_ENV === 'h5') {
      const sentinel = ref?.current
      if (!sentinel) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleIntersect()
          }
        },
        { threshold: 0.1 }
      )

      observer.observe(sentinel)
      return () => observer.disconnect()
    }

    // ========== 小程序环境 ==========
    const page = Taro.getCurrentInstance().page
    if (!page) return

    const observer = Taro.createIntersectionObserver(page)
    observer.relativeToViewport({ bottom: 50 }).observe(selector, (res) => {
      if (res.intersectionRatio > 0) {
        handleIntersect()
      }
    })

    return () => observer.disconnect()
  }, [selector, ...deps])
}

export default useLoadMore
