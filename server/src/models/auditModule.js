const pool = require('../config/database')




//审核表audit


//获取审核队列
const getAuditQueue = async () => {
    const [rows] = await pool.execute('SELECT * FROM audit WHERE status = "pending"')
    return rows
}



const approveAudit = async (hotel_id) => {
    const [rows] = await pool.execute('UPDATE audit SET status = "approved" WHERE hotel_id = ?', [hotel_id])
    return rows[0]
}

const rejectAudit = async (hotel_id) => {
    const [rows] = await pool.execute('UPDATE audit SET status = "rejected" WHERE hotel_id = ?', [hotel_id])
    return rows[0]
}

const updateDescription = async(hotel_id, description) => {
    const [rows] = await pool.execute('UPDATE audit SET description = ? WHERE hotel_id = ?', [description, hotel_id])

    return rows[0]
}


module.exports = {getAuditQueue, approveAudit, rejectAudit, updateDescription}
