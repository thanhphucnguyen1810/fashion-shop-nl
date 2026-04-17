// src/routes/oauth.routes.js
import express from 'express'
import passport from 'passport'
import { userController } from '~/controllers/user.controller'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()

// ================= GOOGLE LOGIN ==================
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  logSecurity('LOGIN_GOOGLE'),
  passport.authenticate(
    'google',
    { failureRedirect: '/login', session: false }
  ),
  userController.socialLogin
)

// ================= FACEBOOK LOGIN ==================
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

router.get(
  '/facebook/callback',
  logSecurity('LOGIN_FACEBOOK'),
  passport.authenticate(
    'facebook',
    { failureRedirect: '/login', session: false }
  ),
  userController.socialLogin
)

export default router
