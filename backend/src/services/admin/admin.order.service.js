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

const getAllOrders = async (query) => {
  const filter = buildOrderFilter(query)
  const { page, limit, skip } = getPagination(query)

  const result = await orderModel.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    { $facet: {
      queryOrders: [
        { $skip: skip },
        { $limit: limit },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'products', localField: 'orderItems.productId', foreignField: '_id', as: 'productDetails',
          pipeline: [{ $project: { name: 1, price: 1, images: 1 } }]
        } }
      ],
      queryTotal: [{ $count: 'total' }]
    } }
  ])

  const data = result[0]
  return {
    orders: data.queryOrders || [],
    total: data.queryTotal[0]?.total || 0,
    page,
    pages: Math.ceil((data.queryTotal[0]?.total || 0) / limit)
  }
}

const updateOrderStatus = async (orderId, status) => {
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
}

const deleteOrder = async (orderId) => {
  const order = await orderModel.findById(orderId)
  if (!order) return null

  await order.deleteOne()
  return true
}

const getOrderById = async (orderId) => {
  return populateOrder(orderModel.findById(orderId))
}

const getOrdersByUser = async (userId) => {
  return populateOrder(
    orderModel.find({ user: userId })
  ).sort({ createdAt: -1 })
}

const getOrderStats = async () => {
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

// ===================== SERVICE =====================
export const orderService = {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getOrdersByUser,
  getOrderStats
}
