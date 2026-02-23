const pool = require('../config/database')


const getAuditQueue = async () => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE status = "pending"')
    return rows
}



const approveAudit = async (hotel_id) => {
    const [rows] = await pool.execute('UPDATE hotel SET status = "approved" WHERE hotel_id = ?', [hotel_id])
    return rows[0]
}

const rejectAudit = async (hotel_id) => {
    const [rows] = await pool.execute('UPDATE hotel SET status = "rejected" WHERE hotel_id = ?', [hotel_id])
    return rows[0]
}


module.exports = {getAuditQueue, approveAudit, rejectAudit}
