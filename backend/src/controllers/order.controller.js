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
    console.log(order.shippingAddress)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

