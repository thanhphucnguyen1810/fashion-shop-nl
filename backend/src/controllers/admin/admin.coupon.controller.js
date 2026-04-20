import { StatusCodes } from 'http-status-codes'
import { couponService } from '~/services/admin/admin.coupon.service'

// ================= CREATE =================
const createCoupon = async (req, res, next) => {
  try {
    const result = await couponService.createCoupon(req.body)

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tạo mã giảm giá thành công.',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

// ================= GET ALL =================
const getAllCoupons = async (req, res, next) => {
  try {
    const result = await couponService.getAllCoupons()

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

// ================= GET ONE =================
const getSingleCoupon = async (req, res, next) => {
  try {
    const result = await couponService.getSingleCoupon(req.params.couponId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

// ================= UPDATE =================
const updateCoupon = async (req, res, next) => {
  try {
    const result = await couponService.updateCoupon(
      req.params.couponId,
      req.body
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật mã giảm giá thành công.',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

// ================= DELETE =================
const deleteCoupon = async (req, res, next) => {
  try {
    const result = await couponService.deleteCoupon(req.params.couponId)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa mã giảm giá thành công.',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const adminCouponController = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon
}
