import express from 'express'
import {
  getProducts,
  getBestSeller,
  getNewArrivals,
  getProductById,
  getSimilarProducts,
  getVariants,
  upsertVariant,
  deleteVariant,
  deleteSize,
  updateStock
} from '~/controllers/product.controller.js'


const router = express.Router()

router.get('/', getProducts)
router.get('/best-seller', getBestSeller)
router.get('/new-arrivals', getNewArrivals)
router.get('/similar/:id', getSimilarProducts)

router.get('/:id/variants', getVariants)
router.put('/:id/variants', upsertVariant)
router.delete('/:id/variants/:variantId', deleteVariant)
router.delete('/:id/variants/:variantId/sizes/:sizeId', deleteSize)
router.patch('/:id/variants/:variantId/sizes/:sizeId/stock', updateStock)

router.get('/:id', getProductById)

export default router
