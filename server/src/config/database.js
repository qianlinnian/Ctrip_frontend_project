//数据库配置

const mysql = require('mysql2/promise')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '123456',
    database: 'mysql',
    waitForConnections: true,
    connectionLimit: 10,
    connectionLimit: 10,
})


module.exports = pool