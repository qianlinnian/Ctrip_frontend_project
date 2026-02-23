const {getAuditQueue, approveAudit, rejectAudit, updateDescription} = require('../models/auditModule');



exports.fetchAuditQueue = async (req, res) => {
    const auditQueue = await getAuditQueue();

    if(auditQueue.length > 0) {
        return res.status(200).json(auditQueue)
    }
    else{
        return res.status(200).json({message: 'No audit queue'})
    }
}


exports.handleAudit = async (req, res) => {
    const {hotel_id, action, description} = req.body
    switch(action) {
        case 'approve:':
            const approveResult = await approveAudit(hotel_id);
            if(approveResult) updateDescription(hotel_id, description);

            return res.status(200).json({message: 'Approved successfully'})
            break

        case 'reject:':
            const rejectResult = await rejectAudit(hotel_id);
            if(rejectResult) updateDescription(hotel_id, description);

            return res.status(200).json({message: 'Rejected successfully'})
            break
    }
}


