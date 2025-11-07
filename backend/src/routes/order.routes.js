import express from 'express'
import { protect } from '~/middlewares/auth.middleware.js'
import { getMyOrders, getOrderById } from '~/controllers/order.controller.js'

const orderRoutes = express.Router()

orderRoutes.get('/my-orders', protect, getMyOrders)
orderRoutes.get('/:id', protect, getOrderById)

export default orderRoutes
