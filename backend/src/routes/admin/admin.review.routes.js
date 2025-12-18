import express from 'express'
import {
  getAllReviewsAdmin,
  updateReviewStatus
} from '~/controllers/admin/admin.review.controller.js'

import { protect, admin } from '~/middlewares/auth.middleware'

const router = express.Router()

router.get('/', protect, admin, getAllReviewsAdmin)
router.patch('/:id/status', protect, admin, updateReviewStatus)

export default router
