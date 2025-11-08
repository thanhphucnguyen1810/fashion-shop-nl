// controllers/review.controller.js
import Review from '~/models/review.model.js'
import Product from '~/models/product.model.js'
import User from '~/models/user.model.js'

// Lấy tất cả review (admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải đánh giá', error })
  }
}

// Cập nhật trạng thái (duyệt / chặn)
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const updated = await Review.findByIdAndUpdate(id, { status }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy đánh giá' })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error })
  }
}

// Xóa đánh giá
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ message: 'Đã xóa đánh giá' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa', error })
  }
}

// @desc Thêm review mẫu (test)

export const seedSampleReviews = async (req, res) => {
  try {
    // Lấy 1 user và 1 product bất kỳ trong DB
    const user = await User.findOne()
    const product = await Product.findOne()

    if (!user || !product)
      return res.status(400).json({ message: 'Không tìm thấy user hoặc product để tạo mẫu.' })

    const reviews = [
      {
        user: user._id,
        product: product._id,
        rating: 5,
        comment: 'Sản phẩm rất tốt, giao hàng nhanh!',
        status: 'approved'
      },
      {
        user: user._id,
        product: product._id,
        rating: 4,
        comment: 'Chất lượng ổn định, sẽ mua lại.',
        status: 'pending'
      },
      {
        user: user._id,
        product: product._id,
        rating: 2,
        comment: 'Sản phẩm không đúng mô tả.',
        status: 'blocked'
      }
    ]

    await Review.insertMany(reviews)
    res.status(201).json({ message: 'Thêm đánh giá mẫu thành công!' })
  } catch (error) {
    console.error('Error seeding reviews:', error)
    res.status(500).json({ message: 'Lỗi khi thêm đánh giá mẫu', error: error.message })
  }
}