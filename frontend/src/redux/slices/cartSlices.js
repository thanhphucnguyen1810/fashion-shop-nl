import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
  fetchCartAPI,
  addToCartAPI,
  updateCartItemQuantityAPI,
  removeFromCartAPI,
  mergeCartAPI,
  applyCouponAPI,
  removeCouponAPI
} from '~/apis/cartAPI'

// ================= LOCAL STORAGE =================

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cart')
  return storedCart ? JSON.parse(storedCart) : { products: [] }
}

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// ================= THUNK =================

// FETCH CART
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const data = await fetchCartAPI({ userId, guestId })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ADD TO CART
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await addToCartAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// UPDATE CART
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateCartItemQuantityAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// REMOVE ITEM
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await removeFromCartAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// MERGE CART
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await mergeCartAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// APPLY COUPON
export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await applyCouponAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// REMOVE COUPON
export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await removeCouponAPI(payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ================= SLICE =================

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

      // ===== FETCH =====
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
        state.error = action.payload?.message || 'Failed to fetch cart'
      })

      // ===== ADD =====
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

      // ===== UPDATE =====
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

      // ===== REMOVE =====
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

      // ===== MERGE =====
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

      // ===== APPLY COUPON =====
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to apply coupon'
      })

      // ===== REMOVE COUPON =====
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload
        saveCartToStorage(action.payload)
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to remove coupon'
      })
  }
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
