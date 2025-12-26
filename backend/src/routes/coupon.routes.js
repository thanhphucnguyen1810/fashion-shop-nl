import express from 'express'
import {
  applyCoupon,
  removeCoupon,
  getAllActiveCoupons
} from '~/controllers/coupon.controller'
import { validateRequest } from '~/middlewares/validation.middleware'
import { couponValidation } from '~/validations/coupon.validation'

const router = express.Router()

// --- Customer apply coupon ---
router.post('/apply', validateRequest(couponValidation.applyCoupon), applyCoupon)

// --- Customer remove coupon ---
router.post('/remove', validateRequest(couponValidation.removeCoupon), removeCoupon)

router.get('/active', getAllActiveCoupons)

export default router
