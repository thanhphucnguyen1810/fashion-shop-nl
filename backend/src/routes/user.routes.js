import express from 'express'
import passport from '~/config/passport.js'
import { registerUser, loginUser, getUserProfile, socialLogin } from '~/controllers/user.controller'
import { protect } from '~/middlewares/auth.middleware'
import { updateUserProfile, addFavorite, removeFavorite } from '~/controllers/user.controller.js'


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)

router.post('/favorites/:productId', protect, addFavorite)
router.delete('/favorites/:productId', protect, removeFavorite)


export default router


