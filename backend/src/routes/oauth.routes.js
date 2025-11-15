// src/routes/oauth.routes.js
import express from 'express'
import passport from 'passport'
import { socialLogin } from '~/controllers/user.controller.js'

const router = express.Router()

// ================= GOOGLE LOGIN ==================
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  socialLogin
)

// ================= FACEBOOK LOGIN ==================
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  socialLogin
)

export default router
