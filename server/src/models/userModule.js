const pool = require('../config/database')


//在数据库中查找user


/*  
pool.execute => [rows, fields]
rows => 查询结果
fields => 字段信息
*/ 
const findUserByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username])
    return rows[0]
}


const createUser = async (username, password) => {
    try {
        console.log("createUser:", username, password)
        const [rows] = await pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password])
        return rows[0]
    } catch (error) {
        console.log("error", error)
    }
    
}
module.exports = { findUserByUsername, createUser }
