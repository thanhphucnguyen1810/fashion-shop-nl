import express from 'express'
import { protect } from '~/middlewares/auth.middleware.js'
import {
  createCheckout,
  updatePaymentStatus,
  finalizeCheckout
} from '~/controllers/checkout.controller.js'

const router = express.Router()

router.post('/', protect, createCheckout)
router.put('/:id/pay', protect, updatePaymentStatus)
router.post('/:id/finalize', protect, finalizeCheckout)

export default router
