import Order from '~/models/order.model.js'
import Invoice from '~/models/invoice.model.js'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// ================= CREATE INVOICE =================
const generateInvoice = async (orderId) => {
  const order = await Order.findById(orderId).populate('user')

  if (!order) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')
  }

  // kiểm tra trạng thái
  if (order.status !== 'Delivered' && order.paymentMethod === 'COD') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Chưa thể tạo hóa đơn')
  }

  // nếu đã có invoice
  if (order.invoice) {
    const invoice = await Invoice.findById(order.invoice)
    return invoice
  }

  const invoiceData = {
    order: order._id,
    user: order.user._id,
    items: order.items.map((i) => ({
      product: i.name,
      quantity: i.quantity,
      price: i.price
    })),
    totalPrice: order.totalPrice
  }

  const invoice = await Invoice.create(invoiceData)

  order.invoice = invoice._id
  await order.save()

  return invoice
}

// ================= GET INVOICE =================
const getInvoiceByOrder = async (orderId) => {
  const order = await Order.findById(orderId)

  if (!order || !order.invoice) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invoice not found')
  }

  const invoice = await Invoice.findById(order.invoice).populate('user')

  return invoice
}

export const invoiceService = {
  generateInvoice,
  getInvoiceByOrder
}
