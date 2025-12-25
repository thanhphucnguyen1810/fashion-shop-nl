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

const router = express.Router()

router.route('/')
  .get(protect, getAddresses)
  .post(protect, logSecurity('ADD_ADDRESS'), addAddress)

router.route('/:id')
  .put(protect, logSecurity('UPDATE_ADDRESS'), updateAddress)
  .delete(protect, logSecurity('DELETE_ADDRESS'), deleteAddress)

router.put('/default/:id', protect, logSecurity('SET_DEFAULT_ADDRESS'), setDefaultAddress)

export default router
