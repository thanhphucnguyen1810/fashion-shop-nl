import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import { upload } from '~/middlewares/uploadProduct.middleware'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '~/controllers/admin/admin.product.controller'

const router = express.Router()

router.get('/', protect, admin, getAllProducts)
router.post('/', protect, admin, upload.array('images', 10), createProduct)
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router
