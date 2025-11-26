import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import CouponModel from '~/models/coupon.model'

// Hàm kiểm tra tính hợp lệ của dữ liệu trước khi tạo/cập nhật
const validateCouponData = (data) => {
  const { discountType, discountValue, expiresAt } = data

  if (expiresAt && new Date(expiresAt) <= new Date()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ngày hết hạn phải là một ngày trong tương lai.')
  }

  if (discountType === 'percentage' && discountValue !== undefined) {
    if (discountValue < 1 || discountValue > 100) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Giá trị giảm phần trăm phải nằm trong khoảng 1% đến 100%.')
    }
  }
}

// [POST] Tạo mã giảm giá mới
const createCoupon = async (req, res, next) => {
  try {
    const { code, expiresAt, ...rest } = req.body

    // 1. Kiểm tra tồn tại mã
    const couponExists = await CouponModel.findOne({ code: code.toUpperCase() })
    if (couponExists) {
      throw new ApiError(StatusCodes.CONFLICT, `Mã giảm giá "${code.toUpperCase()}" đã tồn tại.`)
    }

    // 2. Validate các trường khác
    validateCouponData(req.body)

    // 3. Tạo mới
    const newCoupon = await CouponModel.create({
      ...req.body,
      code: code.toUpperCase(), // Đảm bảo mã luôn là UPPERCASE
      expiresAt: new Date(expiresAt) // Chuyển chuỗi thành Date
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tạo mã giảm giá thành công.',
      data: newCoupon
    })
  } catch (error) {
    next(error)
  }
}

// [GET] Lấy tất cả mã giảm giá (Admin)
const getAllCoupons = async (req, res, next) => {
  try {
    // Lấy tất cả mã giảm giá, sắp xếp theo ngày tạo mới nhất
    const coupons = await CouponModel.find({}).sort({ createdAt: -1 })
    res.status(StatusCodes.OK).json({
      success: true,
      data: coupons
    })
  } catch (error) {
    next(error)
  }
}

// [GET] Lấy chi tiết một mã giảm giá
const getSingleCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params
    const coupon = await CouponModel.findById(couponId)

    if (!coupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy mã giảm giá.')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

// [PUT] Cập nhật mã giảm giá
const updateCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params
    const updateData = req.body

    // Không cho phép cập nhật code hoặc usedCount qua route này
    delete updateData.code
    delete updateData.usedCount

    // Validate dữ liệu cập nhật
    validateCouponData(updateData)

    // Cập nhật và chạy validation schema
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      couponId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedCoupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy mã giảm giá để cập nhật.')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật mã giảm giá thành công.',
      data: updatedCoupon
    })
  } catch (error) {
    next(error)
  }
}

// [DELETE] Xóa mã giảm giá
const deleteCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params
    const deletedCoupon = await CouponModel.findByIdAndDelete(couponId)

    if (!deletedCoupon) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy mã giảm giá để xóa.')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa mã giảm giá thành công.',
      data: deletedCoupon
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
