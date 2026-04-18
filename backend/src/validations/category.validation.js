import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// helper giống user validation của bạn
const validate = async (schema, data, next, options = { abortEarly: false }) => {
  try {
    const value = await schema.validateAsync(data, options)
    Object.assign(data, value)
    next()
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        new Error(error).message
      )
    )
  }
}

// ================= CREATE CATEGORY =================
export const createCategorySchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required().trim().messages({
      'string.empty': 'Tên danh mục không được để trống',
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự',
      'string.max': 'Tên danh mục không được quá 30 ký tự'
    })
  })

  await validate(schema, req.body, next)
}

// ================= UPDATE CATEGORY =================
export const updateCategorySchema = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).trim()
  })

  await validate(schema, req.body, next, {
    abortEarly: false,
    allowUnknown: true
  })
}

// ================= DELETE CATEGORY =================
export const deleteCategorySchema = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'ID danh mục không hợp lệ'
      })
  })

  await validate(schema, req.params, next)
}
