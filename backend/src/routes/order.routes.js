import express from 'express'
import { protect } from '~/middlewares/auth.middleware.js'
import { getMyOrders, getOrderById, createCheckoutOrder } from '~/controllers/order.controller.js'

const orderRoutes = express.Router()

orderRoutes.post('/buy-now', createCheckoutOrder)
orderRoutes.get('/my-orders', protect, getMyOrders)
orderRoutes.get('/:orderId', protect, getOrderById)

export default orderRoutes
