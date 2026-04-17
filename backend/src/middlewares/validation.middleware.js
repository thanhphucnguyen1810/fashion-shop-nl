export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const dataToValidate = {
        ...req.body,
        ...req.params,
        ...req.query
      }

      await schema.validateAsync(dataToValidate, {
        abortEarly: false,
        allowUnknown: true
      })

      next()
    } catch (error) {
      const errorMessages = error?.details?.map(d => d.message) || [error.message]

      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: errorMessages
      })
    }
  }
}
