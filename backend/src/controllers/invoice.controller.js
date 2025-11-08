import Order from '~/models/order.model.js'
import Invoice from '~/models/invoice.model.js'

// Tạo hóa đơn khi đơn đã giao hoặc thanh toán
export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user')
    if (!order) return res.status(404).json({ message: 'Order not found' })

    // Kiểm tra trạng thái đơn
    if (order.status !== 'Delivered' && order.paymentMethod === 'COD') {
      return res.status(400).json({ message: 'Chưa thể tạo hóa đơn' })
    }

    // Nếu đã có hóa đơn rồi thì trả về luôn
    if (order.invoice) {
      const invoice = await Invoice.findById(order.invoice)
      return res.json(invoice)
    }

    const invoiceData = {
      order: order._id,
      user: order.user._id,
      items: order.items.map(i => ({
        product: i.name,
        quantity: i.quantity,
        price: i.price
      })),
      totalPrice: order.totalPrice
    }

    const invoice = await Invoice.create(invoiceData)

    // Lưu reference hóa đơn vào order
    order.invoice = invoice._id
    await order.save()

    res.status(201).json(invoice)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Lấy hóa đơn theo orderId
export const getInvoiceByOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
    if (!order || !order.invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    const invoice = await Invoice.findById(order.invoice).populate('user')
    res.json(invoice)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
