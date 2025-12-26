import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID người dùng không hợp lệ'
})

export const adminUserValidation = {
  createUser: Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'admin').default('customer'),
    gender: Joi.string().valid('male', 'female', 'other').default('other')
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    email: Joi.string().email().lowercase(),
    role: Joi.string().valid('customer', 'admin'),
    gender: Joi.string().valid('male', 'female', 'other')
  }).min(1),

  toggleStatus: Joi.object({
    isBlocked: Joi.boolean().required().messages({
      'any.required': 'Trạng thái isBlocked là bắt buộc',
      'boolean.base': 'isBlocked phải là kiểu đúng/sai (boolean)'
    })
  }),

  paramsId: Joi.object({
    id: objectIdRule.required()
  })
}
