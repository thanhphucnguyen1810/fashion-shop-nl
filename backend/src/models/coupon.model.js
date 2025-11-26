import mongoose from 'mongoose'

const COUPON_TYPE = {
  PERCENTAGE: 'percentage', // Giảm theo phần trăm (ví dụ: 10%)
  FIXED: 'fixed' // Giảm theo số tiền cố định (ví dụ: 50.000 VNĐ)
}

const couponSchema = new mongoose.Schema(
  {
    // Mã giảm giá (ví dụ: SUMMER20, FREE50K)
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    // Loại giảm giá: percentage hoặc fixed
    discountType: {
      type: String,
      enum: Object.values(COUPON_TYPE),
      required: true
    },
    // Giá trị giảm giá (ví dụ: 10 cho 10%, hoặc 50000 cho 50.000 VNĐ)
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    // Số tiền tối thiểu của đơn hàng để áp dụng mã
    minimumOrderAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    // Giới hạn số lần sử dụng tổng cộng
    usageLimit: {
      type: Number,
      required: true,
      min: 0
    },
    // Số lần đã được sử dụng
    usedCount: {
      type: Number,
      default: 0
    },
    // Ngày hết hạn của mã giảm giá
    expiresAt: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    // Trạng thái hoạt động
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'coupons'
  }
)

// Index để tối ưu hóa việc tìm kiếm mã giảm giá
couponSchema.index({ code: 1, expiresAt: 1 })

// Middleware để đảm bảo expiresAt không phải là quá khứ khi tạo mới
couponSchema.pre('save', function (next) {
  if (this.isNew && this.expiresAt < new Date()) {
    const error = new Error('Ngày hết hạn phải ở trong tương lai.')
    next(error)
  } else {
    next()
  }
})

export default mongoose.model('Coupon', couponSchema)
