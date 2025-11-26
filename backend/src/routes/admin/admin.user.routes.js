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

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Base Route: /api/admin/users
router.route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, upload.single('avatar'), createUser)

// ID Route: /api/admin/users/:id
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)

// Status Route: /api/admin/users/:id/status
router.route('/:id/status')
  .patch(protect, admin, toggleUserStatus)

export default router
