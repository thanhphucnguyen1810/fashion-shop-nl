import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID người dùng không hợp lệ'
})

export const couponValidation = {
  applyCoupon: Joi.object({
    code: Joi.string().uppercase().required().trim().messages({
      'string.empty': 'Vui lòng nhập mã giảm giá'
    }),
    userId: objectIdRule.allow(null, ''),
    guestId: Joi.string().allow(null, '')
  }).or('userId', 'guestId').messages({
    'object.missing': 'Phải có thông tin người dùng hoặc khách (guestId)'
  }),

  removeCoupon: Joi.object({
    userId: objectIdRule.allow(null, ''),
    guestId: Joi.string().allow(null, '')
  }).or('userId', 'guestId')
}