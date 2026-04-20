import CouponModel from '../models/coupon.model'
import Cart from '../models/cart.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// ================= HELPERS =================
const calculateSubtotal = (cart) => {
  return cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )
}

const findCart = async (userId, guestId) => {
  return Cart.findOne({ $or: [{ user: userId }, { guestId }] })
}

// ================= APPLY COUPON =================
const applyCoupon = async ({ code, userId, guestId }) => {
  const coupon = await CouponModel.findOne({
    code: code.toUpperCase(),
    isActive: true
  })

  if (!coupon) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá không tồn tại')
  }

  if (new Date(coupon.expiresAt) < new Date()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã giảm giá đã hết hạn')
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã giảm giá đã hết lượt sử dụng')
  }

  const cart = await findCart(userId, guestId)

  if (!cart) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
  }

  const subtotal = calculateSubtotal(cart)

  if (subtotal < (coupon.minimumOrderAmount || 0)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Đơn tối thiểu: ${(coupon.minimumOrderAmount || 0).toLocaleString('vi-VN')}₫`
    )
  }

  const discountAmount =
    coupon.discountType === 'percentage'
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue

  cart.coupon = {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount
  }

  await cart.save()

  return {
    success: true,
    data: cart
  }
}

// ================= REMOVE COUPON =================
const removeCoupon = async ({ userId, guestId }) => {
  const cart = await findCart(userId, guestId)

  if (!cart) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
  }

  const subtotal = calculateSubtotal(cart)

  cart.coupon = undefined
  cart.totalPrice = subtotal

  await cart.save()

  return {
    success: true,
    data: cart
  }
}

// ================= GET ACTIVE COUPONS =================
const getAllActiveCoupons = async () => {
  const now = new Date()

  const coupons = await CouponModel.find({
    isActive: true,
    expiresAt: { $gt: now },
    $expr: { $lt: ['$usedCount', '$usageLimit'] }
  })
    .select(
      'code discountType discountValue minimumOrderAmount usageLimit usedCount expiresAt description'
    )
    .sort({ expiresAt: 1 })
    .lean()

  return {
    success: true,
    count: coupons.length,
    data: coupons
  }
}

export const couponService = {
  applyCoupon,
  removeCoupon,
  getAllActiveCoupons
}
