import express from 'express'
import { protect } from '~/middlewares/auth.middleware.js'
import {
  createCheckout,
  getSepayQrInfo,
  checkPaymentStatus,
  sepayIpn,
  getCheckoutDetail,
  finalizeOrder
} from '~/controllers/checkout.controller.js'

import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()

router.post('/create', protect, logSecurity('CHECKOUT_CREATE'), createCheckout)
router.get('/:id', protect, getCheckoutDetail)
router.post('/finalize/:checkoutId', protect, logSecurity('CHECKOUT_FINALIZE'), finalizeOrder)

router.get('/sepay-qr/:id', protect, getSepayQrInfo) // Lấy ảnh QR
router.get('/sepay-status/:id', protect, checkPaymentStatus) // Check trạng thái

router.post('/sepay/ipn', logSecurity('PAYMENT_WEBHOOK'), sepayIpn) // Webhook


export default router

/*
  - sử dụng cơ chế webhook (IPN) để tự động xác nhận tiền về.
  - B1: Khởi tạo (create checkout)
    + Khi nhấn đặt hàng, hệ thống tạo 1 bản ghi trong checkoutModel với trạng thái isPaid: false
  - B2: hiển thị QR (Get QR Info)
    + Tạo URL ảnh QR băng API của sepay
    + Nội dung chuyển khoản (transferContent) được tạo theo cú pháp DH + ObjectId.
      Đây là "chìa khóa" để hệ thống biết tiền này là của đơn hàng nào.
  - B3: Chuyển tiền
  - B4: Sepay gửi thông báo (Webhook/IPN). Khi tiền vào tk của bạn, sepay sẽ gửi một POST đến API /sepay/ipn
      1. Tách lấy ID đơn hàng
      2. Tìm đơn hàng trong checkoutModel
      3. cập nhật isPaid = true
      4. tự động tạo đơn chính thức
      5. trừ tồn kho,
  - B5: Kiểm tra trạng thái : 2-3 chạy để check, khi thành công thì chuyển trang.
*/
