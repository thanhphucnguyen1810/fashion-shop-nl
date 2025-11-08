import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '~/controllers/admin/admin.order.controller'

const router = express.Router()

router.get('/', protect, admin, getAllOrders)
router.put('/:id', protect, admin, updateOrderStatus)
router.delete('/:id', protect, admin, deleteOrder)

export default router
