import express from 'express'
import {
  applyCoupon,
  removeCoupon,
  getAllActiveCoupons
} from '~/controllers/coupon.controller'

const router = express.Router()

// --- Customer apply coupon ---
router.post('/apply', applyCoupon)

// --- Customer remove coupon ---
router.post('/remove', removeCoupon)

router.get('/active', getAllActiveCoupons)

export default router
