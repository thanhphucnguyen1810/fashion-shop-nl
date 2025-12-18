import Review from '~/models/review.model.js'
import Order from '~/models/order.model'
import cloudinary from '~/config/cloudinary.config'
import Product from '~/models/product.model'

export const createReview = async (req, res) => {

  try {
    const { productId, rating, comment } = req.body
    const files = req.files
    const userId = req.user._id

    const hasPurchasedAndDelivered = await Order.findOne({
      user: userId,
      'orderItems.product': productId,
      orderStatus: 'Delivered'
    })

    if (!hasPurchasedAndDelivered) {
      return res.status(403).json({
        message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và đơn hàng được giao thành công.'
      })
    }

    // Check user đã review sản phẩm này chưa
    const exists = await Review.findOne({
      productId,
      user: userId
    })

    if (exists) {
      return res
        .status(400)
        .json({ message: 'Bạn đã đánh giá sản phẩm này rồi!' })
    }
    // TẢI ẢNH LÊN CLOUDINARY
    let imageUrls = []
    if (files && files.length > 0) {
      for (let file of files) {
        const uploadedResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'reviews',
            resource_type: 'image'
          }
        )

        // Lưu URL (Chỉ lưu URL, không cần public_id nếu không cần xóa ảnh)
        imageUrls.push(uploadedResult.secure_url)
      }
    }

    // TẠO REVIEW VÀ LƯU VÀO  DATABASE
    const newReview = await Review.create({
      productId,
      user: userId,
      username: req.user.name,
      rating,
      comment,
      images: imageUrls,
      hasMedia: imageUrls?.length > 0,
      status: 'pending'
    })

    res.status(201).json({
      message: 'Đánh giá thành công!',
      review: newReview
    })
  } catch (error) {
    console.error('Error createReview:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params
    if (!productId) {
      return res.status(400).json({ message: 'Thiếu ID sản phẩm.' })
    }
    const reviews = await Review.find({
      productId: productId,
      status: 'approved'
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error('Error getProductReviews:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review)
      return res.status(404).json({ message: 'Review không tồn tại' })

    if (review.user.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: 'Bạn không có quyền xóa review này' })

    await Review.findByIdAndDelete(req.params.id)

    res.json({ message: 'Xóa review thành công' })
  } catch (error) {
    console.error('Error deleteReview:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
