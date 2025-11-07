import express from 'express'
import { handleSubscription } from '~/controllers/subscribe.controller'
const router = express.Router()

// @route POST /api/subscribe
router.post('/', handleSubscription)

export default router
