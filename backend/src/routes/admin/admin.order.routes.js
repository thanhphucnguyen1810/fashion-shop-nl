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

const router = express.Router()

// Lấy đơn hàng theo user
router.get('/user/:userId', protect, admin, getOrdersByUser)

// Lấy danh sách đơn hàng
router.get('/', protect, admin, getAllOrders)

// Lấy thống kê đơn hàng (Dashboard)
router.get('/stats', protect, admin, getOrderStats)

// Xem chi tiết 1 đơn hàng: /api/admin/users
router.get('/:id', protect, admin, getOrderById)

// Cập nhật trạng thái đơn hàng
router.put('/:id', protect, admin, updateOrderStatus)

// Xóa đơn hàng
router.delete('/:id', protect, admin, deleteOrder)

export default router

