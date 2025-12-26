import express from 'express'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '~/controllers/address.controller.js'

import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import { addressValidation } from '~/validations/address.validation'

const router = express.Router()

router.route('/')
  .get(protect, getAddresses)
  .post(protect, validateRequest(addressValidation.addAddress), logSecurity('ADD_ADDRESS'), addAddress)

router.route('/:id')
  .put(
    protect,
    validateRequest(addressValidation.paramsId, 'params'),
    validateRequest(addressValidation.updateAddress),
    logSecurity('UPDATE_ADDRESS'),
    updateAddress
  )
  .delete(
    protect,
    validateRequest(addressValidation.paramsId, 'params'),
    logSecurity('DELETE_ADDRESS'),
    deleteAddress
  )

router.put(
  '/default/:id',
  protect,
  validateRequest(addressValidation.paramsId, 'params'),
  logSecurity('SET_DEFAULT_ADDRESS'),
  setDefaultAddress
)

export default router
