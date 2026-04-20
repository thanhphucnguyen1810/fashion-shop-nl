import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { mergeCart, fetchCart } from '~/redux/slices/cartSlices'
import {
  registerUserAPI,
  loginUserAPI,
  logoutUserAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  addFavoriteAPI,
  removeFavoriteAPI
} from '~/apis/authAPI'

import { toast } from 'react-toastify'

// ============================= LOCAL STORAGE ==================================

const userFromStorageRaw = localStorage.getItem('userInfo')
let userFromStorage = null
try {
  userFromStorage =
    userFromStorageRaw && userFromStorageRaw !== 'undefined'
      ? JSON.parse(userFromStorageRaw)
      : null
} catch {
  userFromStorage = null
}

// Check for an existing guest ID or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${Date.now()}`
localStorage.setItem('guestId', initialGuestId)

// ================================ STATE =======================================

const initialState = {
  user: userFromStorage,
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

// ================================ THUNK =======================================

// register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUserAPI(userData)

      return {
        message: data.message,
        redirectEmail: data.redirectEmail
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi server' })
    }
  }
)

// login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const data = await loginUserAPI(userData)

      localStorage.setItem('userInfo', JSON.stringify(data.user))

      const guestId = localStorage.getItem('guestId')
      const userId = data.user._id

      if (guestId) {
        await dispatch(
          mergeCart({
            guestId: guestId,
            user: data.user
          })
        )

        localStorage.removeItem('guestId')
      }

      await dispatch(fetchCart({ userId }))

      return {
        user: data.user
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
    window.location.href = `${import.meta.env.VITE_API_URL}/api/oauth/${provider}`
  }
)

// forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPasswordAPI(email)
      // return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi server khi yêu cầu đặt lại' })
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (showSuccessMessage = true, { rejectWithValue }) => {
    try {
      await logoutUserAPI()
      if (showSuccessMessage) toast.success('Logged out successfully!')
      return true
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Logout failed' })
    }
  }
)


// reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      // Gửi mật khẩu mới trong body, token trong URL
      const data = await resetPasswordAPI({ token, password })

      // Sau khi reset thành công, cập nhật state login
      localStorage.setItem('userInfo', JSON.stringify(data.user))

      return {
        message: data.message,
        user: data.user,
        token: data.token
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Đặt lại mật khẩu thất bại' })
    }
  }
)

// add favorite
export const addFavorite = createAsyncThunk(
  'auth/addFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await addFavoriteAPI(productId)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi thêm yêu thích' })
    }
  }
)

// remove favorite
export const removeFavorite = createAsyncThunk(
  'auth/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await removeFavoriteAPI(productId)
      return data
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
      state.guestId = `guest_${Date.now()}`
      localStorage.setItem('guestId', state.guestId)
      localStorage.removeItem('userInfo')
    },

    setUser: (state, action) => {
      state.user = action.payload.user
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user))
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
        const index = state.user.favorites.findIndex(item => {
          const favId = item._id ? item._id.toString() : item.toString()
          return favId === productId.toString()
        })

        if (index > -1) {
          state.user.favorites.splice(index, 1)
        } else {
          state.user.favorites.push(productId)
        }
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
        state.isVerifiedError = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.message
        state.isVerifiedError = action.payload.isVerified === false
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.guestId = `guest_${Date.now()}`
        localStorage.setItem('guestId', state.guestId)
        localStorage.removeItem('userInfo')
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

      // ===== ADD FAVORITE =====
      .addCase(addFavorite.pending, (state) => {
        state.favoriteLoading = true
        state.favoriteError = null
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favoriteLoading = false
        if (state.user) {
          state.user.favorites = action.payload
        }
        // Lưu vào LocalStorage
        localStorage.setItem('userInfo', JSON.stringify(state.user))
      })
      .addCase(addFavorite.rejected, (state, action) => {
        // Tắt loading và lưu thông báo lỗi
        state.favoriteLoading = false
        state.favoriteError = action.payload.message
      })

    // ===== REMOVE FAVORITE =====
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
      })
  }
})

export const {
  logout,
  setUser,
  clearForgotStatus,
  clearResetStatus,
  clearRegisterStatus,
  toggleFavoriteLocal
} = authSlice.actions

export default authSlice.reducer
