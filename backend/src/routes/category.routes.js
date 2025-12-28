import express from 'express'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '~/controllers/category.controller.js'

import { protect, admin } from '~/middlewares/auth.middleware.js'
import { upload } from '~/middlewares/upload.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import { categoryValidation } from '~/validations/category.validation'

const router = express.Router()

router.get('/', getCategories)

router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  validateRequest(categoryValidation.createCategory),
  logSecurity('ADMIN_CREATE_CATEGORY'),
  createCategory
)

router.patch(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  validateRequest(categoryValidation.updateCategory),
  logSecurity('ADMIN_UPDATE_CATEGORY'),
  updateCategory
)

router.delete(
  '/:id',
  protect,
  admin,
  validateRequest(categoryValidation.deleteCategory),
  logSecurity('ADMIN_DELETE_CATEGORY'),
  deleteCategory
)

export default router
