import { reviewService } from '~/services/review.service.js'

// ================= CREATE REVIEW =================
export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview({
      user: req.user,
      body: req.body,
      files: req.files
    })

    res.status(201).json({
      message: 'Đánh giá thành công!',
      review
    })
  } catch (error) {
    next(error)
  }
}

// ================= GET REVIEWS =================
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId)
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

// ================= DELETE REVIEW =================
export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview({
      reviewId: req.params.id,
      user: req.user
    })

    res.json({ message: 'Xóa review thành công' })
  } catch (error) {
    next(error)
  }
}
