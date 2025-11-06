import Cart from '~/models/cart.model'
import Product from '~/models/product.model'

// Helper: lấy giỏ hàng theo userId hoặc guestId
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId })
  if (guestId) return await Cart.findOne({ guestId })
  return null
}

// 🛒 Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body

  try {
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product Not Found!' })

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
          quantity
        })
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )

      await cart.save()
      return res.status(200).json(cart)
    } else {
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
            quantity
          }
        ],
        totalPrice: product.price * quantity
      })
      return res.status(201).json(newCart)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error!!!' })
  }
}

// ✏️ Cập nhật số lượng sản phẩm
export const updateCart = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body
  try {
    const cart = await getCart(userId, guestId)
    if (!cart) return res.status(404).json({ message: 'Cart Not Found!' })

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    )

    if (index > -1) {
      if (quantity > 0) cart.products[index].quantity = quantity
      else cart.products.splice(index, 1)

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )

      await cart.save()
      return res.status(200).json(cart)
    } else {
      return res.status(404).json({ message: 'Product not found in cart' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server Error' })
  }
}

// ❌ Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body

  try {
    const cart = await getCart(userId, guestId)
    if (!cart) return res.status(404).json('Cart Not Found!')

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    )

    if (index > -1) {
      cart.products.splice(index, 1)
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
      await cart.save()
      return res.status(200).json(cart)
    } else {
      return res.status(404).json({ message: 'Product not found in cart' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server Error!' })
  }
}

// 📦 Lấy giỏ hàng của user hoặc guest
export const getCartDetails = async (req, res) => {
  const { userId, guestId } = req.query
  try {
    const cart = await getCart(userId, guestId)
    if (cart) res.json(cart)
    else res.status(404).json({ message: 'Cart Not Found!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error!' })
  }
}

// 🔄 Merge giỏ hàng guest vào user khi login
export const mergeGuestCart = async (req, res) => {
  const { guestId } = req.body
  try {
    const guestCart = await Cart.findOne({ guestId })
    const userCart = await Cart.findOne({ user: req.user._id })

    if (!guestCart) {
      if (userCart) return res.status(200).json(userCart)
      return res.status(404).json({ message: 'Guest cart not found!' })
    }

    if (guestCart.products.length === 0) {
      return res.status(400).json({ message: 'Guest cart is empty!' })
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
      return res.status(200).json(userCart)
    } else {
      guestCart.user = req.user._id
      guestCart.guestId = undefined
      await guestCart.save()
      res.status(200).json(guestCart)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error!' })
  }
}
