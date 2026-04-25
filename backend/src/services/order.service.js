import orderModel from '~/models/order.model'

// ================= GET MY ORDERS =================
const getMyOrders = async (userId) => {
  return await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .select('-timeline') // không cần timeline ở list
}

// ================= GET ORDER BY ID =================
const getOrderById = async (orderId) => {
  const order = await orderModel.findById(orderId)
    .populate('user', 'name email phone')
    .populate('shipper', 'name email phone avatar')
    .populate('coupon.couponId', 'code name discountType')

  if (!order) throw new Error('Order not found')
  return order
}

export const orderService = {
  getMyOrders,
  getOrderById
}
