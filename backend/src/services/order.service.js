import orderModel from '~/models/order.model'
import productModel from '~/models/product.model'

// ================= GET MY ORDERS =================
const getMyOrders = async (userId) => {
  const orders = await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 })

  return orders
}

// ================= GET ORDER BY ID =================
const getOrderById = async (orderId) => {
  const order = await orderModel.findById(orderId)
    .populate('user', 'fullName email phoneNumber')
    .populate('shippingAddress')
    .populate('coupon.couponId', 'code name discountType')

  if (!order) {
    throw new Error('Order not found')
  }

  return order
}

// ================= CREATE ORDER =================
const createCheckoutOrder = async (body) => {
  const {
    orderItems,
    userId,
    guestId,
    shippingAddress,
    couponInfo,
    paymentMethod
  } = body

  if (!orderItems || orderItems.length === 0) {
    throw new Error('Không có sản phẩm để tạo đơn hàng.')
  }

  // TÍNH TOÁN + CHECK STOCK
  let calculatedTotalPrice = 0
  let finalOrderItems = []

  for (const item of orderItems) {
    const product = await productModel.findById(item.productId)

    if (!product) {
      throw new Error(`Sản phẩm ID ${item.productId} không tồn tại.`)
    }

    const currentStock = product.countInStock || 0

    if (currentStock < item.quantity) {
      throw new Error(
        `Sản phẩm ${product.name} hiện không đủ số lượng (${item.quantity}). Tổng tồn kho: ${currentStock}`
      )
    }

    const itemPrice = product.price
    calculatedTotalPrice += itemPrice * item.quantity

    finalOrderItems.push({
      productId: item.productId,
      name: product.name,
      image: product.images?.[0]?.url || 'default-image-url',
      price: itemPrice,
      size: item.size,
      color: item.color,
      quantity: item.quantity
    })
  }

  // COUPON
  const discountAmount = couponInfo?.discountAmount || 0
  const finalTotalPrice = calculatedTotalPrice - discountAmount

  // STATUS LOGIC (GIỮ NGUYÊN)
  let initialStatus = 'PendingCheckout'
  let isPaid = false

  if (paymentMethod === 'COD') {
    initialStatus = 'AwaitingConfirmation'
    isPaid = false
  }

  const newOrderData = {
    user: userId ? userId : null,
    guestId: userId ? null : guestId,
    orderItems: finalOrderItems,

    shippingAddress: shippingAddress || null,

    coupon: {
      code: couponInfo?.code || null,
      discountAmount,
      couponId: couponInfo?.couponId || null
    },

    paymentMethod,
    totalPrice: finalTotalPrice > 0 ? finalTotalPrice : 0,

    isPaid,
    paymentStatus: isPaid ? 'completed' : 'pending',

    status: initialStatus,
    orderType: 'Cart'
  }

  const createdOrder = await orderModel.create(newOrderData)

  return createdOrder
}

export const orderService = {
  getMyOrders,
  getOrderById,
  createCheckoutOrder
}
