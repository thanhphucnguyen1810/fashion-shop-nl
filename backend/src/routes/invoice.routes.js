import express from 'express'
import { generateInvoice, getInvoiceByOrder } from '~/controllers/invoice.controller.js'

const router = express.Router()

// Tạo hóa đơn cho đơn hàng
router.post('/:orderId', generateInvoice)

// Lấy hóa đơn theo order
router.get('/:orderId', getInvoiceByOrder)

export default router
