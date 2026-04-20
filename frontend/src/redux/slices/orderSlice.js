import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchUserOrdersAPI,
  fetchOrderDetailsAPI,
  createTemporaryOrderAPI
} from '~/apis/orderAPI'

// ================= THUNKS =================

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserOrdersAPI()
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      return await fetchOrderDetailsAPI(orderId)
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message })
    }
  }
)

export const createTemporaryOrder = createAsyncThunk(
  'orders/createTemporaryOrder',
  async (
    { orderItems, userId, guestId, shippingAddress, couponInfo },
    { rejectWithValue }
  ) => {
    try {
      return await createTemporaryOrderAPI({
        orderItems,
        userId,
        guestId,
        shippingAddress,
        couponInfo
      })
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ================= SLICE =================

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

      // GET ORDERS
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
        state.error = action.payload?.message
      })

      // ORDER DETAIL
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
        state.error = action.payload?.message || action.error?.message
      })

      // CREATE TEMP ORDER
      .addCase(createTemporaryOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTemporaryOrder.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createTemporaryOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
  }
})

export default orderSlice.reducer
