const auditController = require('../controllers/auditController')
const express = require('express')
const router = express.Router()



//获取审核队列
router.get('/get-audit-queue', auditController.fetchAuditQueue)

//审核处理
router.post('handle-audit', auditController.handleAudit)



module.exports = router