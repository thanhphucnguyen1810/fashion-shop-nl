import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchAllReviewsAdminAPI,
  updateReviewStatusAPI,
  deleteReviewAdminAPI
} from '~/apis/reviewAPI'

export const fetchAllReviewsAdmin = createAsyncThunk(
  'reviews/fetchAllAdmin',
  async ({ page = 1, search = '' } = {}, { rejectWithValue }) => {
    try { return await fetchAllReviewsAdminAPI({ page, search }) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const updateReviewStatus = createAsyncThunk(
  'reviews/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try { return await updateReviewStatusAPI({ id, status }) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try { return await deleteReviewAdminAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    adminReviews: [],
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchAllReviewsAdmin.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.adminReviews = action.payload.reviews
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.total = action.payload.total
      })
      .addCase(fetchAllReviewsAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // UPDATE STATUS
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const updated = action.payload
        const idx = state.adminReviews.findIndex(r => r._id === updated._id)
        if (idx !== -1) state.adminReviews[idx] = updated
      })

      // DELETE
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.adminReviews = state.adminReviews.filter(r => r._id !== action.payload)
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload?.message
      })
  }
})

export default reviewSlice.reducer
