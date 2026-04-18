import { StatusCodes } from 'http-status-codes'
import { invoiceService } from '~/services/invoice.service'

// ================= CREATE =================
const generateInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.generateInvoice(req.params.orderId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

// ================= GET =================
const getInvoiceByOrder = async (req, res, next) => {
  try {
    const result = await invoiceService.getInvoiceByOrder(req.params.orderId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const invoiceController = {
  generateInvoice,
  getInvoiceByOrder
}
