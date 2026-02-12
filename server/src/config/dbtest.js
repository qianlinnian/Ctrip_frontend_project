const mysql = require('mysql2/promise')


const pool = mysql.createPool({
    host: 'localhost',
    port:3306,
    user: 'root',
    password: '123456',
    database: 'yisu-mysql',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


const test = async() => {
    try {
        const conn = await pool.getConnection() 
        console.log(conn)
    } catch (error) {
        console.log(error)
    }
}

test()