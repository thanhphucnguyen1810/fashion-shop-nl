import express from 'express'
import { adminCouponController } from '~/controllers/admin/admin.coupon.controller'
import { protect, admin } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()

router.use(protect, admin)

router
  .route('/')
  .post(
    logSecurity('ADMIN_CREATE_COUPON'),
    adminCouponController.createCoupon
  )
  .get(
    logSecurity('ADMIN_VIEW_COUPONS'),
    adminCouponController.getAllCoupons
  )

router
  .route('/:couponId')
  .get(
    adminCouponController.getSingleCoupon
  )
  .put(
    logSecurity('ADMIN_UPDATE_COUPON'),
    adminCouponController.updateCoupon
  )
  .delete(
    logSecurity('ADMIN_DELETE_COUPON'),
    adminCouponController.deleteCoupon
  )


export default router
