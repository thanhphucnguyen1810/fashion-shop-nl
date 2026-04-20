import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID sản phẩm không hợp lệ'
})

const sizeItemSchema = Joi.object({
  size:      Joi.string().required(),
  price:     Joi.number().min(0).required(),
  stock:     Joi.number().integer().min(0).required(),
  sku:       Joi.string().required()
})

const variantSchema = Joi.object({
  color: Joi.string().required(),
  sizes: Joi.array().items(sizeItemSchema).min(1).required()
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
    price: Joi.number().min(0).messages({
      'number.min': 'Giá sản phẩm không được âm'
    }),
    sku: Joi.string().required().uppercase().trim().messages({
      'string.empty': 'Mã SKU là bắt buộc'
    }),
    category:      Joi.string().required(),
    collections:   Joi.string().allow(null, ''),
    brand:         Joi.string().allow(null, ''),
    material:      Joi.string().allow(null, ''),
    gender:        Joi.string().valid('Nam', 'Nữ', 'Unisex', 'Nam (Bé Trai)', 'Nữ (Bé Gái)'),
    disCountPrice: Joi.number().min(0).allow(null, ''),
    isFeatured:    Joi.boolean(),
    isPublished:   Joi.boolean(),
    tags:          Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string() // JSON string từ FormData
    ),
    variants: Joi.alternatives().try(
      Joi.array().items(variantSchema),
      Joi.string() // JSON string từ FormData
    )
  }),

  updateProduct: Joi.object({
    name:          Joi.string().min(3).max(200).trim(),
    description:   Joi.string(),
    price:         Joi.number().min(0),
    sku:           Joi.string().uppercase().trim(),
    category:      Joi.string(),
    collections:   Joi.string().allow(null, ''),
    brand:         Joi.string().allow(null, ''),
    material:      Joi.string().allow(null, ''),
    gender:        Joi.string().valid('Nam', 'Nữ', 'Unisex', 'Nam (Bé Trai)', 'Nữ (Bé Gái)'),
    disCountPrice: Joi.number().min(0).allow(null, ''),
    isFeatured:    Joi.boolean(),
    isPublished:   Joi.boolean(),
    tags:          Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string()
    ),
    variants: Joi.alternatives().try(
      Joi.array().items(variantSchema),
      Joi.string()
    )
  }).min(1),

  paramsId: Joi.object({
    id: objectIdRule.required()
  })
}
