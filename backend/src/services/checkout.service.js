import checkoutModel from '~/models/checkout.model.js'
import orderModel from '~/models/order.model.js'
import cartModel from '~/models/cart.model.js'
import productModel from '~/models/product.model.js'
import { env } from '~/config/environment'
import addressModel from '~/models/address.model'

// ================= CREATE CHECKOUT =================
const createCheckout = async (userId, body) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice, coupon } = body

  if (!checkoutItems || checkoutItems.length === 0) {
    const error = new Error('Giỏ hàng đang trống.')
    error.statusCode = 400
    throw error
  }

  const newCheckout = await checkoutModel.create({
    user: userId,
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    coupon: coupon || { code: null, discountAmount: 0 },
    paymentStatus: 'Pending',
    isPaid: false
  })

  await cartModel.findOneAndDelete({ user: userId })

  return { checkout: newCheckout }
}

// ================= GET QR =================
const getSepayQrInfo = async (id) => {
  const checkout = await checkoutModel.findById(id)

  if (!checkout) {
    const error = new Error('Không tìm thấy đơn hàng')
    error.statusCode = 404
    throw error
  }

  const BANK_ACC = env.SEPAY_BANK_ACCOUNT
  const BANK_NAME = env.SEPAY_BANK_NAME

  const shortCode = checkout._id.toString().slice(-6).toUpperCase()
  const fullCode = checkout._id.toString()

  const transferContent = `DH${fullCode}`

  const qrUrl = `https://qr.sepay.vn/img?acc=${BANK_ACC}&bank=${BANK_NAME}&amount=${checkout.totalPrice}&des=${transferContent}&template=compact`

  return {
    qrUrl,
    transferContentDisplay: `DH${shortCode}`,
    transferContent,
    amount: checkout.totalPrice
  }
}

// ================= IPN =================
const sepayIpn = async (body) => {
  const { content } = body

  const match = content.match(/DH([a-fA-F0-9]{24})/)
  if (!match) return { error: 'Invalid content' }

  const checkoutId = match[1]

  const checkout = await checkoutModel.findById(checkoutId)
  if (!checkout) return { error: 'Order not found' }
  if (checkout.isPaid) return { message: 'Already paid' }

  checkout.isPaid = true
  checkout.paymentStatus = 'completed'
  checkout.paymentMethod = 'SEPAY'
  await checkout.save()

  let addressId = null

  if (checkout.shippingAddress) {
    const newAddress = await addressModel.create({
      user: checkout.user,
      name: checkout.shippingAddress.name,
      phone: checkout.shippingAddress.phone,
      street: checkout.shippingAddress.street,
      province: checkout.shippingAddress.province,
      district: checkout.shippingAddress.district,
      ward: checkout.shippingAddress.ward
    })

    addressId = newAddress._id
  }


  const newOrder = await orderModel.create({
    user: checkout.user,
    checkoutId: checkout._id,
    orderItems: checkout.checkoutItems,
    shippingAddress: addressId,
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

  for (const item of checkout.checkoutItems) {
    await productModel.findByIdAndUpdate(item.productId, {
      $inc: { countInStock: -item.quantity, sold: item.quantity }
    })
  }

  await cartModel.findOneAndDelete({ user: checkout.user })

  return { success: true, newOrderId: newOrder._id }
}

// ================= CHECK STATUS =================
const checkPaymentStatus = async (id) => {
  const checkout = await checkoutModel.findById(id)

  if (!checkout) {
    const error = new Error('Not found')
    error.statusCode = 404
    throw error
  }

  if (checkout.isPaid) {
    let orderId = checkout.orderId

    if (!orderId) {
      const order = await orderModel.findOne({ checkoutId: checkout._id })
      orderId = order?._id
    }

    return {
      isPaid: true,
      orderId
    }
  }

  return { isPaid: false }
}

// ================= FINALIZE =================
const finalizeOrder = async (checkoutId, body) => {
  const { isOnlinePaymentSuccess = false } = body

  const checkout = await checkoutModel.findById(checkoutId)
  if (!checkout) {
    const error = new Error('Không tìm thấy đơn hàng tạm.')
    error.statusCode = 404
    throw error
  }

  for (const item of checkout.checkoutItems) {
    const product = await productModel.findById(item.productId)
    if (!product || product.countInStock < item.quantity) {
      const error = new Error(`Sản phẩm ${product?.name} không đủ số lượng.`)
      error.statusCode = 400
      throw error
    }
  }

  if (checkout.paymentMethod !== 'COD' && !isOnlinePaymentSuccess) {
    const error = new Error('Thanh toán online phải finalize qua IPN.')
    error.statusCode = 400
    throw error
  }

  const isPaid =
    checkout.paymentMethod !== 'COD' && isOnlinePaymentSuccess

  const paymentStatus = isPaid ? 'completed' : 'pending'

  let addressId = null

  if (checkout.shippingAddress) {
    const newAddress = await addressModel.create({
      user: checkout.user,
      name: checkout.shippingAddress.name,
      phone: checkout.shippingAddress.phone,
      street: checkout.shippingAddress.street,
      province: checkout.shippingAddress.province,
      district: checkout.shippingAddress.district,
      ward: checkout.shippingAddress.ward
    })

    addressId = newAddress._id
  }
  const newOrder = await orderModel.create({
    user: checkout.user,
    checkoutId: checkout._id,
    orderItems: checkout.checkoutItems,
    shippingAddress: addressId,
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

  return {
    message: 'Đơn hàng đã được xác nhận.',
    orderId: newOrder._id
  }
}

// ================= DETAIL =================
const getCheckoutDetail = async (id) => {
  const checkout = await checkoutModel
    .findById(id)
    .populate('checkoutItems.productId')

  if (!checkout) {
    const error = new Error('Not found')
    error.statusCode = 404
    throw error
  }

  return checkout
}

export const checkoutService = {
  createCheckout,
  getSepayQrInfo,
  sepayIpn,
  checkPaymentStatus,
  finalizeOrder,
  getCheckoutDetail
}
