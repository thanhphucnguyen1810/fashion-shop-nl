import express from 'express'
import checkoutModel from '~/models/checkout.model'
import cartModel from '~/models/cart.model'
import productModel from '~/models/product.model'
import orderModel from '~/models/order.model'

import { protect } from '~/middlewares/auth.middleware'

const checkoutRoutes = express.Router()

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
checkoutRoutes.post('/', protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: 'No items in checkout.' })
  }

  try {
    // ensure req.user exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const newCheckout = await checkoutModel.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      isPaid: false,
      isFinalized: false
    })

    console.log(`Checkout created for user: ${req.user._id}`)
    res.status(201).json(newCheckout)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @route PUT /api/checkout/:id/pay
// @desc Update checkout to mark as paid after successful payment
// @access Private
checkoutRoutes.put('/:id/pay', protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body

  try {
    const checkout = await checkoutModel.findById(req.params.id)
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout not found' })
    }

    if (paymentStatus === 'paid') {
      checkout.isPaid = true
      checkout.paymentStatus = paymentStatus
      checkout.paymentDetails = paymentDetails
      checkout.paidAt = Date.now()
      await checkout.save()

      return res.status(200).json(checkout)
    } else {
      return res.status(400).json({ message: 'Invalid payment status' })
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @route PUT /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
checkoutRoutes.post('/:id/finalize', protect, async (req, res) => {
  try {
    const checkout = await checkoutModel.findById(req.params.id)
    if (!checkout) {
      return res.status(404).json({ message: 'Checkout not found' })
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: 'Checkout is not paid' })
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: 'Checkout already finalized' })
    }

    // create order
    const finalOrder = await orderModel.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: 'paid',
      paymentDetails: checkout.paymentDetails
    })

    // update product stock (decrement countInStock)
    // assume each checkoutItem has { product: productId, qty: number }
    for (const item of checkout.checkoutItems) {
      if (!item.productId || !item.quantity) continue
      const prod = await productModel.findById(item.productId)
      if (prod) {
        // optional: if stock insufficient, you might want to handle differently
        prod.countInStock = Math.max(0, (prod.countInStock || 0) - item.quantity)
        await prod.save()
      }
    }

    // mark checkout finalized
    checkout.isFinalized = true
    checkout.finalizedAt = Date.now()
    await checkout.save()

    // delete the user's cart (if exists)
    await cartModel.findOneAndDelete({ user: checkout.user })

    res.status(201).json(finalOrder)
  } catch (error) {
    console.error('Error finalizing checkout:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default checkoutRoutes
