import { StatusCodes } from 'http-status-codes'
import { cartService } from '~/services/cart.service'

// ADD
const addToCart = async (req, res, next) => {
  try {
    const result = await cartService.addToCart(req.body)
    res.status(result.statusCode).json(result.cart)
  } catch (error) { next(error) }
}

// UPDATE
const updateCart = async (req, res, next) => {
  try {
    const result = await cartService.updateCart(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// REMOVE
const removeFromCart = async (req, res, next) => {
  try {
    const result = await cartService.removeFromCart(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// GET
const getCartDetails = async (req, res, next) => {
  try {
    const result = await cartService.getCartDetails(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// MERGE
const mergeGuestCart = async (req, res, next) => {
  try {
    const result = await cartService.mergeGuestCart(req.body.guestId, req.user)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const cartController = {
  addToCart,
  updateCart,
  removeFromCart,
  getCartDetails,
  mergeGuestCart
}
