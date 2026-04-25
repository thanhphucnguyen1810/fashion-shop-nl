import express from 'express'
import { protect } from '~/middlewares/auth.middleware.js'
import { getMyOrders, getOrderById } from '~/controllers/order.controller.js'
import { userController } from '~/controllers/user.controller'


const orderRoutes = express.Router()

orderRoutes.get('/my-orders', protect, getMyOrders)
orderRoutes.get('/:orderId', protect, getOrderById)
orderRoutes.put('/:orderId/confirm-received', protect, userController.userConfirmReceived)

export default orderRoutes
