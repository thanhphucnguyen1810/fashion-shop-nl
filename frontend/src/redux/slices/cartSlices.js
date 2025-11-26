import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cart')
  return storedCart ? JSON.parse(storedCart) : { products: [] }
}

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, { params: { userId, guestId } })
      return response.data
    } catch (error) {
      console.error(error)
      return rejectWithValue(error.response.data)
    }
  }
)

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/cart`,
      {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId
      }
    )
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/cart`,
        {
          productId,
          quantity,
          guestId,
          userId,
          size,
          color
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `${API_URL}/api/cart`,
        data: { productId, guestId, userId, size, color }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

//Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async ({ code, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/coupons/apply`, { code, userId, guestId })
      return response.data // { discountAmount, code }
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] }
      localStorage.removeItem('cart')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message || 'Failed to fetch cart'
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to add to cart'
      })

      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to update item quantity'
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to remove item'
      })

      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to merge cart'
      })

      .addCase(applyCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        if (!state.cart) state.cart = { products: [] }

        if (action.payload && action.payload.code) {
          state.cart.coupon = {
            code: action.payload.code,
            discountAmount: action.payload.discountAmount
          }
          saveCartToStorage(state.cart)
        } else {
          state.error = action.payload?.message || 'Failed to apply coupon'
        }
      })

      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to apply coupon'
      })

  }
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
