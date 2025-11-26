import CouponModel from '../models/coupon.model'
import Cart from '../models/cart.model'

// @desc    Kiểm tra và áp dụng mã giảm giá (Logic Phía Khách hàng)
// @route   POST /api/coupons/apply
export const applyCoupon = async (req, res) => {
  const { code, userId, guestId } = req.body
  try {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true })
    if (!coupon) return res.status(404).json({ message: 'Mã giảm giá không tồn tại' })
    if (new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' })

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng.' })
    }

    // Lấy cart để kiểm tra subtotal
    const cart = await Cart.findOne({ $or: [{ user: userId }, { guestId }] })
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' })

    const subtotal = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
    if (subtotal < (coupon.minimumOrderAmount || 0))
      return res.status(400).json({
        message: `Đơn tối thiểu: ${(coupon.minimumOrderAmount || 0).toLocaleString('vi-VN')}₫`
      })

    // Tính số tiền giảm
    let discountAmount = 0
    if (coupon.discountType === 'percentage') discountAmount = (subtotal * coupon.discountValue) / 100
    else discountAmount = coupon.discountValue

    // Lưu thông tin coupon vào cart
    cart.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discountAmount
    }
    await cart.save()

    return res.json({ discountAmount, code: coupon.code })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc    Gỡ bỏ mã giảm giá khỏi giỏ hàng
// @route   POST /api/coupons/remove
export const removeCoupon = async (req, res) => {
  const { userId, guestId } = req.body
  try {
    const cart = await Cart.findOne({ $or: [{ user: userId }, { guestId }] })
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' })

    // Xóa thông tin coupon khỏi cart
    cart.coupon = undefined
    await cart.save()

    return res.json({ message: 'Mã giảm giá đã được gỡ bỏ.', newDiscountAmount: 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const getAllActiveCoupons = async (req, res) => {
  try {
    // 1. Lấy ngày hiện tại
    const now = new Date()

    // 2. Truy vấn cơ sở dữ liệu
    const coupons = await CouponModel.find({
      // Mã phải đang hoạt động
      isActive: true,

      // Mã phải chưa hết hạn ($gt: greater than - lớn hơn ngày hiện tại)
      expiresAt: { $gt: now },

      // Số lần đã dùng phải nhỏ hơn giới hạn sử dụng
      // $where là toán tử Mongoose/MongoDB cho phép kiểm tra bằng JavaScript
      $where: 'this.usedCount < this.usageLimit'
    })
      .select('code discountType discountValue minimumOrderAmount usageLimit usedCount expiresAt description') // Chỉ lấy các trường cần thiết
      .sort({ expiresAt: 1 }) // Sắp xếp theo ngày hết hạn sớm nhất lên trước
      .lean() // Dùng .lean() để tăng tốc độ truy vấn (trả về JSON thuần)

    // 3. Phản hồi thành công
    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    })

  } catch (error) {
    // 4. Phản hồi lỗi
    console.error('Lỗi khi lấy danh sách voucher:', error)
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ nội bộ khi lấy voucher.'
    })
  }
}
