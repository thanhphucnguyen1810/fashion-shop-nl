import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Tạo đơn hàng mới
export const createCheckout = createAsyncThunk(
  'checkout/createCheckout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/checkout/create`, checkoutData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Tạo đơn thất bại' })
    }
  }
)

export const getCheckoutDetail = createAsyncThunk(
  'checkout/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/checkout/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Tạo action mới để chuyển Checkout thành Order chính thức
export const finalizeOrder = createAsyncThunk(
  'checkout/finalizeOrder',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/finalize/${checkoutId}`,
        {

        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Lấy thông tin mã QR
export const getSepayQrInfo = createAsyncThunk(
  'checkout/getSepayQrInfo',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/checkout/sepay-qr/${checkoutId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return response.data // { qrUrl, transferContent, amount }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

//Kiểm tra trạng thái thanh toán (Polling)
export const checkPaymentStatus = createAsyncThunk(
  'checkout/checkPaymentStatus',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/checkout/sepay-status/${checkoutId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return response.data // { isPaid: true/false, orderId: ... }
    } catch (error) {
      // Polling thường xuyên nên nếu lỗi mạng nhỏ thì bỏ qua, ko cần reject gắt
      return rejectWithValue(error.response?.data)
    }
  }
)

// =======================
// SLICE
// =======================

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    paymentUrl: null,
    qrData: null,
    isPaidSuccess: false,
    finalOrderId: null
  },
  reducers: {
    resetCheckout: (state) => {
      state.checkout = null
      state.paymentUrl = null
      state.error = null
      state.qrData = null
      state.isPaidSuccess = false
      state.finalOrderId = null
    }
  },
  extraReducers: (builder) => {
    builder
    // Create
      .addCase(createCheckout.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false
        state.checkout = action.payload.checkout
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
      // Get Detail
      .addCase(getCheckoutDetail.fulfilled, (state, action) => {
        state.checkout = action.payload
      })
      .addCase(finalizeOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(finalizeOrder.fulfilled, (state, action) => {
        state.loading = false
        // Bạn có thể chọn reset state hoặc làm gì đó khác tùy vào logic backend sau khi finalize thành công
        state.checkout = null
      })
      .addCase(finalizeOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Xác nhận đơn hàng thất bại.'
      })

      // --- XỬ LÝ QR SEPAY ---
      .addCase(getSepayQrInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(getSepayQrInfo.fulfilled, (state, action) => {
        state.loading = false
        state.qrData = action.payload // Lưu URL QR vào state để hiển thị
      })
      .addCase(getSepayQrInfo.rejected, (state, action) => {
        state.loading = false
        state.error = 'Không lấy được mã QR.'
      })

      // --- XỬ LÝ CHECK STATUS (POLLING) ---
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        if (action.payload.isPaid) {
          state.isPaidSuccess = true
          state.checkout.orderId = action.payload.orderId
          state.finalOrderId = action.payload.orderId
          if (state.checkout) state.checkout.isPaid = true
        }
      })
  }
})

export const { resetCheckout } = checkoutSlice.actions
export default checkoutSlice.reducer

