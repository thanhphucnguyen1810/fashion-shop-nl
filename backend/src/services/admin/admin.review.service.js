import Review from '~/models/review.model.js'

// ================= GET ALL REVIEWS (ADMIN) =================
export const getAllReviewsAdmin = async () => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('productId', 'name thumbnail images')
    .sort({ createdAt: -1 })

  return reviews
}

// ================= UPDATE REVIEW STATUS =================
export const updateReviewStatus = async (reviewId, status) => {
  const review = await Review.findById(reviewId)

  if (!review) return null

  review.status = status
  await review.save()

  return review
}
