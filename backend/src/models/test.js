import mongoose from 'mongoose'

// 1. Schema cho từng sản phẩm trong đơn hàng (Đã clean lại code cũ bị lặp)
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true }, // Giá tại thời điểm mua
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String }
}, { _id: false })

// 2. Schema chính cho Order
const orderSchema = new mongoose.Schema({
  // --- ĐỊNH DANH ---
  // Mã đơn hàng ngắn gọn (VD: DH839201) dùng để làm NỘI DUNG CK SEPAY
  orderCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true // Đánh index để tìm kiếm nhanh khi SePay gọi Webhook
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  guestId: { type: String, default: null },

  // --- SẢN PHẨM ---
  orderItems: [orderItemSchema],

  // --- ĐỊA CHỈ GIAO HÀNG (Chuẩn Shopee: Cần Tên + SĐT người nhận riêng biệt) ---
  shippingAddress: {
    fullName: { type: String, required: true }, // Tên người nhận (VD: Nguyễn Văn A)
    phone: { type: String, required: true }, // SĐT người nhận để shipper gọi
    address: { type: String, required: true }, // Địa chỉ cụ thể (Số nhà, đường...)
    city: { type: String, required: true }, // Tỉnh/Thành phố
    postalCode: { type: String },
    country: { type: String, default: 'Vietnam' }
  },

  // --- THANH TOÁN (Tối ưu cho SePay) ---
  paymentMethod: {
    type: String,
    required: true,
    default: 'Sepay' // Mặc định là SePay
  },
  paymentResult: { // Lưu thông tin từ SePay trả về (để đối soát sau này)
    id: String, // ID giao dịch ngân hàng
    status: String,
    update_time: String,
    email_address: String
  },

  // --- TÀI CHÍNH (Chi tiết giá như Shopee) ---
  itemsPrice: { type: Number, required: true, default: 0 }, // Tổng tiền hàng
  shippingPrice: { type: Number, required: true, default: 0 }, // Phí ship
  discountAmount: { type: Number, default: 0 }, // Số tiền giảm giá
  totalPrice: { type: Number, required: true }, // TỔNG THANH TOÁN CUỐI CÙNG (items + ship - discount)

  // --- TRẠNG THÁI ĐƠN HÀNG (Lifecycle giống Shopee) ---
  status: {
    type: String,
    enum: [
      'PendingPayment', // Chờ thanh toán (Vừa tạo đơn xong, chưa quét QR)
      'Processing', // Đang xử lý/Chờ xác nhận (Đã thanh toán xong, Shop đang gói hàng)
      'Delivering', // Đang giao hàng (Shipper đang đi)
      'Delivered', // Đã giao thành công
      'Cancelled', // Đã hủy
      'Refunded' // Hoàn tiền
    ],
    default: 'PendingPayment'
  },

  // --- TRẠNG THÁI THANH TOÁN ---
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },

  // --- TRẠNG THÁI GIAO HÀNG ---
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },

  // --- META DATA ---
  note: { type: String }, // Ghi chú của khách hàng
  orderType: {
    type: String,
    enum: ['Cart', 'BuyNow'],
    default: 'Cart'
  }
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
