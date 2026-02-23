const {getAuditQueue} = require('../models/auditModule');



exports.fetchAuditQueue = async (req, res) => {
    const auditQueue = await getAuditQueue();

    if(auditQueue.length > 0) {
        return res.status(200).json(auditQueue)
    }
    else{
        return res.status(200).json({message: 'No audit queue'})
    }
}
