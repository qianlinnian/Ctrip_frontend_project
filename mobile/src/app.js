
import { useLaunch } from '@tarojs/taro'

import './app.scss'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')

    // 打印当前环境配置
    console.log('=== 当前环境配置 ===')
    console.log('环境:', process.env.NODE_ENV)
    console.log('API地址:', process.env.TARO_APP_API_URL)
    console.log('AppID:', process.env.TARO_APP_ID)
    console.log('调试模式:', process.env.TARO_APP_DEBUG)
    console.log('==================')
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
