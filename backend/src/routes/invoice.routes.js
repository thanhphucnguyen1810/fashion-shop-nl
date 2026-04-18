import express from 'express'
import { invoiceController } from '~/controllers/invoice.controller.js'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()


router.post(
  '/:orderId',
  logSecurity('CREATE_INVOICE'),
  invoiceController.generateInvoice
)

router.get(
  '/:orderId',
  logSecurity('VIEW_INVOICE'),
  invoiceController.getInvoiceByOrder
)

export default router
