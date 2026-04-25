import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchAllOrdersAPI,
  fetchAllOrdersForDashboardAPI,
  fetchAdminOrderDetailsAPI,
  fetchOrdersByUserAPI,
  updateOrderStatusAPI,
  deleteOrderAPI
} from '~/apis/adminOrderAPI'

export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async ({ page = 1, search = '' } = {}, { rejectWithValue }) => {
    try { return await fetchAllOrdersAPI({ page, search }) }
    catch (err) { return rejectWithValue(err.response?.data.message || err.message) }
  }
)

export const fetchAllOrdersForDashboard = createAsyncThunk(
  'adminOrders/fetchAllForDashboard',
  async (_, { rejectWithValue }) => {
    try { return await fetchAllOrdersForDashboardAPI() }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const fetchAdminOrderDetails = createAsyncThunk(
  'adminOrders/fetchOrderDetails',
  async (id, { rejectWithValue }) => {
    try { return await fetchAdminOrderDetailsAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data.message || err.message) }
  }
)

export const fetchOrdersByUser = createAsyncThunk(
  'adminOrders/fetchOrdersByUser',
  async (userId, { rejectWithValue }) => {
    try { return await fetchOrdersByUserAPI(userId) }
    catch (err) { return rejectWithValue(err.response?.data.message || err.message) }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try { return await updateOrderStatusAPI({ id, status }) }
    catch (err) { return rejectWithValue(err.response?.data.message || err.message) }
  }
)

export const deleteOrder = createAsyncThunk(
  'adminOrders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try { return await deleteOrderAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data.message || err.message) }
  }
)

// ================= SLICE =================

const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.totalOrders = action.payload.total
        state.totalSales = action.payload.orders.reduce((acc, o) => acc + o.totalPrice, 0)
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

      // UPDATE STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order // payload là { message, order }
        if (!updated) return
        const idx = state.orders.findIndex(o => o._id === updated._id)
        if (idx !== -1) state.orders[idx] = { ...state.orders[idx], ...updated }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload
      })

      // DELETE
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o._id !== action.payload)
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload
      })

      // FETCH BY USER
      .addCase(fetchOrdersByUser.pending, (state) => { state.loading = true })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchAllOrdersForDashboard.fulfilled, (state, action) => {
        state.orders = action.payload.orders
        state.totalOrders = action.payload.total
        state.totalSales = action.payload.orders
          .filter(o => o.status === 'Delivered')
          .reduce((acc, o) => acc + o.totalPrice, 0)
      })
  }
})

export default adminOrderSlice.reducer
