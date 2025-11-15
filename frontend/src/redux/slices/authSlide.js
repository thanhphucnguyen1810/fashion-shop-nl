import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// ============================= LOCAL STORAGE ==================================

const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

// Guest ID
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`
localStorage.setItem('guestId', initialGuestId)

// ================================ STATE =======================================

const initialState = {
  user: userFromStorage,
  token: localStorage.getItem('token') || null,
  guestId: initialGuestId,
  loading: false,
  error: null,
  success: false
}

// ================================ API CALLS ===================================

// Đăng ký
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, formData, {
        withCredentials: true
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi server' })
    }
  }
)

// Đăng nhập email/password
export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, formData, {
        withCredentials: true
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Đăng nhập thất bại' })
    }
  }
)

// Login Google / Facebook
export const socialLogin = createAsyncThunk(
  'auth/social',
  async (provider) => {
    window.location.href = `${API_URL}/api/oauth/${provider}`
  }
)

// ================================= SLICE ======================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },

    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token

      localStorage.setItem('userInfo', JSON.stringify(action.payload.user))
      localStorage.setItem('token', action.payload.token)
    },

    resetSuccess: (state) => {
      state.success = false
    }
  },

  extraReducers: (builder) => {
    builder
      // ===== REGISTER =====
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
        state.success = false
      })

      // ===== LOGIN =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false

        state.user = action.payload.user
        state.token = action.payload.token

        localStorage.setItem('userInfo', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
      })
  }
})

export const { logout, resetSuccess, setUser } = authSlice.actions
export default authSlice.reducer
