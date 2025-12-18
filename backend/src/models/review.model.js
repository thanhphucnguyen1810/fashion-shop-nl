import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  hasMedia: {
    type: Boolean,
    default: false
  },
  adminReply: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
})

// 1. Hàm tính toán và cập nhật thống kê sản phẩm
reviewSchema.statics.calculateAverageRating = async function (productId) {
  // Chỉ tính toán reviews có status là 'approved'
  const stats = await this.aggregate([
    {
      $match: {
        productId: productId,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ])

  const Product = mongoose.model('Product')

  try {
    await Product.findByIdAndUpdate(productId, {
      rating: stats[0] ? Number(stats[0].avgRating.toFixed(1)) : 0,
      numReviews: stats[0] ? stats[0].numReviews : 0
    }, { new: true })

    console.log(`Updated stats for product ${productId}: Avg Rating=${stats[0]?.avgRating.toFixed(1) || 0}, Num Reviews=${stats[0]?.numReviews || 0}`)
  } catch (err) {
    console.error('Lỗi khi cập nhật thống kê sản phẩm:', err)
  }
}

// 2. Middleware chạy sau khi lưu (Post-save middleware)
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.productId)
})

// 3. Middleware chạy sau khi xóa (Post-remove middleware - quan trọng khi Admin xóa review)
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const Review = mongoose.model('Review')
    Review.calculateAverageRating(doc.productId)
  }
})

export default mongoose.model('Review', reviewSchema)
