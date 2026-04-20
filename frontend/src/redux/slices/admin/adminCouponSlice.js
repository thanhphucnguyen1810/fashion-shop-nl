import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCouponsAPI,
  createCouponAPI,
  updateCouponAPI,
  deleteCouponAPI
} from '~/apis/couponAPI'

export const fetchCoupons = createAsyncThunk(
  'coupon/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try { return await fetchCouponsAPI() }
    catch (err) { return rejectWithValue(err.response?.data?.message || err.message) }
  }
)

export const createCouponThunk = createAsyncThunk(
  'coupon/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try { return await createCouponAPI(couponData) }
    catch (err) { return rejectWithValue(err.response?.data?.message || err.message) }
  }
)

export const updateCouponThunk = createAsyncThunk(
  'coupon/updateCoupon',
  async (couponData, { rejectWithValue }) => {
    try { return await updateCouponAPI(couponData) }
    catch (err) { return rejectWithValue(err.response?.data?.message || err.message) }
  }
)

export const deleteCouponThunk = createAsyncThunk(
  'coupon/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try { return await deleteCouponAPI(couponId) }
    catch (err) { return rejectWithValue(err.response?.data?.message || err.message) }
  }
)

// ================= SLICE =================

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
