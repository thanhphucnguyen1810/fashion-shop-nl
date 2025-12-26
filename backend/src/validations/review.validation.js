import Joi from 'joi'
const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID không hợp lệ'
})

export const reviewValidation = {
  createReview: Joi.object({
    productId: objectIdRule.required(),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.min': 'Đánh giá thấp nhất là 1 sao',
      'number.max': 'Đánh giá cao nhất là 5 sao',
      'any.required': 'Vui lòng chọn số sao'
    }),
    comment: Joi.string().min(10).max(500).required().messages({
      'string.min': 'Nội dung đánh giá phải có ít nhất 10 ký tự',
      'string.empty': 'Vui lòng nhập nội dung đánh giá'
    })
  }),

  productIdParam: Joi.object({
    productId: objectIdRule.required()
  }),

  reviewIdParam: Joi.object({
    id: objectIdRule.required()
  })
}
