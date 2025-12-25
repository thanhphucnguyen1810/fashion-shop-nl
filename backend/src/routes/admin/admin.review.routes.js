import express from 'express'
import {
  getAllReviewsAdmin,
  updateReviewStatus
} from '~/controllers/admin/admin.review.controller.js'

import { protect, admin } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'


const router = express.Router()

router.get('/', protect, admin, getAllReviewsAdmin)
router.patch('/:id/status', protect, admin, logSecurity('ADMIN_UPDATE_REVIEW_STATUS'), updateReviewStatus)

export default router
