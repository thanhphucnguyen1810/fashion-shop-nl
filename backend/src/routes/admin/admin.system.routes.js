import express from 'express'
import { getSecurityLogs } from '~/controllers/admin/security.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = express.Router()

// Route này sẽ khớp với /api/admin/system/security-logs
router.get('/security-logs', protect, getSecurityLogs)

export default router
