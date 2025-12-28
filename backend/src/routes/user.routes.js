import express from 'express'
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  updateUserProfile,
  addFavorite,
  removeFavorite
} from '~/controllers/user.controller'
import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'
import { validateRequest } from '~/middlewares/validation.middleware'
import {
  registerSchema, loginSchema, resetPasswordSchema,
  updateProfileSchema, productIdSchema,
  forgotPasswordSchema, changePasswordSchema
} from '~/validations/user.validation'

import multer from 'multer'
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

// AUTH ROUTES
router.post('/register', validateRequest(registerSchema), logSecurity('REGISTER'), registerUser)
router.post('/login', validateRequest(loginSchema), logSecurity('LOGIN'), loginUser)


router.post(
  '/forgotPassword',
  validateRequest(forgotPasswordSchema),
  logSecurity('RESET_PASSWORD'),
  forgotPassword
)

router.patch('/resetPassword/:token', validateRequest(resetPasswordSchema), logSecurity('RESET_PASSWORD'), resetPassword)

router.put(
  '/change-password',
  protect,
  validateRequest(changePasswordSchema),
  logSecurity('CHANGE_PASSWORD'),
  changePassword
)

router.get('/verify-email/:token', verifyEmail)

router.get('/profile', protect, getUserProfile)
router.put(
  '/profile',
  protect,
  upload.single('avatar'),
  validateRequest(updateProfileSchema),
  logSecurity('UPDATE_PROFILE'),
  updateUserProfile
)

router.post('/favorites/:productId', protect, (req, res, next) => {
  const { error } = productIdSchema.validate(req.params)
  if (error) return res.status(400).json({ message: error.details[0].message })
  next()
}, addFavorite)

router.delete('/favorites/:productId', protect, (req, res, next) => {
  const { error } = productIdSchema.validate(req.params)
  if (error) return res.status(400).json({ message: error.details[0].message })
  next()
}, removeFavorite)

export default router
