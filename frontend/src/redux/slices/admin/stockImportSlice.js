import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchStockImportsAPI,
  fetchStockImportDetailAPI,
  createStockImportAPI,
  deleteStockImportAPI
} from '~/apis/stockImportAPI'

export const fetchStockImports = createAsyncThunk(
  'stockImport/fetchAll',
  async (params, { rejectWithValue }) => {
    try { return await fetchStockImportsAPI(params) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const fetchStockImportDetail = createAsyncThunk(
  'stockImport/fetchDetail',
  async (id, { rejectWithValue }) => {
    try { return await fetchStockImportDetailAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const createStockImport = createAsyncThunk(
  'stockImport/create',
  async (data, { rejectWithValue }) => {
    try { return await createStockImportAPI(data) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteStockImport = createAsyncThunk(
  'stockImport/delete',
  async (id, { rejectWithValue }) => {
    try { return await deleteStockImportAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

const stockImportSlice = createSlice({
  name: 'stockImport',
  initialState: {
    imports: [],
    selectedImport: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchStockImports.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchStockImports.fulfilled, (state, action) => {
        state.loading = false
        state.imports = action.payload.imports
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchStockImports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // FETCH DETAIL
      .addCase(fetchStockImportDetail.fulfilled, (state, action) => {
        state.selectedImport = action.payload
      })

      // CREATE
      .addCase(createStockImport.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createStockImport.fulfilled, (state, action) => {
        state.loading = false
        state.imports.unshift(action.payload.stockImport)
        state.successMessage = 'Tạo phiếu nhập thành công!'
      })
      .addCase(createStockImport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // DELETE
      .addCase(deleteStockImport.fulfilled, (state, action) => {
        state.imports = state.imports.filter(i => i._id !== action.payload)
        state.successMessage = 'Đã xóa phiếu nhập'
      })
      .addCase(deleteStockImport.rejected, (state, action) => {
        state.error = action.payload?.message
      })
  }
})

export const { clearMessage } = stockImportSlice.actions
export default stockImportSlice.reducer
