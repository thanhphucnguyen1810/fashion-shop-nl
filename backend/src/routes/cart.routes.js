import express from 'express'
import { protect } from '~/middlewares/auth.middleware'
import { cartController } from '~/controllers/cart.controller'
import { cartValidation } from '~/validations/cart.validation'

const router = express.Router()

// ADD / UPDATE / DELETE
router.post('/', cartValidation.addToCart, cartController.addToCart)

router.put('/', cartValidation.updateCart, cartController.updateCart)

router.delete('/', cartValidation.removeFromCart, cartController.removeFromCart)

// GET CART
router.get('/', cartValidation.getCart, cartController.getCartDetails)

// MERGE CART
router.post(
  '/merge',
  protect,
  cartValidation.mergeCart,
  cartController.mergeGuestCart
)

export default router
