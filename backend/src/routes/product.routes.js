import express from 'express'
import {
  getProducts,
  getBestSeller,
  getNewArrivals,
  getProductById,
  getSimilarProducts
} from '~/controllers/product.controller.js'


const router = express.Router()

router.get('/', getProducts)
router.get('/best-seller', getBestSeller)
router.get('/new-arrivals', getNewArrivals)
router.get('/similar/:id', getSimilarProducts)
router.get('/:id', getProductById)

export default router
