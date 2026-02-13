//数据库配置

const mysql = require('mysql2/promise')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: '123456',
    database: 'yisu-mysql',
    waitForConnections: true,
    connectionLimit: 10,
    connectionLimit: 10,
})

module.exports = pool