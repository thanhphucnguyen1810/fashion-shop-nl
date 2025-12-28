
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query
    }

    const { error } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: true
    })

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message)
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: errorMessages
      })
    }
    next()
  }
}
