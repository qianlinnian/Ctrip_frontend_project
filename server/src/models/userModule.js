const pool = require('../config/database')


//在数据库中查找user


/*  
pool.execute => [rows, fields]
rows => 查询结果
fields => 字段信息
*/ 
const findUserByUsername = async (username) => {
    console.log("findUserByUsername:", username)
    try {
        const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username])
        return rows[0]
    } catch (error) {
        console.log("error", error)
    }
}

const findUserByPhone = async (phone) => {
    console.log("findUserByPhone:", phone)
    const [rows] = await pool.execute('SELECT * FROM user WHERE phone = ?', [phone])
    return rows[0]
}

const findUserByEmail = async (email) => {
    
    console.log("findUserByEmail:", email)
    const [rows] = await pool.execute('SELECT * FROM user WHERE email = ?', [email])
    return rows[0]
}


const createUser = async (username, name, phone, email, password) => {
    try {
        console.log("createUser:", username, name, phone, email, password)
        const [rows] = await pool.execute('INSERT INTO user (username, name, phone, email, password) VALUES (?, ?, ?, ?, ?)', [username, name, phone, email, password])
        return rows[0]
    } catch (error) {
        console.log("error", error)
    }
    
}
module.exports = { findUserByUsername, createUser, findUserByPhone, findUserByEmail }
