import express from 'express'
import multer from 'multer'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  toggleUserStatus
} from '~/controllers/admin/admin.user.controller.js'
import { validateRequest } from '~/middlewares/validation.middleware'
import { adminUserValidation } from '~/validations/admin.user.validation'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Base Route: /api/admin/users
router.route('/')
  .get(protect, admin, getAllUsers)
  .post(
    protect,
    admin,
    upload.single('avatar'),
    validateRequest(adminUserValidation.createUser),
    createUser
  )

router.route('/:id')
  .get(
    protect,
    admin,
    validateRequest(adminUserValidation.paramsId, 'params'),
    getUserById
  )
  .put(
    protect,
    admin,
    upload.single('avatar'),
    validateRequest(adminUserValidation.paramsId, 'params'),
    validateRequest(adminUserValidation.updateUser),
    updateUser
  )
  .delete(
    protect,
    admin,
    validateRequest(adminUserValidation.paramsId, 'params'),
    deleteUser
  )

router.route('/:id/status')
  .patch(
    protect,
    admin,
    validateRequest(adminUserValidation.paramsId, 'params'),
    validateRequest(adminUserValidation.toggleStatus),
    toggleUserStatus
  )

export default router
