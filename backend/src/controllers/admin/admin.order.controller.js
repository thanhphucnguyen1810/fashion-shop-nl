import orderModel from '~/models/order.model.js'

// @desc Get all orders (Admin only)
// @route GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query
    let filter = {}
    if (userId) { filter.user = userId }

    if (status) { filter.status = status }

    const orders = await orderModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('orderItems.productId', 'name price images')
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Update order status
// @route PUT /api/admin/orders/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await orderModel.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status || order.status

    // Chỉ cập nhật deliveredAt nếu trạng thái chuyển sang 'Delivered'
    if (status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = Date.now()
    }

    // Loại bỏ deliveredAt nếu trạng thái thay đổi ngược lại
    if (status !== 'Delivered' && order.deliveredAt) {
      order.deliveredAt = undefined
    }

    const updatedOrder = await order.save()
    // Populate lại trường user trước khi gửi về client để Redux có thể cập nhật
    await updatedOrder.populate('user', 'name email')

    res.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Delete an order (Admin only)
// @route DELETE /api/admin/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    await order.deleteOne()
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Khi bấm vào một đơn hàng xem đầy đủ thông tin
// @route GET /api/admin/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.productId', 'name price images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get orders of a specific user
// @route GET /api/admin/orders/user/:userId
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('orderItems.productId', 'name price images')

    res.json(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @route GET /api/admin/orders/stats
//dùng để hiển thị: tổng doanh thu, tổng đơn hàng, biểu đồ…
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments()
    const totalRevenue = await orderModel.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])

    const pending = await orderModel.countDocuments({ status: 'Pending' })
    const processing = await orderModel.countDocuments({ status: 'Processing' })
    const delivered = await orderModel.countDocuments({ status: 'Delivered' })

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCount: { pending, processing, delivered }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

