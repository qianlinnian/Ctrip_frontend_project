/**
 * 易宿酒店预订平台 - 后端服务
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

// 移动端 API 路由
const routes = require('./routes')
app.use('/api', routes)

// 管理端路由
const authRoutes = require('./routes/authRouters')
const hotelManageRoutes = require('./routes/hotelRouters')
const auditRoutes = require('./routes/auditRouters')
app.use('/api/auth', authRoutes)
app.use('/api/hotel', hotelManageRoutes)
app.use('/api/audit', auditRoutes)

// 健康检查
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '易宿后端服务运行中',
    timestamp: new Date().toISOString()
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
  console.log('   易宿后端服务已启动')
  console.log('='.repeat(50))
  console.log(`   地址: http://localhost:${PORT}`)
  console.log(`   API:  http://localhost:${PORT}/api`)
  console.log('='.repeat(50))
  console.log('')
})
