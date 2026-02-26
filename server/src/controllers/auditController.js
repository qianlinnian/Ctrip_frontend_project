const {getAuditQueue, approveAudit, rejectAudit} = require('../models/auditModule');


//获取审核队列
exports.fetchAuditQueue = async (req, res) => {
    const auditQueue = await getAuditQueue();

    if(auditQueue.length > 0) {
        return res.status(200).json(auditQueue)
    }
    else{
        return res.status(200).json({message: 'No audit queue'})
    }
}


//审核处理 
exports.handleAudit = async (req, res) => {
    const {hotel_id, action, audit_reason} = req.body
    console.log('handleAudit received: ', req.body)
    switch(action) {
        //审核通过
        case 'approve':
            const approveResult = await approveAudit(hotel_id);
            console.log('approveResult: ', approveResult)
            return res.status(200).json({message: 'Approved successfully', approveResult})
            break

        //审核拒绝
        case 'reject':
            console.log('rejectAudit received: ', req.body)
            const rejectResult = await rejectAudit(hotel_id, audit_reason);

            return res.status(200).json({message: 'Rejected successfully', rejectResult})
            break
    }
    console.log('handleAudit completed')
}


