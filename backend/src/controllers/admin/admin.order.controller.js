import { orderService } from '~/services/admin/admin.order.service'

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders(req.query)
    res.json(orders)
  } catch (error) { next(error) }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      req.body.status,
      req.user._id
    )
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })

    res.json({ message: 'Cập nhật trạng thái thành công', order })
  } catch (err) { next(err) }
}

export const assignShipper = async (req, res, next) => {
  try {
    const order = await orderService.assignShipper(
      req.params.orderId, req.body.shipperId, req.user._id
    )
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    res.json({ message: 'Phân công shipper thành công', order })
  } catch (err) { next(err) }
}

export const deleteOrder = async (req, res, next) => {
  try {
    const result = await orderService.deleteOrder(req.params.orderId)
    if (!result) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    res.json({ message: 'Đã xóa đơn hàng' })
  } catch (err) { next(err) }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId || req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const getOrdersByUser = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId)
    res.json(orders)
  } catch (error) {next(error)}
}

export const getOrderStats = async (req, res) => {
  try {
    const stats = await orderService.getOrderStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}
