import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getBestSeller,
  getNewArrivals,
  getProductById,
  getSimilarProducts
} from '~/controllers/product.controller.js'

const router = express.Router()

router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

router.get('/', getProducts)
router.get('/best-seller', getBestSeller)
router.get('/new-arrivals', getNewArrivals)
router.get('/:id', getProductById)
router.get('/similar/:id', getSimilarProducts)

export default router
