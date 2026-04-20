import { orderService } from '~/services/admin/admin.order.service'

// @desc Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders(req.query)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const updated = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    )

    if (!updated) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Delete order
export const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id)

    if (!result) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    console.log(order.shippingAddress)

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get orders by user
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Stats
export const getOrderStats = async (req, res) => {
  try {
    const stats = await orderService.getOrderStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}
