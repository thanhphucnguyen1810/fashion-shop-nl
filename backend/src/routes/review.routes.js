import express from 'express'
import { upload } from '~/middlewares/upload.middleware'
import {
  createReview,
  getProductReviews,
  deleteReview
} from '~/controllers/review.controller.js'

import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()

router.post('/', protect, upload.array('images', 5), createReview)
router.get('/product/:productId', getProductReviews)
router.delete('/:id', protect, logSecurity('DELETE_REVIEW'), deleteReview)

export default router

