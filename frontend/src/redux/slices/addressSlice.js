import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// ================================= LOCAL STORAGE ===============================

// Guest ID phòng trường hợp user chưa đăng nhập
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`
localStorage.setItem('guestId', initialGuestId)

// ================================= INITIAL STATE ===============================

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: false,
  guestId: initialGuestId
}

// ================================ API CALLS ===================================

// Get all user addresses
export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const res = await axios.get(`${API_URL}/api/address`, config)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi tải địa chỉ' })
    }
  }
)

// Add new address
export const addAddress = createAsyncThunk(
  'address/add',
  async (addressData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const res = await axios.post(`${API_URL}/api/address`, addressData, config)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi thêm địa chỉ' })
    }
  }
)

// Update address
export const updateAddress = createAsyncThunk(
  'address/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const res = await axios.put(`${API_URL}/api/address/${id}`, updatedData, config)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật địa chỉ' })
    }
  }
)

// Delete address
export const deleteAddress = createAsyncThunk(
  'address/delete',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      await axios.delete(`${API_URL}/api/address/${id}`, config)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi xóa địa chỉ' })
    }
  }
)

// Set default address
export const setDefaultAddress = createAsyncThunk(
  'address/default',
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const res = await axios.put(`${API_URL}/api/address/default/${id}`, {}, config)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Không đặt được mặc định' })
    }
  }
)

// ================================ SLICE =======================================

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressStatus: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    }
  },

  extraReducers: (builder) => {
    builder
      // ================================= FETCH =================================
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })

      // ================================= ADD ===================================
      .addCase(addAddress.pending, (state) => {
        state.success = false
        state.error = null
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.success = true
        state.list.push(action.payload)
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload.message
      })

      // ================================ UPDATE =================================
      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a._id === action.payload._id)
        if (idx !== -1) state.list[idx] = action.payload
      })

      // ================================ DELETE =================================
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a._id !== action.payload)
      })

      // =============================== SET DEFAULT =============================
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.list = state.list.map(a => ({ ...a, isDefault: false }))
        const idx = state.list.findIndex(a => a._id === action.payload._id)
        if (idx !== -1) state.list[idx] = action.payload
      })
  }
})

export const { clearAddressStatus } = addressSlice.actions
export default addressSlice.reducer
