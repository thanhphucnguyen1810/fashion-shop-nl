import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  socialLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateUserProfile,
  addFavorite,
  removeFavorite
} from '~/controllers/user.controller'
import { protect } from '~/middlewares/auth.middleware'

import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.get('/verify-email/:token', verifyEmail)

router.get('/profile', protect, getUserProfile)
router.put(
  '/profile',
  protect,
  upload.single('avatar'),
  updateUserProfile
)

router.post('/favorites/:productId', protect, addFavorite)
router.delete('/favorites/:productId', protect, removeFavorite)


export default router


