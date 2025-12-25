import express from 'express'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '~/controllers/category.controller.js'

import { protect, admin } from '~/middlewares/auth.middleware.js'
import { upload } from '~/middlewares/upload.middleware'

const router = express.Router()

import { logSecurity } from '~/middlewares/logger.middleware'

router.get('/', getCategories)

router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  logSecurity('ADMIN_CREATE_CATEGORY'),
  createCategory
)

router.patch(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  logSecurity('ADMIN_UPDATE_CATEGORY'),
  updateCategory
)

router.delete(
  '/:id',
  protect,
  admin,
  logSecurity('ADMIN_DELETE_CATEGORY'),
  deleteCategory
)

export default router

