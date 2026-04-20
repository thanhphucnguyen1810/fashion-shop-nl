import { StatusCodes } from 'http-status-codes'
import { couponService } from '~/services/coupon.service'

// ================= APPLY =================
const applyCoupon = async (req, res, next) => {
  try {
    const result = await couponService.applyCoupon(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// ================= REMOVE =================
const removeCoupon = async (req, res, next) => {
  try {
    const result = await couponService.removeCoupon(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// ================= GET ACTIVE =================
const getAllActiveCoupons = async (req, res, next) => {
  try {
    const result = await couponService.getAllActiveCoupons()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const couponController = {
  applyCoupon,
  removeCoupon,
  getAllActiveCoupons
}
