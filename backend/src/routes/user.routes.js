import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateUserProfile,
  addFavorite,
  removeFavorite
} from '~/controllers/user.controller'
import { protect } from '~/middlewares/auth.middleware'

import { logSecurity } from '~/middlewares/logger.middleware'

import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/register', logSecurity('REGISTER'), registerUser)
router.post('/login', logSecurity('LOGIN'), loginUser)
router.post('/forgotPassword', logSecurity('RESET_PASSWORD'), forgotPassword)
router.patch('/resetPassword/:token', logSecurity('RESET_PASSWORD'), resetPassword)
router.get('/verify-email/:token', verifyEmail)

router.get('/profile', protect, getUserProfile)
router.put(
  '/profile',
  protect,
  upload.single('avatar'),
  logSecurity('UPDATE_PROFILE'),
  updateUserProfile
)

router.post('/favorites/:productId', protect, addFavorite)
router.delete('/favorites/:productId', protect, removeFavorite)


export default router


