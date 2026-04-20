import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchAdminProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  upsertVariantAPI,
  deleteVariantAPI,
  deleteSizeAPI
} from '~/apis/adminProductAPI'

// ================= PRODUCT THUNKS =================

export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAdminProducts',
  async ({ search = '', page = 1 } = {}, { rejectWithValue }) => {
    try { return await fetchAdminProductsAPI({ search, page }) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const createProduct = createAsyncThunk(
  'adminProducts/createProduct',
  async (formData, { rejectWithValue }) => {
    try { return await createProductAPI(formData) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const updateProduct = createAsyncThunk(
  'adminProducts/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try { return await updateProductAPI({ id, productData }) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteProduct = createAsyncThunk(
  'adminProducts/deleteProduct',
  async (id, { rejectWithValue }) => {
    try { return await deleteProductAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

// ================= VARIANT THUNKS =================

export const upsertVariant = createAsyncThunk(
  'adminProducts/upsertVariant',
  async ({ productId, variantData }, { rejectWithValue }) => {
    try {
      const res = await upsertVariantAPI(productId, variantData)
      return { productId, variants: res.variants }
    } catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteVariant = createAsyncThunk(
  'adminProducts/deleteVariant',
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const res = await deleteVariantAPI(productId, variantId)
      return { productId, variants: res.variants }
    } catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteSize = createAsyncThunk(
  'adminProducts/deleteSize',
  async ({ productId, variantId, sizeId }, { rejectWithValue }) => {
    try {
      const res = await deleteSizeAPI(productId, variantId, sizeId)
      return { productId, variants: res.variants }
    } catch (err) { return rejectWithValue(err.response?.data) }
  }
)

// ================= SLICE =================

const syncVariants = (state, action) => {
  state.loading = false
  const { productId, variants } = action.payload
  const idx = state.products.findIndex(p => p._id === productId)
  if (idx !== -1) state.products[idx].variants = variants
}

const adminProductSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    products: [],
    page: 1,
    pages: 1,
    totalProducts: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAdminProducts.pending, (state) => { state.loading = true })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.totalProducts = action.payload.totalProducts
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

      // CREATE
      .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload.newProduct)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

      // UPDATE
      .addCase(updateProduct.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload.product
        const idx = state.products.findIndex(p => p._id === updated._id)
        if (idx !== -1) state.products[idx] = updated
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

      // DELETE
      .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(p => p._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

      // VARIANTS
      .addCase(upsertVariant.pending, (state) => { state.loading = true })
      .addCase(upsertVariant.fulfilled, syncVariants)
      .addCase(upsertVariant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      .addCase(deleteVariant.pending, (state) => { state.loading = true })
      .addCase(deleteVariant.fulfilled, syncVariants)
      .addCase(deleteVariant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      .addCase(deleteSize.pending, (state) => { state.loading = true })
      .addCase(deleteSize.fulfilled, syncVariants)
      .addCase(deleteSize.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })
  }
})

export default adminProductSlice.reducer
