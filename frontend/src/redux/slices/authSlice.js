import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mergeCart, fetchCart } from '~/redux/slices/cartSlices'
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
  isVerifiedError:false,
  favoriteLoading: false,
  favoriteError: null
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
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, userData)

      localStorage.setItem('userInfo', JSON.stringify(response.data.user))
      localStorage.setItem('userToken', response.data.token)

      const guestId = localStorage.getItem('guestId')
      const userId = response.data.user._id

      if (guestId) {
        await dispatch(
          mergeCart({
            guestId: guestId,
            user: response.data.user
          })
        ).unwrap()

        localStorage.removeItem('guestId')
      }

      await dispatch(fetchCart({ userId }))

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

// Thêm Sản phẩm yêu thích (Giữ nguyên)
export const addFavorite = createAsyncThunk(
  'auth/addFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const response = await axios.post(`${API_URL}/api/users/favorites/${productId}`, {}, config)
      return response.data // Là mảng favorites mới
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi thêm yêu thích' })
    }
  }
)

// Xóa Sản phẩm yêu thích (Giữ nguyên)
export const removeFavorite = createAsyncThunk(
  'auth/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
      }
      const response = await axios.delete(`${API_URL}/api/users/favorites/${productId}`, config)
      return response.data // Là mảng favorites mới
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi xóa yêu thích' })
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
    },
    toggleFavoriteLocal: (state, action) => {
      if (state.user) {
        const productId = action.payload
        const index = state.user.favorites.indexOf(productId)

        if (index > -1) {
          // Bỏ yêu thích
          state.user.favorites.splice(index, 1)
        } else {
          // Thêm yêu thích
          state.user.favorites.push(productId)
        }

        // Cập nhật LocalStorage ngay lập tức
        localStorage.setItem('userInfo', JSON.stringify(state.user))
      }
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

      // ===== ADD FAVORITE (Chuyên nghiệp hơn) =====
      .addCase(addFavorite.pending, (state) => {
        // Bật cờ loading khi bắt đầu gọi API
        state.favoriteLoading = true
        state.favoriteError = null
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favoriteLoading = false
        if (state.user) {
          // Đồng bộ state Redux với dữ liệu favorites mới nhất từ Backend
          state.user = { ...state.user, favorites: action.payload }
        }
        // Lưu vào LocalStorage (Đã được thực hiện trong toggleFavoriteLocal,
        // nhưng giữ lại ở đây để đảm bảo tính đồng bộ cuối cùng)
        localStorage.setItem('userInfo', JSON.stringify(state.user))
      })
      .addCase(addFavorite.rejected, (state, action) => {
        // Tắt loading và lưu thông báo lỗi
        state.favoriteLoading = false
        state.favoriteError = action.payload.message
        // **QUAN TRỌNG: Xử lý hoàn tác Optimistic Update ở đây (nếu cần)**
        // Nếu API lỗi, bạn cần hoàn tác thay đổi favorites đã làm trong `toggleFavoriteLocal`.
        // Việc này thường được xử lý bằng cách truyền thêm thông tin vào payload.
      })

    // ===== REMOVE FAVORITE (Chuyên nghiệp hơn) =====
      .addCase(removeFavorite.pending, (state) => {
        state.favoriteLoading = true
        state.favoriteError = null
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favoriteLoading = false
        if (state.user) {
          state.user = { ...state.user, favorites: action.payload }
        }
        localStorage.setItem('userInfo', JSON.stringify(state.user))
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.favoriteLoading = false
        state.favoriteError = action.payload.message
        // **QUAN TRỌNG: Xử lý hoàn tác Optimistic Update ở đây (nếu cần)**
      })
  }
})

export const { logout, setUser, clearForgotStatus, clearResetStatus, clearRegisterStatus, toggleFavoriteLocal } = authSlice.actions
export default authSlice.reducer
