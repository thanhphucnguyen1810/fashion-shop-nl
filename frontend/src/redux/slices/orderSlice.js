import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL


// Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/my-orders`,
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

// Async thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message })
    }
  }
)

export const createTemporaryOrder = createAsyncThunk(
  'orders/createTemporaryOrder',
  // Bổ sung: shippingAddress và couponInfo
  async ({ orderItems, userId, guestId, shippingAddress, couponInfo }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/orders/buy-now`,
        // Gửi payload đầy đủ
        { orderItems, userId, guestId, shippingAddress, couponInfo },
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

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })

      // Fetch user orders details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false
        state.orderDetails = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message || action.error?.message
      })

      // Create Temporary Order (Buy Now)
      .addCase(createTemporaryOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTemporaryOrder.fulfilled, (state, action) => {
        state.loading = false
        // Có thể lưu orderId tạm thời vào state nếu cần
        // state.currentBuyNowOrderId = action.payload.orderId
      })
      .addCase(createTemporaryOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  }
})

export default orderSlice.reducer
