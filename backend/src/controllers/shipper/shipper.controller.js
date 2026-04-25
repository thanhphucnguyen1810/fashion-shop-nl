import { orderService } from '~/services/admin/admin.order.service'

export const getMyShipperOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getShipperOrders(req.user._id)
    res.json(orders)
  } catch (err) { next(err) }
}

export const shipperUpdateStatus = async (req, res, next) => {
  try {
    const order = await orderService.shipperUpdateStatus(
      req.params.orderId, req.user._id, req.body.status
    )
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' })
    res.json({ message: 'Cập nhật thành công', order })
  } catch (err) { next(err) }
}

