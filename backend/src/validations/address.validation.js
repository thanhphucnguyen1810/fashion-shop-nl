import Joi from 'joi'

const objectIdRule = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID địa chỉ không hợp lệ'
})

const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/

export const addressValidation = {
  addAddress: Joi.object({
    name: Joi.string().min(2).max(50).required().trim().messages({
      'string.empty': 'Tên người nhận không được để trống'
    }),
    phone: Joi.string().regex(phoneRegex).required().messages({
      'string.pattern.base': 'Số điện thoại không đúng định dạng Việt Nam (10 số)'
    }),
    street: Joi.string().required().trim().messages({
      'string.empty': 'Địa chỉ cụ thể không được để trống'
    }),
    province: Joi.string().required().messages({
      'string.empty': 'Vui lòng chọn Tỉnh/Thành phố'
    }),
    district: Joi.string().required().messages({
      'string.empty': 'Vui lòng chọn Quận/Huyện'
    }),
    ward: Joi.string().required().messages({
      'string.empty': 'Vui lòng chọn Phường/Xã'
    })
  }),

  updateAddress: Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    phone: Joi.string().regex(phoneRegex),
    street: Joi.string().trim(),
    province: Joi.string(),
    district: Joi.string(),
    ward: Joi.string()
  }).min(1),

  paramsId: Joi.object({
    id: objectIdRule.required()
  })
}
