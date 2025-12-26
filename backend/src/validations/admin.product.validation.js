import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID sản phẩm không hợp lệ'
})

export const adminProductValidation = {
  createProduct: Joi.object({
    name: Joi.string().min(3).max(200).required().trim().messages({
      'string.empty': 'Tên sản phẩm không được để trống',
      'string.min': 'Tên sản phẩm phải có ít nhất 3 ký tự'
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Mô tả sản phẩm không được để trống'
    }),
    price: Joi.number().min(0).required().messages({
      'number.min': 'Giá sản phẩm không được âm',
      'any.required': 'Vui lòng nhập giá sản phẩm'
    }),
    countInStock: Joi.number().integer().min(0).required().messages({
      'number.min': 'Tồn kho không được âm',
      'number.integer': 'Tồn kho phải là số nguyên'
    }),
    sku: Joi.string().required().uppercase().trim().messages({
      'string.empty': 'Mã SKU là bắt buộc'
    }),
    category: Joi.string().required(),
    sizes: Joi.array().items(Joi.string().trim()),
    colors: Joi.array().items(Joi.string().trim()),
    collections: Joi.string().allow(null, '')
  }),

  // Các trường đều là optional nhưng nếu gửi thì phải đúng định dạng
  updateProduct: Joi.object({
    name: Joi.string().min(3).max(200).trim(),
    description: Joi.string(),
    price: Joi.number().min(0),
    countInStock: Joi.number().integer().min(0),
    sku: Joi.string().uppercase().trim(),
    category: Joi.string(),
    sizes: Joi.array().items(Joi.string().trim()),
    colors: Joi.array().items(Joi.string().trim()),
    collections: Joi.string().allow(null, '')
  }).min(1),

  paramsId: Joi.object({
    id: objectIdRule.required()
  })
}
