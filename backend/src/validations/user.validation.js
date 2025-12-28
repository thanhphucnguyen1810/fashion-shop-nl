import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất 2 ký tự'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Email không được để trống'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
})

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim(),
  gender: Joi.string().valid('male', 'female', 'other').messages({
    'any.only': 'Giới tính không hợp lệ'
  })
}).min(1)

export const productIdSchema = Joi.object({
  productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'ID sản phẩm không đúng định dạng'
  })
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không đúng định dạng',
    'string.empty': 'Vui lòng cung cấp email để lấy lại mật khẩu'
  })
})

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu cũ'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
    'string.empty': 'Vui lòng nhập mật khẩu mới'
  })
})
