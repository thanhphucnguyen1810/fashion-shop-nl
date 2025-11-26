import checkoutModel from '~/models/checkout.model.js'
import orderModel from '~/models/order.model.js'
import cartModel from '~/models/cart.model.js'
import productModel from '~/models/product.model.js'
import axios from 'axios'
import crypto from 'crypto'
import { env } from '~/config/environment'


// 1. Tạo phiên Checkout (Lưu thông tin đơn hàng tạm)
export const createCheckout = async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice, coupon } = req.body

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: 'Giỏ hàng đang trống.' })
  }

  try {
    const newCheckout = await checkoutModel.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      coupon: coupon || { code: null, discountAmount: 0 },
      paymentStatus: 'Pending',
      isPaid: false
    })

    // Ở đây ta tạm giữ cart cho đến khi finalize, hoặc xóa luôn nếu muốn.
    await cartModel.findOneAndDelete({ user: req.user._id })
    res.status(201).json({ checkout: newCheckout })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const getSepayQrInfo = async (req, res) => {
  try {
    const { id } = req.params
    const checkout = await checkoutModel.findById(id)

    if (!checkout) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    // CẤU HÌNH TÀI KHOẢN NHẬN TIỀN (Bạn sửa lại cho đúng của bạn nhé)
    const BANK_ACC = env.SEPAY_BANK_ACCOUNT
    const BANK_NAME = env.SEPAY_BANK_NAME

    console.log(BANK_ACC)
    console.log(BANK_NAME)

    // Tạo nội dung chuyển khoản: DH + 6 số cuối của ID (hoặc dùng full ID nếu cấu hình Sepay yêu cầu)
    // Lưu ý: Nội dung này phải KHỚP với cấu hình "Mẫu nội dung" bạn cài trên my.sepay.vn
    const transferContent = `DH${checkout._id.toString().slice(-6).toUpperCase()}`

    // Tạo URL ảnh QR theo chuẩn Sepay (Template: compact, qr_only, print...)
    const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_ACC}&bank=${BANK_NAME}&amount=${checkout.totalPrice}&des=${transferContent}&template=compact`

    res.status(200).json({
      qrUrl,
      transferContent,
      amount: checkout.totalPrice
    })
  } catch (error) {
    console.error('Get QR Error:', error)
    res.status(500).json({ message: 'Lỗi tạo mã QR.' })
  }
}

export const sepayIpn = async (req, res) => {
  const data = req.body
  // Sepay gửi về: { content: "DH123456 ...", amount: 50000, ... }

  try {
    // 1. Phân tích nội dung để lấy Checkout ID
    // Giả sử content là "DH66EF12", bạn cần regex hoặc logic để tìm lại checkout._id
    // Cách đơn giản nhất cho đồ án: Duyệt tìm checkout nào có totalPrice == amount VÀ trạng thái chưa thanh toán
    // Hoặc tốt nhất: Cấu hình Sepay gửi transaction chứa đúng checkoutId.

    // Ở đây tôi giả định bạn dùng pattern "DH" + 6 ký tự cuối của ID như hàm getSepayQrInfo ở trên
    // Tuy nhiên, để đơn giản cho IPN chạy được ngay, tôi sẽ tìm theo regex content trong DB (cách này hơi chậm nhưng dễ code)

    const { content, amount } = data

    // Tìm checkout có amount khớp VÀ chưa thanh toán
    // Lưu ý: Logic này cần chặt chẽ hơn trong thực tế (check content contains id)
    // Ví dụ content: "CHUYEN KHOAN DH66EF12" -> Lấy "DH66EF12" -> Tìm trong DB

    // Tạm thời để demo báo cáo: Tìm checkout khớp tiền và chưa thanh toán gần nhất
    // Bạn nên cấu hình Sepay bắn về order_code chính xác thì dùng logic cũ của bạn ok hơn.

    // === NẾU DÙNG LOGIC CŨ CỦA BẠN (Dựa trên order_code) ===
    const checkoutId = data.order_code // Nếu Sepay trả về đúng ID này
    const checkout = await checkoutModel.findById(checkoutId)

    if (!checkout) return res.status(200).json({ error: 'Order not found' }) // Trả 200 để Sepay không gửi lại
    if (checkout.isPaid) return res.status(200).json({ message: 'Already paid' })

    // Xác nhận thanh toán
    checkout.isPaid = true
    checkout.paymentStatus = 'completed'
    checkout.paymentMethod = 'SEPAY'
    await checkout.save() // Lưu trạng thái checkout trước

    // Gọi finalizeOrder để tạo Order chính thức
    // Lưu ý: finalizeOrder của bạn đang trả về res.json(), gọi trực tiếp sẽ lỗi req/res
    // Nên tách logic finalize ra service riêng. Nhưng để nhanh, ta copy logic tạo order vào đây:

    const newOrder = await orderModel.create({
      user: checkout.user,
      checkoutId: checkout._id,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      coupon: checkout.coupon,
      paymentMethod: 'SEPAY',
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paymentStatus: 'completed',
      status: 'Processing',
      orderType: 'Cart'
    })

    checkout.orderId = newOrder._id
    await checkout.save()

    // Trừ tồn kho (Copy từ logic finalize cũ)
    for (const item of checkout.checkoutItems) {
      await productModel.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity, sold: item.quantity }
      })
    }

    // Xóa cart cũ
    await cartModel.findOneAndDelete({ user: checkout.user })

    return res.status(200).json({ success: true, newOrderId: newOrder._id })

  } catch (error) {
    console.error('IPN Error:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}

// --- 2. HÀM MỚI: Kiểm tra trạng thái thanh toán (Polling) ---
export const checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const checkout = await checkoutModel.findById(id)

    if (!checkout) return res.status(404).json({ message: 'Not found' })

    if (checkout.isPaid) {
      // Sau khi sửa Bước 1, checkout.orderId sẽ có giá trị.
      // Dùng orderId đã lưu trong checkout (từ Bước 1)
      const orderId = checkout.orderId; 
      
      // Nếu orderId chưa được lưu vào checkout, ta phải tìm trong Order collection
      if(!orderId) {
          const order = await orderModel.findOne({ checkoutId: checkout._id })
          orderId = order ? order._id : null
      }
      
      return res.status(200).json({
        isPaid: true,
        orderId: orderId // 👈 CHẮC CHẮN TRẢ VỀ ORDER ID Ở ĐÂY
      })
    }

    return res.status(200).json({ isPaid: false })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const finalizeOrder = async (req, res) => {
  const { checkoutId } = req.params
  const { isOnlinePaymentSuccess = false } = req.body

  try {
    const checkout = await checkoutModel.findById(checkoutId)
    if (!checkout) return res.status(404).json({ message: 'Không tìm thấy đơn hàng tạm.' })

    for (const item of checkout.checkoutItems) {
      const product = await productModel.findById(item.productId)
      if (!product || product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product?.name} không đủ số lượng.`
        })
      }
    }

    let isPaid = checkout.paymentMethod !== 'COD' && isOnlinePaymentSuccess
    let paymentStatus = isPaid ? 'completed' : 'pending'

    if (checkout.paymentMethod !== 'COD' && !isOnlinePaymentSuccess) {
      return res.status(400).json({ message: 'Thanh toán online phải finalize qua IPN.' })
    }

    const newOrder = await orderModel.create({
      user: checkout.user,
      checkoutId: checkout._id,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      coupon: checkout.coupon,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid,
      paymentStatus,
      status: isPaid ? 'Processing' : 'AwaitingConfirmation',
      orderType: 'Cart'
    })

    for (const item of checkout.checkoutItems) {
      await productModel.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity, sold: item.quantity }
      })
    }

    await checkoutModel.findByIdAndDelete(checkoutId)

    res.status(201).json({ message: 'Đơn hàng đã được xác nhận.', orderId: newOrder._id })

  } catch (error) {
    console.error('Error finalizing order:', error)
    res.status(500).json({ message: 'Server Error khi xác nhận đơn hàng.' })
  }
}

// 5. Get Checkout Detail
export const getCheckoutDetail = async (req, res) => {
  try {
    const checkout = await checkoutModel
      .findById(req.params.id)
      .populate('checkoutItems.productId')

    if (!checkout) return res.status(404).json({ message: 'Not found' })

    res.json(checkout)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}