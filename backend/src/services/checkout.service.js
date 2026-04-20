import checkoutModel from '~/models/checkout.model.js'
import orderModel from '~/models/order.model.js'
import cartModel from '~/models/cart.model.js'
import productModel from '~/models/product.model.js'
import { env } from '~/config/environment'
import mongoose from 'mongoose'

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

  //bắt đầu một session
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const checkout = await checkoutModel.findById(checkoutId).session(session) // truyền session vào
    if (!checkout) throw new Error('Order not found')
    if (checkout.isPaid) return { message: 'Already paid' }

    checkout.isPaid = true
    checkout.paymentStatus = 'completed'
    checkout.paymentMethod = 'SEPAY'
    await checkout.save({ session }) // truyền session vào

    const newOrder = await orderModel.create([{ // create cần đc truyền vào mảng cho session
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
    }], { session })

    checkout.orderId = newOrder[0]._id
    await checkout.save({ session })

    for (const item of checkout.checkoutItems) {
      const result = await productModel.updateOne(
        {
          _id: item.productId,
          'variants.color': item.color,
          'variants.sizes.size': item.size,
          'variants.sizes.stock': { $gte: item.quantity } // Chỉ trừ nếu đủ hàng
        },
        { $inc: { 'variants.$[v].sizes.$[s].stock': -item.quantity } },
        {
          arrayFilters: [
            { 'v.color': item.color },
            { 's.size': item.size }
          ],
          session
        }
      )

      if (result.modifiedCount === 0) {
        throw new Error(`Sản phẩm ${item.name} (${item.color} - ${item.size}) đã hết hàng hoặc không đủ số lượng.`)
      }
    }

    await cartModel.findOneAndDelete({ user: checkout.user }, { session })
    await session.commitTransaction() // lưu tất cả thay đổi
    return { success: true, newOrderId: newOrder[0]._id }

  } catch (error) {
    await session.abortTransaction() // hoàn tác tất cả nếu có lỗi
    throw error
  } finally {
    session.endSession()
  }
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
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const checkout = await checkoutModel.findById(checkoutId).session(session)
    if (!checkout) throw new Error('Không tìm thấy đơn hàng tạm.')

    // 1. Kiểm tra tồn kho và trừ kho (Atomic)
    for (const item of checkout.checkoutItems) {
      const result = await productModel.updateOne(
        {
          _id: item.productId,
          'variants.color': item.color,
          'variants.sizes.size': item.size,
          'variants.sizes.stock': { $gte: item.quantity } // Phải đủ hàng
        },
        {
          $inc: { 'variants.$[v].sizes.$[s].stock': -item.quantity }
        },
        {
          arrayFilters: [
            { 'v.color': item.color },
            { 's.size': item.size }
          ],
          session // Bắt buộc truyền session
        }
      )

      if (result.modifiedCount === 0) throw new Error(`Sản phẩm ${item.name} (${item.color} - ${item.size}) đã hết hàng hoặc không đủ số lượng.`)
    }

    // 2.Kiểm tra thanh toán
    if (checkout.paymentMethod !== 'COD' && !isOnlinePaymentSuccess) {
      throw new Error('Thanh toán online phải finalize qua IPN.')
    }

    const isPaid = checkout.paymentMethod !== 'COD' && isOnlinePaymentSuccess
    const paymentStatus = isPaid ? 'completed' : 'pending'

    // 3. Tạo đơn hàng chính thức
    const newOrder = await orderModel.create([{
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
    }], { session }) // bắt buộc truyền session

    // 4. Xóa checkout tạm
    await checkoutModel.findByIdAndDelete(checkoutId, { session })
    await session.commitTransaction()

    return {
      message: 'Đơn hàng đã được xác nhận.',
      orderId: newOrder[0]._id
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
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
