import checkoutModel from '~/models/checkout.model.js'
import orderModel from '~/models/order.model.js'
import cartModel from '~/models/cart.model.js'
import productModel from '~/models/product.model.js'
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

    const shortCode = checkout._id.toString().slice(-6).toUpperCase()
    const fullCode = checkout._id.toString()

    const transferContent = `DH${fullCode}`

    // Tạo URL ảnh QR theo chuẩn Sepay (Template: compact, qr_only, print...)
    const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_ACC}&bank=${BANK_NAME}&amount=${checkout.totalPrice}&des=${transferContent}&template=compact`

    res.status(200).json({
      qrUrl,
      transferContentDisplay: `DH${shortCode}`,
      transferContent,
      amount: checkout.totalPrice
    })
  } catch (error) {
    console.error('Get QR Error:', error)
    res.status(500).json({ message: 'Lỗi tạo mã QR.' })
  }
}

export const sepayIpn = async (req, res) => {
  const { content, amount } = req.body

  try {
    // Tách ID dạng DH{ObjectId}
    const match = content.match(/DH([a-fA-F0-9]{24})/)

    if (!match) {
      console.log('Không tìm thấy mã đơn trong content:', content)
      return res.status(200).json({ error: 'Invalid content' })
    }

    const checkoutId = match[1]

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
      status: 'AwaitingConfirmation',
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
      let orderId = checkout.orderId

      // Nếu orderId chưa được lưu vào checkout, ta phải tìm trong Order collection
      if (!orderId) {
        const order = await orderModel.findOne({ checkoutId: checkout._id })
        orderId = order ? order._id : null
      }

      return res.status(200).json({
        isPaid: true,
        orderId: orderId
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
      status: 'AwaitingConfirmation',
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
