// File: src/redux/slices/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'sonner'

// Giả định Base URL của API
const API_BASE_URL = 'http://localhost:8000/api'

// Lấy tất cả đánh giá đã được duyệt của một sản phẩm
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      // API này sẽ chỉ trả về reviews có status='approved'
      const response = await axios.get(`${API_BASE_URL}/reviews/product/${productId}`)
      return response.data
    } catch (error) {
      toast.error('Không thể tải đánh giá sản phẩm.', { duration: 2000 })
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// THÊM ASYNC THUNK NÀY CHO ADMIN
export const fetchAllReviewsAdmin = createAsyncThunk(
  'reviews/fetchAllReviewsAdmin',
  async (_, { rejectWithValue }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    }

    try {
      // Endpoint API để lấy TẤT CẢ reviews (backend cần đảm bảo endpoint này chỉ dành cho Admin)
      const response = await axios.get(`${API_BASE_URL}/admin/reviews`, config)
      return response.data // Trả về danh sách TẤT CẢ reviews
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá Admin.', { duration: 2000 })
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Thêm đánh giá mới (có thể bao gồm file ảnh)
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue, getState }) => {
    const { productId, rating, comment, mediaFiles } = reviewData

    // Lấy token từ Auth state nếu cần xác thực
    const { token } = getState().auth
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    }

    // Tạo FormData để gửi dữ liệu text và file
    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('rating', rating)
    formData.append('comment', comment)

    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formData.append('images', file) // Gửi mảng files dưới key 'images'
      })
    }

    try {
      // Endpoint API để gửi review
      const response = await axios.post(`${API_BASE_URL}/reviews`, formData, config)

      // Thành công: Trả về review mới (có thể đang ở trạng thái pending)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gửi đánh giá')
    }
  }
)

// Cập nhật trạng thái review
export const updateReviewStatus = createAsyncThunk(
  'reviews/updateReviewStatus',
  async ({ id, status }, { rejectWithValue }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    }
    try {
      // Dùng axios.patch
      await axios.patch(`${API_BASE_URL}/admin/reviews/${id}/status`, { status }, config)

      // Trả về ID và trạng thái mới để cập nhật state cục bộ
      return { id, status }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái')
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Xóa review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`)
      toast.success('Xóa đánh giá thành công')
      return reviewId
    } catch (error) {
      toast.error('Không thể xóa đánh giá')
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)


// ------------------------------------
// SLICE (MODEL/STATE)
// ------------------------------------

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [], // Mảng các đánh giá đã được duyệt
    adminReviews: [],
    loading: false,
    adminLoading: false,
    error: null,
    submitStatus: 'idle'
  },
  reducers: {
    // Reset trạng thái sau khi submit
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle'
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload // Cập nhật danh sách reviews đã duyệt
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Xử lý Fetch All Reviews Admin
      .addCase(fetchAllReviewsAdmin.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false
        state.adminReviews = action.payload //Lưu vào state AdminReviews
      })
      .addCase(fetchAllReviewsAdmin.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload
      })

      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.submitStatus = 'loading'
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded'
        // KHÔNG thêm review mới vào state.reviews ngay lập tức
        // Vì review mới thường có status: 'pending' (chờ duyệt).
        // Frontend chỉ nên hiển thị reviews đã 'approved'.
        // Người dùng cần refresh trang để thấy review sau khi Admin duyệt.
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitStatus = 'failed'
        toast.error(`Lỗi gửi đánh giá: ${action.payload}`, { duration: 3000 })
      })

      // Xử lý Update Review Status
      .addCase(updateReviewStatus.pending, (state) => {
        state.error = null
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        // Tìm và cập nhật review trong state.adminReviews
        const reviewIndex = state.adminReviews.findIndex(r => r._id === id)
        if (reviewIndex !== -1) {
          // Cập nhật trạng thái tại chỗ
          state.adminReviews[reviewIndex].status = status
        }
        toast.success('Cập nhật trạng thái thành công!')
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.error = action.payload
        toast.error('Lỗi khi cập nhật trạng thái')
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload)
        state.adminReviews = state.adminReviews.filter((r) => r._id !== action.payload)
      })

  }
})

export const { resetSubmitStatus } = reviewSlice.actions
export default reviewSlice.reducer
