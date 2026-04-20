import express from 'express'
import { categoryController } from '~/controllers/category.controller.js'

import { protect, admin } from '~/middlewares/auth.middleware.js'
import { upload } from '~/middlewares/upload.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema
} from '~/validations/category.validation'

const router = express.Router()

router.get('/', categoryController.getCategories)

router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  createCategorySchema,
  logSecurity('ADMIN_CREATE_CATEGORY'),
  categoryController.createCategory
)

router.patch(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  updateCategorySchema,
  logSecurity('ADMIN_UPDATE_CATEGORY'),
  categoryController.updateCategory
)

router.delete(
  '/:id',
  protect,
  admin,
  deleteCategorySchema,
  logSecurity('ADMIN_DELETE_CATEGORY'),
  categoryController.deleteCategory
)

export default router
