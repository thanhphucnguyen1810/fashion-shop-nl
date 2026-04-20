import express from 'express'
import multer from 'multer'

import {
  userController
} from '~/controllers/user.controller'

import { protect } from '~/middlewares/auth.middleware'
import { logSecurity } from '~/middlewares/logger.middleware'

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  productIdSchema
} from '~/validations/user.validation'

const Router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// ================= AUTH =================
Router.route('/register')
  .post(
    registerSchema,
    logSecurity('REGISTER'),
    userController.registerUser
  )

Router.route('/login')
  .post(
    loginSchema,
    logSecurity('LOGIN'),
    userController.loginUser
  )

Router.route('/logout')
  .delete(userController.logout)

Router.route('/verify-email/:token')
  .get(
    logSecurity('VERIFY_EMAIL'),
    userController.verifyEmail
  )

Router.route('/auth/social/callback')
  .get(
    logSecurity('SOCIAL_LOGIN'),
    userController.socialLogin
  )

Router.route('/refresh-token')
  .get(
    userController.refreshToken
  )

// ================= PASSWORD =================
Router.route('/forgot-password')
  .post(
    forgotPasswordSchema,
    logSecurity('FORGOT_PASSWORD'),
    userController.forgotPassword
  )

Router.route('/reset-password/:token')
  .post(
    resetPasswordSchema,
    logSecurity('RESET_PASSWORD'),
    userController.resetPassword
  )

Router.route('/change-password')
  .put(
    protect,
    changePasswordSchema,
    logSecurity('CHANGE_PASSWORD'),
    userController.changePassword
  )

// ================= PROFILE =================
Router.route('/profile')
  .get(
    protect,
    logSecurity('GET_PROFILE'),
    userController.getUserProfile
  )
  .put(
    protect,
    upload.single('avatar'),
    updateProfileSchema,
    logSecurity('UPDATE_PROFILE'),
    userController.updateUserProfile
  )

// ================= FAVORITES =================
Router.route('/favorites/:productId')
  .post(
    protect,
    productIdSchema,
    logSecurity('ADD_FAVORITE'),
    userController.addFavorite
  )
  .delete(
    protect,
    productIdSchema,
    logSecurity('REMOVE_FAVORITE'),
    userController.removeFavorite
  )

export default Router
