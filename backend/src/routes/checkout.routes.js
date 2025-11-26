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

const router = express.Router()

router.post('/create', protect, createCheckout)
router.get('/:id', protect, getCheckoutDetail)
router.post('/finalize/:checkoutId', protect, finalizeOrder)

router.get('/sepay-qr/:id', protect, getSepayQrInfo) // Lấy ảnh QR
router.get('/sepay-status/:id', protect, checkPaymentStatus) // Check trạng thái

router.post('/sepay/ipn', sepayIpn) // Webhook


export default router
