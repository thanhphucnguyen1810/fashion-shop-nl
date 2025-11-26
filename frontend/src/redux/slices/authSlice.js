import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// ============================= LOCAL STORAGE ==================================

const userFromStorageRaw = localStorage.getItem('userInfo')
const userFromStorage =
  userFromStorageRaw && userFromStorageRaw !== 'undefined'
    ? JSON.parse(userFromStorageRaw)
    : null


const tokenFromStorage = localStorage.getItem('userToken') || null

// Check for an existing guest ID or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`
localStorage.setItem('guestId', initialGuestId)

// ================================ STATE =======================================

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
  success: false,
  redirectEmail: null,
  forgotLoading: false,
  forgotSuccess: false,
  resetLoading: false,
  resetSuccess: false,
  isVerifiedError:false
}

// ================================ API CALLS ===================================

// Đăng ký
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, userData)

      return {
        message: response.data.message,
        redirectEmail: response.data.redirectEmail
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi server' })
    }
  }
)

// Đăng nhập email/password
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, userData)

      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
      localStorage.setItem('userToken', response.data.token)

      return {
        user: response.data.user,
        token: response.data.token
      }
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

// Quên mật khẩu
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/forgotPassword`, { email })
      // Lưu ý: Backend đã trả về status 200 ngay cả khi email không tồn tại.
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi server khi yêu cầu đặt lại' })
    }
  }
)

// Đặt lại mật khẩu
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      // Gửi mật khẩu mới trong body, token trong URL
      const response = await axios.patch(`${API_URL}/api/users/resetPassword/${token}`, { password })

      // Sau khi reset thành công, cập nhật state login
      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
      localStorage.setItem('userToken', response.data.token)

      return {
        message: response.data.message,
        user: response.data.user,
        token: response.data.token
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Đặt lại mật khẩu thất bại' })
    }
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

      state.guestId = `guest_${Date.now()}`
      localStorage.setItem('guestId', state.guestId)

      localStorage.removeItem('userInfo')
      localStorage.removeItem('userToken')
    },

    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user))
      localStorage.setItem('userToken', action.payload.token)
    },
    clearRegisterStatus: (state) => {
      state.loading = false
      state.success = false
      state.redirectEmail = null
      state.error = null
    },

    clearForgotStatus: (state) => {
      state.forgotLoading = false
      state.forgotSuccess = false
      state.error = null
    },

    clearResetStatus: (state) => {
      state.resetLoading = false
      state.resetSuccess = false
      state.error = null
    }
  },

  extraReducers: (builder) => {
    builder
      // ===== REGISTER =====
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.redirectEmail = action.payload.redirectEmail
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload.message
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
        state.isVerifiedError = action.payload.isVerified === false
      })

      // ===== FORGOT PASSWORD =====
      .addCase(forgotPassword.pending, (state) => {
        state.forgotLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotLoading = false
        state.forgotSuccess = true
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotLoading = false
        state.error = action.payload.message
      })

      // ================== RESET PASSWORD ==================
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetLoading = false
        state.resetSuccess = true
        // Cập nhật trạng thái người dùng (đăng nhập)
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false
        state.error = action.payload.message
      })
  }
})

export const { logout, setUser, clearForgotStatus, clearResetStatus, clearRegisterStatus } = authSlice.actions
export default authSlice.reducer
