// routes/review.routes.js
import express from 'express'
import {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  seedSampleReviews
} from '~/controllers/admin/admin.review.controller'

const router = express.Router()

router.get('/', getAllReviews)
router.patch('/:id/status', updateReviewStatus)
router.delete('/:id', deleteReview)
router.post('/seed', seedSampleReviews)

export default router
