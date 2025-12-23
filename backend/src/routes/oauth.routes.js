// src/routes/oauth.routes.js
import express from 'express'
import passport from 'passport'
import { socialLogin } from '~/controllers/user.controller.js'
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
  socialLogin
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
  socialLogin
)

export default router
