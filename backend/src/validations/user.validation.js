import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// Hàm helper để tránh lặp lại code try-catch (optional nhưng sạch hơn)
const validate = async (schema, data, next, options = { abortEarly: false }) => {
  try {
    const value = await schema.validateAsync(data, options)
    Object.assign(data, value)
    next()
  } catch (error) {
    next(ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const registerSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })
  await validate(schema, req.body, next)
}

export const loginSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
  await validate(schema, req.body, next)
}

export const forgotPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
  })
  await validate(schema, req.body, next)
}

export const resetPasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required()
  })
  await validate(schema, req.body, next)
}

export const changePasswordSchema = async (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  })
  await validate(schema, req.body, next)
}

export const updateProfileSchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    gender: Joi.string().valid('male', 'female', 'other')
  })
  await validate(schema, req.body, next, { abortEarly: false, allowUnknown: true })
}

export const productIdSchema = async (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })
  // Lưu ý: cái này check ở params nên truyền req.params
  await validate(schema, req.params, next)
}
