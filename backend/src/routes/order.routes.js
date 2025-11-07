import express from 'express'
import orderModel from '~/models/order.model'
import { protect } from '~/middlewares/auth.middleware'

const orderRoutes = express.Router()

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
orderRoutes.get('/my-orders', protect, async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await orderModel.find({ user: req.user._id }).sort({
      createdAt: -1
    }) // sort by most recent orders
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @route GET /api/orders/:/id
// @desc vGet order details by ID
// @access Private
orderRoutes.get('/:id', protect, async(req, res) => {
  try {
    const order = await orderModel.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // return the full order details
    res.json(order)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default orderRoutes
