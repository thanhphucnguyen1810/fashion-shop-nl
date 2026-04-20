import Product from '~/models/product.model'
import Cart from '~/models/cart.model'

// Helper
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId })
  if (guestId) return await Cart.findOne({ guestId })
  return null
}

// ================= ADD =================
const addToCart = async (data) => {
  const { productId, quantity, size, color, guestId, userId, sku } = data

  const product = await Product.findById(productId)
  if (!product) {
    const error = new Error('Product Not Found!')
    error.statusCode = 404
    throw error
  }

  let cart = await getCart(userId, guestId)

  if (cart) {
    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    )

    if (index > -1) {
      cart.products[index].quantity += quantity
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        size,
        color,
        quantity,
        sku
      })
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    await cart.save()
    return { cart, statusCode: 200 }
  }

  const newCart = await Cart.create({
    user: userId || undefined,
    guestId: guestId || 'guest_' + Date.now(),
    products: [
      {
        productId,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        size,
        color,
        quantity,
        sku
      }
    ],
    totalPrice: product.price * quantity
  })

  return { cart: newCart, statusCode: 201 }
}

// ================= UPDATE =================
const updateCart = async (data) => {
  const { productId, quantity, size, color, guestId, userId } = data

  const cart = await getCart(userId, guestId)
  if (!cart) {
    const error = new Error('Cart Not Found!')
    error.statusCode = 404
    throw error
  }

  const index = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  )

  if (index === -1) {
    const error = new Error('Product not found in cart')
    error.statusCode = 404
    throw error
  }

  if (quantity > 0) cart.products[index].quantity = quantity
  else cart.products.splice(index, 1)

  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  await cart.save()
  return cart
}

// ================= REMOVE =================
const removeFromCart = async (data) => {
  const { productId, size, color, guestId, userId } = data

  const cart = await getCart(userId, guestId)
  if (!cart) {
    const error = new Error('Cart Not Found!')
    error.statusCode = 404
    throw error
  }

  const index = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  )

  if (index === -1) {
    const error = new Error('Product not found in cart')
    error.statusCode = 404
    throw error
  }

  cart.products.splice(index, 1)

  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  await cart.save()
  return cart
}

// ================= GET =================
const getCartDetails = async (query) => {
  const { userId, guestId } = query

  const cart = await getCart(userId, guestId)

  if (!cart) {
    return {
      products: [],
      totalPrice: 0
    }
  }

  return cart
}

// ================= MERGE =================
const mergeGuestCart = async (guestId, user) => {
  const guestCart = await Cart.findOne({ guestId })
  let userCart = await Cart.findOne({ user: user._id })

  if (!guestCart || guestCart.products.length === 0) {
    return userCart || { products: [], totalPrice: 0 }
  }

  if (userCart) {
    guestCart.products.forEach((guestItem) => {
      const index = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      )

      if (index > -1) {
        userCart.products[index].quantity += guestItem.quantity
      } else {
        userCart.products.push(guestItem)
      }
    })

    userCart.totalPrice = userCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    await userCart.save()
    await Cart.findOneAndDelete({ guestId })

    return userCart
  }

  guestCart.user = user._id
  guestCart.guestId = undefined
  await guestCart.save()

  return guestCart
}

export const cartService = {
  addToCart,
  updateCart,
  removeFromCart,
  getCartDetails,
  mergeGuestCart
}
