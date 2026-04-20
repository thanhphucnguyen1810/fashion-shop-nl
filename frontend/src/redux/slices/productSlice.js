import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProductsAPI,
  fetchProductDetailsAPI,
  updateProductAPI,
  fetchSimilarProductsAPI,
  fetchProductReviewsAPI,
  fetchVariantsAPI,
  upsertVariantAPI,
  deleteVariantAPI,
  deleteSizeAPI,
  updateStockAPI

} from '~/apis/productAPI'

// ================= THUNK =================

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProductsAPI(params)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi fetch products' })
    }
  }
)

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchProductDetailsAPI(id)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi details' })
    }
  }
)

export const updatedProduct = createAsyncThunk(
  'products/updateProduct',
  async (data, { rejectWithValue }) => {
    try {
      return await updateProductAPI(data)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Update thất bại' })
    }
  }
)

export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilarProducts',
  async ({ id }, { rejectWithValue }) => {
    try {
      return await fetchSimilarProductsAPI(id)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi similar' })
    }
  }
)

export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const reviews = await fetchProductReviewsAPI(productId)
      return { productId, reviews }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi reviews' })
    }
  }
)

export const fetchVariants = createAsyncThunk(
  'products/fetchVariants',
  async (productId, { rejectWithValue }) => {
    try { return await fetchVariantsAPI(productId) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const upsertVariant = createAsyncThunk(
  'products/upsertVariant',
  async ({ productId, variantData }, { rejectWithValue }) => {
    try { return await upsertVariantAPI(productId, variantData) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteVariant = createAsyncThunk(
  'products/deleteVariant',
  async ({ productId, variantId }, { rejectWithValue }) => {
    try { return await deleteVariantAPI(productId, variantId) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteSize = createAsyncThunk(
  'products/deleteSize',
  async ({ productId, variantId, sizeId }, { rejectWithValue }) => {
    try { return await deleteSizeAPI(productId, variantId, sizeId) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const updateStock = createAsyncThunk(
  'products/updateStock',
  async ({ productId, variantId, sizeId, delta }, { rejectWithValue }) => {
    try { return await updateStockAPI(productId, variantId, sizeId, delta) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)


// ================= STATE =================

const initialState = {
  products: [],
  page: 1,
  pages: 1,
  totalProducts: 0,
  selectedProduct: null,
  reviews: [],
  similarProducts: [],
  variants: [],
  temporaryOrder: null,

  loading: false,
  isFetching: false,
  error: null,

  filters: {
    category: '',
    size: '',
    color: '',
    gender: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
    search: '',
    material: '',
    collection: ''
  }
}

// ================= SLICE =================

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      Object.keys(state.filters).forEach(key => {
        state.filters[key] = ''
      })
    }
  },
  extraReducers: (builder) => {
    builder

      // PRODUCTS
      .addCase(fetchProducts.pending, (state) => {
        state.error = null
        if (state.products.length > 0) state.isFetching = true
        else state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products || []
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.totalProducts = action.payload.totalProducts || 0

        state.loading = false
        state.isFetching = false
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.isFetching = false
        state.error = action.payload?.message
      })

      // DETAILS
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.selectedProduct = action.payload
      })

      // UPDATE
      .addCase(updatedProduct.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.products.findIndex(p => p._id === updated._id)
        if (index !== -1) state.products[index] = updated
      })

      // SIMILAR
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = Array.isArray(action.payload) ? action.payload : []
      })

      // REVIEWS
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews || []
      })

      .addCase(fetchVariants.fulfilled, (state, action) => {
        state.variants = action.payload || []
      })
      .addCase(upsertVariant.fulfilled, (state, action) => {
        state.variants = action.payload || []
        if (state.selectedProduct) state.selectedProduct.variants = action.payload
      })
      .addCase(deleteVariant.fulfilled, (state, action) => {
        state.variants = action.payload || []
        if (state.selectedProduct) state.selectedProduct.variants = action.payload
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.variants = action.payload || []
        if (state.selectedProduct) state.selectedProduct.variants = action.payload
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        // action.payload là size object đã update
        const updatedSize = action.payload
        state.variants = state.variants.map(v => ({
          ...v,
          sizes: v.sizes.map(s => s._id === updatedSize._id ? updatedSize : s)
        }))
      })

  }
})

export const { setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer
