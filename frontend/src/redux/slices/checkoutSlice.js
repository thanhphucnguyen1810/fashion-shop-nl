import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createCheckoutAPI,
  getCheckoutDetailAPI,
  finalizeOrderAPI,
  getSepayQrInfoAPI,
  checkPaymentStatusAPI
} from '~/apis/checkoutAPI'

// ================= THUNK =================

export const createCheckout = createAsyncThunk(
  'checkout/createCheckout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      return await createCheckoutAPI(checkoutData)
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Tạo đơn thất bại' })
    }
  }
)

export const getCheckoutDetail = createAsyncThunk(
  'checkout/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await getCheckoutDetailAPI(id)
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const finalizeOrder = createAsyncThunk(
  'checkout/finalizeOrder',
  async (checkoutId, { rejectWithValue }) => {
    try {
      return await finalizeOrderAPI(checkoutId)
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const getSepayQrInfo = createAsyncThunk(
  'checkout/getSepayQrInfo',
  async (checkoutId, { rejectWithValue }) => {
    try {
      return await getSepayQrInfoAPI(checkoutId)
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const checkPaymentStatus = createAsyncThunk(
  'checkout/checkPaymentStatus',
  async (checkoutId, { rejectWithValue }) => {
    try {
      return await checkPaymentStatusAPI(checkoutId)
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ================= SLICE =================

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
      // CREATE
      .addCase(createCheckout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false
        state.checkout = action.payload.checkout
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // DETAIL
      .addCase(getCheckoutDetail.fulfilled, (state, action) => {
        state.checkout = action.payload
      })

      // FINALIZE
      .addCase(finalizeOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(finalizeOrder.fulfilled, (state) => {
        state.loading = false
        state.checkout = null
      })
      .addCase(finalizeOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Xác nhận đơn hàng thất bại.'
      })

      // QR
      .addCase(getSepayQrInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(getSepayQrInfo.fulfilled, (state, action) => {
        state.loading = false
        state.qrData = action.payload
      })
      .addCase(getSepayQrInfo.rejected, (state) => {
        state.loading = false
        state.error = 'Không lấy được mã QR.'
      })

      // CHECK STATUS
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
