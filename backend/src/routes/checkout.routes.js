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
