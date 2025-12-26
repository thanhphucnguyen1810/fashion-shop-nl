import express from 'express'
import { upload } from '~/middlewares/upload.middleware'
import {
  createReview,
  getProductReviews,
  deleteReview
} from '~/controllers/review.controller.js'

import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import { reviewValidation } from '~/validations/review.validation'

const router = express.Router()

router.post('/',
  protect,
  upload.array('images', 5),
  validateRequest(reviewValidation.createReview),
  createReview
)

router.get('/product/:productId',
  validateRequest(reviewValidation.productIdParam, 'params'),
  getProductReviews
)

router.delete('/:id',
  protect,
  validateRequest(reviewValidation.reviewIdParam, 'params'),
  logSecurity('DELETE_REVIEW'),
  deleteReview
)
export default router
