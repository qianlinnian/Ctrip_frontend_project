/**
 * 易宿酒店预订平台 - 移动端后端服务
 */
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
  next()
})

// 引入路由
const routes = require('./routes')

// 挂载 API 路由
app.use('/api', routes)

// 健康检查
app.get('/', (req, res) => {
  res.json({ 
    code: 200, 
    message: '易宿移动端后端服务运行中', 
    timestamp: new Date().toISOString()
  })
})

// API 文档
app.get('/api', (req, res) => {
  res.json({
    code: 200,
    message: '易宿移动端 API',
    endpoints: {
      hotels: {
        'GET /api/hotels/list': '获取酒店列表',
        'GET /api/hotels/recommend': '获取推荐酒店',
        'GET /api/hotels/search': '搜索酒店',
        'GET /api/hotels/:id': '获取酒店详情'
      },
      rooms: {
        'GET /api/rooms': '获取房间列表',
        'GET /api/rooms/:id': '获取房间详情'
      },
      cities: {
        'GET /api/cities': '获取城市列表',
        'GET /api/cities/hot': '获取热门城市',
        'GET /api/cities/search': '搜索城市'
      },
      bookings: {
        'POST /api/bookings': '创建预订',
        'GET /api/bookings': '获取预订列表',
        'GET /api/bookings/:id': '获取预订详情',
        'PUT /api/bookings/:id/cancel': '取消预订'
      }
    }
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: `接口不存在: ${req.method} ${req.url}` })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ code: 500, message: '服务器内部错误' })
})

// 启动服务
app.listen(PORT, () => {
  console.log('')
  console.log('='.repeat(50))
  console.log('   易宿移动端后端服务已启动')
  console.log('='.repeat(50))
  console.log(`   地址: http://localhost:${PORT}`)
  console.log(`   API:  http://localhost:${PORT}/api`)
  console.log('')
  console.log('   接口列表:')
  console.log('     GET  /api/hotels/list      - 酒店列表')
  console.log('     GET  /api/hotels/recommend - 推荐酒店')
  console.log('     GET  /api/hotels/:id       - 酒店详情')
  console.log('     GET  /api/rooms            - 房间列表')
  console.log('     GET  /api/cities/hot       - 热门城市')
  console.log('     POST /api/bookings         - 创建预订')
  console.log('='.repeat(50))
  console.log('')
})
