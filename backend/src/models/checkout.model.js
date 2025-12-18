import mongoose from 'mongoose'
const checkoutItemScheme = new mongoose.Schema({
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
  size: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
},
{ _id: false }
)

const checkoutScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkoutItems: [checkoutItemScheme],
  shippingAddress: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: false, default: '00000' },
    country: { type: String, required: true }
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
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed// store payment-related details (transaction ID, paypal response)
  },
  isFinalized: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  finalizedAt: {
    type: Date
  }
}, { timestamps: true })

export default mongoose.model('checkout', checkoutScheme)
