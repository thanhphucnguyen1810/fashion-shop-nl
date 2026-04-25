import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      { type: String, required: true },
  image:     { type: String, required: true },
  price:     { type: Number, required: true },
  size:      String,
  color:     String,
  quantity:  { type: Number, required: true }
}, { _id: false })

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  role: { type: String, enum: ['system', 'admin', 'shipper', 'user'], default: 'system' }
}, { timestamps: true })

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestId: { type: String, required: false, default: null },
  orderItems: [orderItemSchema],
  shippingAddress: {
    name:     String,
    phone:    String,
    street:   String,
    province: String,
    district: String,
    ward:     String
  },
  coupon: {
    code: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null }
  },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  paymentStatus: { type: String, default: 'pending' },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: [
      'AwaitingConfirmation', // Admin chưa xác nhận
      'AwaitingPickup', // Admin đã xác nhận, chờ shipper lấy hàng
      'PickedUp', // Shipper đã lấy hàng
      'InTransit', // Đang vận chuyển
      'OutForDelivery', // Shipper đang giao đến tay người nhận
      'Delivered', // Shipper xác nhận đã giao
      'Confirmed', // User xác nhận đã nhận
      'Cancelled',
      'PendingCheckout'
    ],
    default: 'AwaitingConfirmation'
  },
  timeline: [timelineSchema],
  orderType: { type: String, enum: ['Cart', 'BuyNow'], default: 'Cart' },
  checkoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkout', required: false }
}, { timestamps: true }
)

export default mongoose.model('order', orderSchema)
