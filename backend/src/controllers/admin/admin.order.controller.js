import orderModel from '~/models/order.model.js'

// @desc Get all orders (Admin only)
// @route GET /api/admin/orders
// @access Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate('user', 'name email')
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Update order status
// @route PUT /api/admin/orders/:id
// @access Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = req.body.status || order.status
    order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered
    order.deliveredAt =
      req.body.status === 'Delivered' ? Date.now() : order.deliveredAt

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Delete an order (Admin only)
// @route DELETE /api/admin/orders/:id
// @access Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    await order.deleteOne()
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}
