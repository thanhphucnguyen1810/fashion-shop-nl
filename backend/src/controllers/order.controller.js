import orderModel from '~/models/order.model.js'

// @desc Get logged-in user's orders
// @route GET /api/orders/my-orders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get order details by ID
// @route GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}
