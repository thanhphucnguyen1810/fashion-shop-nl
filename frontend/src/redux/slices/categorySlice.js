import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ================================ THUNKS (API Calls) ===================================

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tải danh mục.')
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await axios.post(
        `${API_URL}/api/categories`,
        formData,
        config
      )

      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tạo danh mục')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, formData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
      const response = await axios.patch(`${API_URL}/api/categories/${id}`, formData, config)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể cập nhật')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token
      const config = { headers: { Authorization: `Bearer ${token}` } }
      await axios.delete(`${API_URL}/api/categories/${categoryId}`, config)
      return categoryId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể xóa danh mục')
    }
  }
)

// ================================ SLICE VÀ REDUCERS ===================================

const initialState = {
  items: [],
  loading: false, // Loading chung cho fetch
  error: null, // Lỗi chung cho fetch
  operationLoading: false, // Loading cho C, U, D
  operationError: null // Lỗi cho C, U, D
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
      state.operationError = null
    },
    clearOperationLoading: (state) => {
      state.operationLoading = false
    }
  },
  extraReducers: (builder) => {
    builder
    // FETCH
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload })

    // CREATE
      .addCase(createCategory.pending, (state) => { state.operationLoading = true; state.operationError = null })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(createCategory.rejected, (state, action) => { state.operationLoading = false; state.operationError = action.payload })


    // UPDATE
      .addCase(updateCategory.pending, (state) => { state.operationLoading = true; state.operationError = null })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((cat) => cat._id === action.payload._id)
        if (index !== -1) { state.items[index] = action.payload }
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(updateCategory.rejected, (state, action) => { state.operationLoading = false; state.operationError = action.payload })


    // DELETE
      .addCase(deleteCategory.pending, (state) => { state.operationLoading = true; state.operationError = null })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((category) => category._id !== action.payload)
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(deleteCategory.rejected, (state, action) => { state.operationLoading = false; state.operationError = action.payload })
  }
})

export const { clearCategoryError, clearOperationLoading } = categorySlice.actions
export default categorySlice.reducer
