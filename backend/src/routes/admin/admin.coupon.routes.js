import express from 'express'
import { adminCouponController } from '~/controllers/admin/admin.coupon.controller'
import { protect, admin } from '~/middlewares/auth.middleware'

const router = express.Router()

router.use(protect, admin)

router
  .route('/')
  .post(adminCouponController.createCoupon)
  .get(adminCouponController.getAllCoupons)

router
  .route('/:couponId')
  .get(adminCouponController.getSingleCoupon)
  .put(adminCouponController.updateCoupon)
  .delete(adminCouponController.deleteCoupon)


export default router