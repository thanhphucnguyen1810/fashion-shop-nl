import mongoose from 'mongoose'
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: String,
  color: String,
  quantity: {
    type: Number,
    required: true
  }
}, { _id: false }
)


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  // Thêm trường để lưu Guest ID (là chuỗi)
  guestId: {
    type: String,
    required: false,
    default: null
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false }
  },
  coupon: {
    code: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  status: {
    type: String,
    enum: [
      'PendingCheckout', // Trạng thái tạm thời cho Buy Now (Chưa hoàn tất thanh toán)
      'AwaitingConfirmation', // Chờ xác nhận (Tương đương Processing/New Order)
      'AwaitingShipment', // Chờ lấy hàng (Đã xác nhận, chờ đơn vị vận chuyển)
      'InTransit', // Đang giao (Tương đương Shipped)
      'Delivered',
      'Cancelled'
    ],
    default: 'AwaitingConfirmation'
  },
  orderType: {
    type: String,
    enum: ['Cart', 'BuyNow'],
    default: 'Cart'
  }
}, { timestamps: true }
)

export default mongoose.model('order', orderSchema)

