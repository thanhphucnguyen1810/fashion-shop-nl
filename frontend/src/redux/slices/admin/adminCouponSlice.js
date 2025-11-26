import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// ================================ THUNKS ================================

// Fetch all coupons
export const fetchCoupons = createAsyncThunk(
  'coupon/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

// Create a new coupon
export const createCouponThunk = createAsyncThunk(
  'coupon/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/coupons`, couponData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

// Update a coupon
export const updateCouponThunk = createAsyncThunk(
  'coupon/updateCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const { _id, ...data } = couponData
      const res = await axios.put(`${API_URL}/api/admin/coupons/${_id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return res.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

// Delete a coupon
export const deleteCouponThunk = createAsyncThunk(
  'coupon/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      })
      return couponId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
)

// ================================ SLICE ================================

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupons: [],
    loading: false,
    globalError: null,
    formSuccess: null
  },
  reducers: {
    clearAdminError: (state) => {
      state.globalError = null
      state.formSuccess = null
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCoupons.pending, (state) => { state.loading = true })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false
        state.coupons = action.payload
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false
        state.globalError = action.payload
      })

      // CREATE
      .addCase(createCouponThunk.pending, (state) => { state.loading = true })
      .addCase(createCouponThunk.fulfilled, (state, action) => {
        state.loading = false
        state.coupons.unshift(action.payload)
        state.formSuccess = 'Tạo mã giảm giá thành công!'
      })
      .addCase(createCouponThunk.rejected, (state, action) => {
        state.loading = false
        state.globalError = action.payload
      })

      // UPDATE
      .addCase(updateCouponThunk.pending, (state) => { state.loading = true })
      .addCase(updateCouponThunk.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.coupons.findIndex(c => c._id === action.payload._id)
        if (idx !== -1) state.coupons[idx] = action.payload
        state.formSuccess = 'Cập nhật mã giảm giá thành công!'
      })
      .addCase(updateCouponThunk.rejected, (state, action) => {
        state.loading = false
        state.globalError = action.payload
      })

      // DELETE
      .addCase(deleteCouponThunk.pending, (state) => { state.loading = true })
      .addCase(deleteCouponThunk.fulfilled, (state, action) => {
        state.loading = false
        state.coupons = state.coupons.filter(c => c._id !== action.payload)
        state.formSuccess = 'Xóa mã giảm giá thành công!'
      })
      .addCase(deleteCouponThunk.rejected, (state, action) => {
        state.loading = false
        state.globalError = action.payload
      })
  }
})

export const { clearAdminError } = couponSlice.actions
export default couponSlice.reducer

