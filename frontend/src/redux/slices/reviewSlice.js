import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProductReviewsAPI,
  fetchAllReviewsAdminAPI,
  submitReviewAPI,
  updateReviewStatusAPI,
  deleteReviewAdminAPI
} from '~/apis/reviewAPI'
import { toast } from 'sonner'

// ================= THUNKS =================

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      return await fetchProductReviewsAPI(productId)
    } catch (error) {
      if (error.response?.status === 404) {
        return []
      }
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchAllReviewsAdmin = createAsyncThunk(
  'reviews/fetchAllReviewsAdmin',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllReviewsAdminAPI()
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá Admin.')
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue }) => {
    const { productId, rating, comment, mediaFiles } = reviewData

    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('rating', rating)
    formData.append('comment', comment)

    if (mediaFiles?.length) {
      mediaFiles.forEach((file) => {
        formData.append('images', file)
      })
    }

    try {
      return await submitReviewAPI(formData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gửi đánh giá')
    }
  }
)

export const updateReviewStatus = createAsyncThunk(
  'reviews/updateReviewStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await updateReviewStatusAPI({ id, status })
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái')
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      return await deleteReviewAdminAPI(reviewId)
    } catch (error) {
      toast.error('Không thể xóa đánh giá')
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// ================= SLICE =================

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    adminReviews: [],
    loading: false,
    adminLoading: false,
    error: null,
    submitStatus: 'idle'
  },
  reducers: {
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle'
    }
  },
  extraReducers: (builder) => {
    builder

      // PRODUCT REVIEWS
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADMIN REVIEWS
      .addCase(fetchAllReviewsAdmin.pending, (state) => {
        state.adminLoading = true
        state.error = null
      })
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, action) => {
        state.adminLoading = false
        state.adminReviews = action.payload
      })
      .addCase(fetchAllReviewsAdmin.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload
      })

      // SUBMIT REVIEW
      .addCase(submitReview.pending, (state) => {
        state.submitStatus = 'loading'
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.submitStatus = 'succeeded'
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitStatus = 'failed'
        toast.error(`Lỗi gửi đánh giá: ${action.payload}`)
      })

      // UPDATE STATUS
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload
        const review = state.adminReviews.find(r => r._id === id)
        if (review) review.status = status

        toast.success('Cập nhật trạng thái thành công!')
      })

      // DELETE
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r._id !== action.payload)
        state.adminReviews = state.adminReviews.filter(r => r._id !== action.payload)
      })
  }
})

export const { resetSubmitStatus } = reviewSlice.actions
export default reviewSlice.reducer
