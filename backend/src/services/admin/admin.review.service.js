import Review from '~/models/review.model.js'

// ================= GET ALL REVIEWS (ADMIN) =================
export const getAllReviewsAdmin = async ({ page = 1, limit = 20 } = {}) => {
  const result = await Review.aggregate([
    { $sort: { createdAt: -1 } },
    { $facet: {
      queryReviews: [
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        } },
        { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product',
          pipeline: [{ $project: { name: 1, images: 1 } }]
        } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }
      ],
      queryTotal: [{ $count: 'total' }]
    } }
  ])

  const data = result[0]
  return {
    reviews: data.queryReviews || [],
    total: data.queryTotal[0]?.total || 0,
    page,
    pages: Math.ceil((data.queryTotal[0]?.total || 0) / limit)
  }
}

// ================= UPDATE REVIEW STATUS =================
export const updateReviewStatus = async (reviewId, status) => {
  const review = await Review.findById(reviewId)

  if (!review) return null

  review.status = status
  await review.save()

  return review
}
