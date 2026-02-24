//程序入口
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRouters')
const hotelRoutes = require('./routes/hotelRouters')
const auditRoutes = require('./routes/auditRouters')


 

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/hotel', hotelRoutes)
app.use('/api/audit', auditRoutes)

const PORT = 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
