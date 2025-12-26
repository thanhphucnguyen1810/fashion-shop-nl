import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import { upload } from '~/middlewares/uploadProduct.middleware'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '~/controllers/admin/admin.product.controller'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import { adminProductValidation } from '~/validations/admin.product.validation'

const router = express.Router()

router.get('/', protect, admin, getAllProducts)

router.post(
  '/',
  protect,
  admin,
  upload.array('images', 10),
  validateRequest(adminProductValidation.createProduct),
  logSecurity('CREATE_PRODUCT'),
  createProduct
)

router.put(
  '/:id',
  protect,
  admin,
  upload.array('images', 10),
  validateRequest(adminProductValidation.paramsId, 'params'),
  validateRequest(adminProductValidation.updateProduct),
  logSecurity('UPDATE_PRODUCT'),
  updateProduct
)

router.delete(
  '/:id',
  protect,
  admin,
  validateRequest(adminProductValidation.paramsId, 'params'),
  logSecurity('DELETE_PRODUCT'),
  deleteProduct
)

export default router
