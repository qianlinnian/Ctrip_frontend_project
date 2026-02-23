const auditController = require('../controllers/auditController')
const express = require('express')
const router = express.Router()


//路由
router.get('/get-audit-queue', auditController.fetchAuditQueue)



module.exports = router