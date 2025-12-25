import express from 'express'
import { generateInvoice, getInvoiceByOrder } from '~/controllers/invoice.controller.js'
import { logSecurity } from '~/middlewares/logger.middleware'

const router = express.Router()


router.post(
  '/:orderId',
  logSecurity('CREATE_INVOICE'),
  generateInvoice
)

router.get(
  '/:orderId',
  logSecurity('VIEW_INVOICE'),
  getInvoiceByOrder
)


export default router
