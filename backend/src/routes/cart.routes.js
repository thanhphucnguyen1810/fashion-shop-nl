import express from 'express'
import { protect } from '~/middlewares/auth.middleware'
import {
  addToCart,
  updateCart,
  removeFromCart,
  getCartDetails,
  mergeGuestCart
} from '~/controllers/cart.controller'

const router = express.Router()

router.post('/', addToCart)
router.put('/', updateCart)
router.delete('/', removeFromCart)
router.get('/', getCartDetails)
router.post('/merge', protect, mergeGuestCart)

export default router
