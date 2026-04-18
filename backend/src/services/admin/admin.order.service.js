import orderModel from '~/models/order.model.js'

// ===================== POPULATE =====================
const populateOrder = (query) => {
  return query
    .populate('user', 'name email')
    .populate('orderItems.productId', 'name price images')
}

// ===================== FILTER =====================
const buildOrderFilter = (query) => {
  const filter = {}

  if (query.userId) filter.user = query.userId
  if (query.status) filter.status = query.status

  return filter
}

// ===================== PAGINATION =====================
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.max(1, parseInt(query.limit) || 10)
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

// ===================== SERVICE =====================
export const orderService = {
  async getAllOrders(query) {
    const filter = buildOrderFilter(query)
    const { page, limit, skip } = getPagination(query)

    const orders = await populateOrder(
      orderModel.find(filter)
    )
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })

    return orders
  },

  async updateOrderStatus(orderId, status) {
    const order = await orderModel.findById(orderId)
    if (!order) return null

    order.status = status || order.status

    if (status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = Date.now()
    }

    if (status !== 'Delivered' && order.deliveredAt) {
      order.deliveredAt = undefined
    }

    const updatedOrder = await order.save()
    await updatedOrder.populate('user', 'name email')

    return updatedOrder
  },

  async deleteOrder(orderId) {
    const order = await orderModel.findById(orderId)
    if (!order) return null

    await order.deleteOne()
    return true
  },

  async getOrderById(orderId) {
    return populateOrder(orderModel.findById(orderId))
  },

  async getOrdersByUser(userId) {
    return populateOrder(
      orderModel.find({ user: userId })
    ).sort({ createdAt: -1 })
  },

  async getOrderStats() {
    const totalOrders = await orderModel.countDocuments()

    const totalRevenue = await orderModel.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])

    const [pending, processing, delivered] = await Promise.all([
      orderModel.countDocuments({ status: 'Pending' }),
      orderModel.countDocuments({ status: 'Processing' }),
      orderModel.countDocuments({ status: 'Delivered' })
    ])

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCount: { pending, processing, delivered }
    }
  }
}
