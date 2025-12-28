import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID danh mục không hợp lệ'
})

export const categoryValidation = {
  createCategory: Joi.object({
    name: Joi.string().min(2).max(30).required().trim().messages({
      'string.empty': 'Tên danh mục không được để trống',
      'string.min': 'Tên danh mục phải có ít nhất 2 ký tự',
      'string.max': 'Tên danh mục không được quá 30 ký tự'
    })
  }),

  // Validate cả Params và Body
  updateCategory: Joi.object({
    params: Joi.object({
      id: objectIdRule.required()
    }),
    body: Joi.object({
      name: Joi.string().min(2).max(30).trim()
    }).unknown(true)
  }),

  // Chỉ validate Params
  deleteCategory: Joi.object({
    params: Joi.object({
      id: objectIdRule.required()
    })
  })
}
