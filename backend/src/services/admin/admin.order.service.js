import orderModel from '~/models/order.model.js'

// ===== TIMELINE MESSAGE MAP =====
const STATUS_MESSAGES = {
  AwaitingConfirmation: 'Đơn hàng đã được đặt, đang chờ xác nhận từ cửa hàng.',
  AwaitingPickup:       'Cửa hàng đã xác nhận đơn hàng, đang chờ shipper đến lấy hàng.',
  PickedUp:             'Shipper đã lấy hàng thành công.',
  InTransit:            'Đơn hàng đang trên đường vận chuyển.',
  OutForDelivery:       'Shipper đang trên đường giao hàng đến bạn.',
  Delivered:            'Shipper đã giao hàng thành công.',
  Confirmed:            'Bạn đã xác nhận nhận hàng. Cảm ơn bạn đã mua sắm!',
  Cancelled:            'Đơn hàng đã bị hủy.'
}

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
        // Chỉ lookup user thôi, shippingAddress đã embedded
        { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }]
        } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'shipper',
            foreignField: '_id',
            as: 'shipper',
            pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }]
          }
        },
        { $unwind: { path: '$shipper', preserveNullAndEmptyArrays: true } }
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

// ===== ADMIN: UPDATE STATUS =====
const updateOrderStatus = async (orderId, status, userId) => {
  const order = await orderModel.findById(orderId)
  if (!order) return null

  order.status = status
  // tự động set lại các flag
  if (status === 'Delivered') {
    order.isDelivered = true
    order.deliveredAt = new Date()
  }
  if (status === 'Confirmed') {
    order.isDelivered = true
    order.deliveredAt = order.deliveredAt || new Date()
  }

  // push vào timeline
  order.timeline.push({
    status,
    message: STATUS_MESSAGES[status] || status,
    updatedBy: userId,
    role: 'admin'
  })

  await order.save()
  return order
}

// ===== ADMIN: ASSIGN SHIPPER =====
const assignShipper = async (orderId, shipperId, adminId) => {
  const order = await orderModel.findById(orderId)
  if (!order) return null
  if (!shipperId) throw new Error('Thiếu shipperId')

  order.shipper = shipperId
  order.status = 'AwaitingPickup'
  order.timeline.push({
    status: 'AwaitingPickup',
    message: STATUS_MESSAGES['AwaitingPickup'],
    updatedBy: adminId,
    role: 'admin'
  })

  await order.save()
  return order.populate('shipper', 'name email avatar')
}

// ===== SHIPPER: LẤY DANH SÁCH ĐƠN ĐƯỢC PHÂN CÔNG =====
const getShipperOrders = async (shipperId) => {
  if (!shipperId) throw new Error('Thiếu shipperId')
  return await orderModel.find({
    shipper: shipperId,
    status: { $in: ['AwaitingPickup', 'PickedUp', 'InTransit', 'OutForDelivery'] }
  })
    .populate('user', 'name phone')
    .populate('shipper', 'name email avatar')
    .sort({ createdAt: -1 })
}

// ===== SHIPPER: CẬP NHẬT TRẠNG THÁI =====
const shipperUpdateStatus = async (orderId, shipperId, status) => {
  const SHIPPER_ALLOWED = ['PickedUp', 'InTransit', 'OutForDelivery', 'Delivered']
  if (!SHIPPER_ALLOWED.includes(status)) throw new Error('Trạng thái không hợp lệ')

  const order = await orderModel.findOne({ _id: orderId, shipper: shipperId })
  if (!order) return null

  order.status = status
  if (status === 'Delivered') {
    order.isDelivered = true
    order.deliveredAt = new Date()
  }

  order.timeline.push({
    status,
    message: STATUS_MESSAGES[status],
    updatedBy: shipperId,
    role: 'shipper'
  })

  await order.save()
  return order
}

const userConfirmReceived = async (orderId, userId) => {
  const order = await orderModel.findOne({
    _id: orderId,
    user: userId,
    status: 'Delivered'
  })
  if (!order) return null

  order.status = 'Confirmed'
  order.timeline.push({
    status: 'Confirmed',
    message: STATUS_MESSAGES['Confirmed'],
    updatedBy: userId,
    role: 'user'
  })

  await order.save()
  return order
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

  const [awaiting, shipping, delivered] = await Promise.all([
    orderModel.countDocuments({ status: 'AwaitingConfirmation' }),
    orderModel.countDocuments({ status: { $in: ['PickedUp', 'InTransit', 'OutForDelivery'] } }),
    orderModel.countDocuments({ status: 'Delivered' })
  ])

  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
    statusCount: { awaiting, shipping, delivered }
  }
}

// ===================== SERVICE =====================
export const orderService = {
  getAllOrders,
  updateOrderStatus,
  assignShipper,
  getShipperOrders,
  shipperUpdateStatus,
  userConfirmReceived,
  deleteOrder,
  getOrderById,
  getOrdersByUser,
  getOrderStats
}
