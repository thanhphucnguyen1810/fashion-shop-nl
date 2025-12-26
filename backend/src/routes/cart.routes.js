import express from 'express'
import { protect } from '~/middlewares/auth.middleware'
import {
  addToCart,
  updateCart,
  removeFromCart,
  getCartDetails,
  mergeGuestCart
} from '~/controllers/cart.controller'
import { validateRequest } from '~/middlewares/validation.middleware'
import { cartValidation } from '~/validations/cart.validation'

const router = express.Router()

router.post('/', validateRequest(cartValidation.cartAction), addToCart)
router.put('/', validateRequest(cartValidation.cartAction), updateCart)
router.delete('/', validateRequest(cartValidation.removeFromCart), removeFromCart)

router.get('/', (req, res, next) => {
  const { error } = Joi.object({
    userId: Joi.string().allow(''),
    guestId: Joi.string().allow('')
  }).or('userId', 'guestId').validate(req.query)

  if (error) return res.status(400).json({ message: 'Thiếu định danh giỏ hàng' })
  next()
}, getCartDetails)

router.post('/merge', protect, validateRequest(cartValidation.mergeCart), mergeGuestCart)

export default router
