import Review from '~/models/review.model.js'
import Order from '~/models/order.model'
import cloudinary from '~/config/cloudinary.config'
import Product from '~/models/product.model'

// ================= CREATE REVIEW =================
const createReview = async ({ user, body, files }) => {
  const { productId, rating, comment } = body
  const userId = user._id

  // Check đã mua & đã giao
  const hasPurchasedAndDelivered = await Order.findOne({
    user: userId,
    'orderItems.product': productId,
    orderStatus: 'Delivered'
  })

  if (!hasPurchasedAndDelivered) {
    const err = new Error(
      'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và đơn hàng được giao thành công.'
    )
    err.statusCode = 403
    throw err
  }

  // Check đã review chưa
  const exists = await Review.findOne({
    productId,
    user: userId
  })

  if (exists) {
    const err = new Error('Bạn đã đánh giá sản phẩm này rồi!')
    err.statusCode = 400
    throw err
  }

  // Upload images
  let imageUrls = []

  if (files && files.length > 0) {
    for (const file of files) {
      const uploaded = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'reviews',
          resource_type: 'image'
        }
      )

      imageUrls.push(uploaded.secure_url)
    }
  }

  const review = await Review.create({
    productId,
    user: userId,
    username: user.name,
    rating,
    comment,
    images: imageUrls,
    hasMedia: imageUrls.length > 0,
    status: 'pending'
  })

  return review
}

// ================= GET PRODUCT REVIEWS =================
const getProductReviews = async (productId) => {
  return await Review.find({
    productId,
    status: 'approved'
  })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
}

// ================= DELETE REVIEW =================
const deleteReview = async ({ reviewId, user }) => {
  const review = await Review.findById(reviewId)

  if (!review) {
    const err = new Error('Review không tồn tại')
    err.statusCode = 404
    throw err
  }

  if (review.user.toString() !== user._id.toString()) {
    const err = new Error('Bạn không có quyền xóa review này')
    err.statusCode = 403
    throw err
  }

  await Review.findByIdAndDelete(reviewId)

  return true
}

export const reviewService = {
  createReview,
  getProductReviews,
  deleteReview
}
