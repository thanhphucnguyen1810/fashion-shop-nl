import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getOrderStats,
  getOrdersByUser
} from '~/controllers/admin/admin.order.controller'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()

router.use(protect, admin)

router.get('/user/:userId', getOrdersByUser)
router.get('/stats', getOrderStats)

router.get('/', getAllOrders)
router.get('/:id', getOrderById)

router.put('/:id', logSecurity('UPDATE_ORDER_STATUS'), updateOrderStatus)
router.delete('/:id', logSecurity('DELETE_ORDER'), deleteOrder)

export default router
