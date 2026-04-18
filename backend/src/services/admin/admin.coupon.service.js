import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import CouponModel from '~/models/coupon.model'

// ================= VALIDATION LOGIC =================
const validateCouponData = (data) => {
  const { discountType, discountValue, expiresAt } = data

  if (expiresAt && new Date(expiresAt) <= new Date()) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Ngày hết hạn phải là một ngày trong tương lai.'
    )
  }

  if (discountType === 'percentage' && discountValue !== undefined) {
    if (discountValue < 1 || discountValue > 100) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Giá trị giảm phần trăm phải nằm trong khoảng 1% đến 100%.'
      )
    }
  }
}

// ================= CREATE COUPON =================
const createCoupon = async (data) => {
  const { code, expiresAt } = data

  const couponExists = await CouponModel.findOne({
    code: code.toUpperCase()
  })

  if (couponExists) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `Mã giảm giá "${code.toUpperCase()}" đã tồn tại.`
    )
  }

  validateCouponData(data)

  const newCoupon = await CouponModel.create({
    ...data,
    code: code.toUpperCase(),
    expiresAt: new Date(expiresAt)
  })

  return newCoupon
}

// ================= GET ALL =================
const getAllCoupons = async () => {
  return await CouponModel.find({}).sort({ createdAt: -1 })
}

// ================= GET SINGLE =================
const getSingleCoupon = async (couponId) => {
  const coupon = await CouponModel.findById(couponId)

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy mã giảm giá.')
  }

  return coupon
}

// ================= UPDATE =================
const updateCoupon = async (couponId, updateData) => {
  delete updateData.code
  delete updateData.usedCount

  validateCouponData(updateData)

  const updatedCoupon = await CouponModel.findByIdAndUpdate(
    couponId,
    { $set: updateData },
    { new: true, runValidators: true }
  )

  if (!updatedCoupon) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Không tìm thấy mã giảm giá để cập nhật.'
    )
  }

  return updatedCoupon
}

// ================= DELETE =================
const deleteCoupon = async (couponId) => {
  const deletedCoupon = await CouponModel.findByIdAndDelete(couponId)

  if (!deletedCoupon) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Không tìm thấy mã giảm giá để xóa.'
    )
  }

  return deletedCoupon
}

export const couponService = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon
}
