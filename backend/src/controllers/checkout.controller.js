import { checkoutService } from '~/services/checkout.service.js'
import { StatusCodes } from 'http-status-codes'

const createCheckout = async (req, res, next) => {
  try {
    const result = await checkoutService.createCheckout(req.user._id, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getSepayQrInfo = async (req, res, next) => {
  try {
    const result = await checkoutService.getSepayQrInfo(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const sepayIpn = async (req, res, next) => {
  try {
    const result = await checkoutService.sepayIpn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const checkPaymentStatus = async (req, res, next) => {
  try {
    const result = await checkoutService.checkPaymentStatus(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const finalizeOrder = async (req, res, next) => {
  try {
    const result = await checkoutService.finalizeOrder(
      req.params.checkoutId,
      req.body
    )
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getCheckoutDetail = async (req, res, next) => {
  try {
    const result = await checkoutService.getCheckoutDetail(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const checkoutController = {
  createCheckout,
  getSepayQrInfo,
  sepayIpn,
  checkPaymentStatus,
  finalizeOrder,
  getCheckoutDetail
}
