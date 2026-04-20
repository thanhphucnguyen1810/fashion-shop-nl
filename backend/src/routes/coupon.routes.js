import express from 'express'
import { couponController } from '~/controllers/coupon.controller'
import { validateRequest } from '~/middlewares/validation.middleware'
import { couponValidation } from '~/validations/coupon.validation'

const router = express.Router()

router.post(
  '/apply',
  validateRequest(couponValidation.applyCoupon),
  couponController.applyCoupon
)

router.post(
  '/remove',
  validateRequest(couponValidation.removeCoupon),
  couponController.removeCoupon
)

router.get('/active', couponController.getAllActiveCoupons)

export default router
