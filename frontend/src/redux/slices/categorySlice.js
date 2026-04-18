import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI
} from '~/apis/categoryAPI'

// ================= THUNK =================

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesAPI()
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tải danh mục.')
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (formData, { rejectWithValue }) => {
    try {
      return await createCategoryAPI(formData)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể tạo danh mục')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateCategoryAPI({ id, formData })
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể cập nhật')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      return await deleteCategoryAPI(categoryId)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Không thể xóa danh mục')
    }
  }
)

// ================= STATE =================

const initialState = {
  items: [],
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null
}

// ================= SLICE =================

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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // CREATE
      .addCase(createCategory.pending, (state) => {
        state.operationLoading = true
        state.operationError = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.operationLoading = false
        state.operationError = action.payload
      })

      // UPDATE
      .addCase(updateCategory.pending, (state) => {
        state.operationLoading = true
        state.operationError = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (cat) => cat._id === action.payload._id
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.operationLoading = false
        state.operationError = action.payload
      })

      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.operationLoading = true
        state.operationError = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (category) => category._id !== action.payload
        )
        state.operationLoading = false
        state.operationError = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.operationLoading = false
        state.operationError = action.payload
      })
  }
})

export const { clearCategoryError, clearOperationLoading } = categorySlice.actions
export default categorySlice.reducer
