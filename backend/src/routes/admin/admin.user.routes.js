import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '~/controllers/admin/admin.user.controller.js'

const router = express.Router()

router.get('/', protect, admin, getAllUsers)
router.post('/', protect, admin, createUser)
router.put('/:id', protect, admin, updateUser)
router.delete('/:id', protect, admin, deleteUser)

export default router
