import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/order.service'

export const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getMyOrders(req.user._id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const result = await orderService.getOrderById(req.params.orderId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const createCheckoutOrder = async (req, res, next) => {
  try {
    const result = await orderService.createCheckoutOrder(req.body)

    res.status(StatusCodes.CREATED).json({
      message: 'Đơn hàng được tạo thành công.',
      checkout: result
    })
  } catch (error) {
    next(error)
  }
}
