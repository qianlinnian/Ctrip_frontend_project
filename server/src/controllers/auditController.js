const {getAuditQueue, approveAudit, rejectAudit} = require('../models/auditModule');


//获取审核队列
exports.fetchAuditQueue = async (req, res) => {
    try {
        const auditQueue = await getAuditQueue();
        if(auditQueue.length > 0) {
            return res.status(200).json(auditQueue)
        } else {
            return res.status(200).json({message: 'No audit queue'})
        }
    } catch (error) {
        console.error('Error fetching audit queue:', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }

    
}


//审核处理 
exports.handleAudit = async (req, res) => {
    try {
        const {hotel_id, action, audit_reason} = req.body
        console.log('handleAudit received: ', req.body)
        switch(action) {
            //审核通过
            case 'approve':
                const approveResult = await approveAudit(hotel_id);
                console.log('approveResult: ', approveResult)
                return res.status(200).json({message: 'Approved successfully', approveResult})

            //审核拒绝
            case 'reject':
                console.log('rejectAudit received: ', req.body)
                const rejectResult = await rejectAudit(hotel_id, audit_reason);

                return res.status(200).json({message: 'Rejected successfully', rejectResult})
                
            default:
                return res.status(400).json({message: 'Invalid action'})
        }
        console.log('handleAudit completed')
    } catch (error) {
        console.error('Error handling audit:', error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
   
}


