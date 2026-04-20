import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// ADD TO CART
const addToCart = async (req, res, next) => {
  const correctCondition = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    sku: Joi.string().required(),
    guestId: Joi.string().allow('', null),
    userId: Joi.string().allow('', null)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// UPDATE CART
const updateCart = async (req, res, next) => {
  const correctCondition = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    guestId: Joi.string().allow('', null),
    userId: Joi.string().allow('', null)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// REMOVE
const removeFromCart = async (req, res, next) => {
  const correctCondition = Joi.object({
    productId: Joi.string().required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    guestId: Joi.string().allow('', null),
    userId: Joi.string().allow('', null)
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// GET CART
const getCart = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().allow('', null),
    guestId: Joi.string().allow('', null)
  })

  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const mergeCart = async (req, res, next) => {
  const correctCondition = Joi.object({
    guestId: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const cartValidation = {
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  mergeCart
}
