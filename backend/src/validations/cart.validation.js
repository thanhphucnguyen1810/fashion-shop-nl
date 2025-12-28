import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID sản phẩm không hợp lệ'
})

export const cartValidation = {
  // Dùng chung cho cả Add và Update
  cartAction: Joi.object({
    productId: objectIdRule.required(),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.min': 'Số lượng phải ít nhất là 1',
      'number.base': 'Số lượng phải là một con số'
    }),
    size: Joi.string().required().messages({ 'string.empty': 'Vui lòng chọn size' }),
    color: Joi.string().required().messages({ 'string.empty': 'Vui lòng chọn màu' }),
    userId: Joi.string().allow(null, ''),
    guestId: Joi.string().allow(null, '')
  }).or('userId', 'guestId').messages({
    'object.missing': 'Phải có userId hoặc guestId để xác định giỏ hàng'
  }),

  removeFromCart: Joi.object({
    productId: objectIdRule.required(),
    size: Joi.string().required(),
    color: Joi.string().required(),
    userId: Joi.string().allow(null, ''),
    guestId: Joi.string().allow(null, '')
  }).or('userId', 'guestId'),

  mergeCart: Joi.object({
    guestId: Joi.string().required().messages({
      'string.empty': 'Thiếu guestId để thực hiện gộp giỏ hàng'
    })
  })
}
