import orderModel from '~/models/order.model'
import productModel from '~/models/product.model'

// @desc Get logged-in user's orders
// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get order details by ID
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId)
      .populate('user', 'fullName email phoneNumber')
      .populate('coupon.couponId', 'code name discountType')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Create a temporary order for Buy Now action
// @route POST /api/orders/buy-now
export const createCheckoutOrder = async (req, res) => {
  try {
    const { orderItems, userId, guestId, shippingAddress, couponInfo, paymentMethod } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm để tạo đơn hàng.' })
    }

    //TÍNH TOÁN GIÁ CƠ BẢN VÀ KIỂM TRA TỒN KHO
    let calculatedTotalPrice = 0
    let finalOrderItems = []
    for (const item of orderItems) {
      const product = await productModel.findById(item.productId)
      if (!product) {
        return res.status(404).json({ message: `Sản phẩm ID ${item.productId} không tồn tại.` })
      }
      const currentStock = product.countInStock || 0
      if (currentStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} hiện không đủ số lượng (${item.quantity}). Tổng tồn kho: ${currentStock}`
        })
      }
      const itemPrice = product.price
      calculatedTotalPrice += itemPrice * item.quantity

      // Thêm item đã được kiểm tra vào list
      finalOrderItems.push({
        productId: item.productId,
        name: product.name,
        image: product.images?.[0]?.url || 'default-image-url',
        price: itemPrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      })
    }

    // Lấy thông tin coupon (Nếu có)
    const discountAmount = couponInfo?.discountAmount || 0
    const finalTotalPrice = calculatedTotalPrice - discountAmount

    // 3. XÁC ĐỊNH TRẠNG THÁI VÀ PHƯƠNG THỨC THANH TOÁN
    let initialStatus = 'PendingCheckout'
    let isPaid = false

    if (paymentMethod === 'COD') {
      initialStatus = 'AwaitingConfirmation'
      isPaid = false
    }

    const newOrderData = {
      user: userId ? userId : null,
      guestId: userId ? null : guestId,
      orderItems: finalOrderItems,

      shippingAddress: shippingAddress || {},

      coupon: {
        code: couponInfo?.code || null,
        discountAmount: discountAmount,
        couponId: couponInfo?.couponId || null
      },

      // LƯU PHƯƠNG THỨC VÀ TRẠNG THÁI PHÙ HỢP
      paymentMethod: paymentMethod,
      totalPrice: finalTotalPrice > 0 ? finalTotalPrice : 0,

      isPaid: isPaid, // Trạng thái thanh toán
      paymentStatus: isPaid ? 'completed' : 'pending',

      // SỬ DỤNG TRẠNG THÁI ĐÃ TÍNH TOÁN Ở BƯỚC 3
      status: initialStatus,
      orderType: 'Cart'
    }

    // 5. LƯU ĐƠN HÀNG VÀO DB
    const createdOrder = await orderModel.create(newOrderData)

    // 6. TRẢ VỀ
    res.status(201).json({
      message: 'Đơn hàng được tạo thành công.',
      checkout: createdOrder
    })

  } catch (error) {
    console.error('Error creating checkout order:', error)
    res.status(500).json({ message: 'Server Error khi tạo đơn hàng.' })
  }
}