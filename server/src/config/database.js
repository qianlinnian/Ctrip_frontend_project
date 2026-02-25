//数据库配置

const mysql = require('mysql2/promise')


const pool = mysql.createPool({
    host: '47.113.112.175',
    user: 'root',
    port: 3306,
    password: 'yisu2026',
    database: 'yisu',
    waitForConnections: true,
    connectionLimit: 10,
    connectionLimit: 10,
})

module.exports = pool