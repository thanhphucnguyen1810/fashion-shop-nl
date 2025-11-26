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

// Lấy danh sách
router.get('/', getCategories)

// Thêm danh mục (Admin)
router.post('/', protect, admin, upload.single('image'), createCategory)

// Cập nhật danh mục (Admin)
router.patch('/:id', protect, admin, upload.single('image'), updateCategory)

// Xóa danh mục (Admin)
router.delete('/:id', protect, admin, deleteCategory)

export default router

