const pool = require('../config/database')


//在数据库中查找user


/*  
pool.execute => [rows, fields]
rows => 查询结果
fields => 字段信息
*/ 

//根据用户名查找用户,确定用户角色
const findUserByUsername = async (username) => {
    console.log("findUserByUsername:", username)
    try {
        const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username])
        
        return rows[0]
    } catch (error) {
        console.log("error", error.message)
    }
}


const findMerchantByUsername = async (username) => {
    console.log("findMerchantByUsername:", username)
    const [rows] = await pool.execute('SELECT * FROM merchant WHERE username = ?', [username])
    return rows[0]
}

const findAdminByUsername = async (username) => {
    console.log("findAdminByUsername:", username)
    const [rows] = await pool.execute('SELECT * FROM admin WHERE username = ?', [username])
    return rows[0]
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


const createUser = async (username,phone, email, password, role) => {
    try {
        console.log("createUser:", username, phone, email, password, role)
        if(role === 'user') {
            const [rows] = await pool.execute('INSERT INTO user (username, phone, email, password) VALUES (?, ?, ?, ?)', [username, phone, email, password])
            return rows[0]
        }
        else if(role === 'merchant') {
            const [rows] = await pool.execute('INSERT INTO merchant (username, phone, email, password) VALUES (?, ?, ?, ?)', [username,phone, email, password])
            return rows[0]
        }
        else if(role === 'admin') {
            const [rows] = await pool.execute('INSERT INTO admin (username, phone, email, password) VALUES (?, ?, ?, ?)', [username,phone, email, password])
            return rows[0]
        }
 
    } catch (error) {
        console.log("error", error)
    }
    
}
module.exports = { findUserByUsername, createUser, findUserByPhone, findUserByEmail, findMerchantByUsername, findAdminByUsername }
