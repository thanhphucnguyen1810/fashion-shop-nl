// ~/routes/shipper/shipper.routes.js ← MỚI HOÀN TOÀN
import express from 'express'
import { protect, shipper } from '~/middlewares/auth.middleware.js'
import { getMyShipperOrders, shipperUpdateStatus } from '~/controllers/shipper/shipper.controller.js'

const router = express.Router()

router.get('/orders', protect, shipper, getMyShipperOrders)
router.put('/orders/:orderId/status', protect, shipper, shipperUpdateStatus)

export default router
