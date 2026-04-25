import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllOrders,
  updateOrderStatus,
  assignShipper,
  deleteOrder,
  getOrderById,
  getOrderStats,
  getOrdersByUser
} from '~/controllers/admin/admin.order.controller'
import { logSecurity } from '~/middlewares/logger.middleware'
import userModel from '~/models/user.model'

const router = express.Router()
router.use(protect, admin)

router.get('/', getAllOrders)
router.get('/stats', getOrderStats)
router.get('/user/:userId', getOrdersByUser)
router.get('/shippers/list', protect, admin, async (req, res) => {
  try {
    const shippers = await userModel.find({ role: 'shipper' }).select('name email avatar')
    res.json(shippers)
  } catch (error) { res.status(500).json({ message: 'Lỗi server' }) }
})

router.get('/:id', getOrderById)

router.put('/:orderId/status', logSecurity('UPDATE_ORDER_STATUS'), updateOrderStatus)
router.put('/:orderId/assign-shipper', assignShipper)
router.delete('/:id', logSecurity('DELETE_ORDER'), deleteOrder)

export default router
