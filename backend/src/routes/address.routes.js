import express from 'express'
import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import { addressValidation } from '~/validations/address.validation'
import { addressController } from '~/controllers/address.controller'

const router = express.Router()

router.route('/')
  .get(protect, addressController.getAddresses)
  .post(
    protect,
    validateRequest(addressValidation.addAddress),
    logSecurity('ADD_ADDRESS'),
    addressController.addAddress
  )

router.route('/:id')
  .put(
    protect,
    validateRequest(addressValidation.paramsId, 'params'),
    validateRequest(addressValidation.updateAddress),
    logSecurity('UPDATE_ADDRESS'),
    addressController.updateAddress
  )
  .delete(
    protect,
    validateRequest(addressValidation.paramsId, 'params'),
    logSecurity('DELETE_ADDRESS'),
    addressController.deleteAddress
  )

router.put(
  '/default/:id',
  protect,
  validateRequest(addressValidation.paramsId, 'params'),
  logSecurity('SET_DEFAULT_ADDRESS'),
  addressController.setDefaultAddress
)

export default router
