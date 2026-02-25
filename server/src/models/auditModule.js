const pool = require('../config/database')




//审核表audit


//获取审核队列(audit_status = 1)
const getAuditQueue = async () => {
    const [rows] = await pool.execute('SELECT * FROM hotel WHERE audit_status = 1')
    return rows
}


//审核通过(audit_status = 2)
const approveAudit = async (hotel_id) => {
    const [rows] = await pool.execute('UPDATE hotel SET audit_status = 2 WHERE hotel_id = ?', [hotel_id])
    return rows[0]
}

//审核拒绝(audit_status = 3)
const rejectAudit = async (hotel_id, audit_reason) => {
    const [rows] = await pool.execute('UPDATE hotel SET audit_status = 3, reject_reason = ? WHERE hotel_id = ?', [audit_reason, hotel_id])
    return rows[0]
}

module.exports = {getAuditQueue, approveAudit, rejectAudit}
