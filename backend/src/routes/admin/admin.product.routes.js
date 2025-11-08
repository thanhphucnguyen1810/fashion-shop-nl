import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '~/controllers/admin/product.admin.controller.js'

const router = express.Router()

router.get('/', protect, admin, getAllProducts)
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router
