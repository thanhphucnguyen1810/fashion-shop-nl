import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProductsAPI,
  fetchProductDetailsAPI,
  updateProductAPI,
  fetchSimilarProductsAPI,
  fetchProductReviewsAPI
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

// ================= STATE =================

const initialState = {
  products: [],
  page: 1,
  pages: 1,
  totalProducts: 0,
  selectedProduct: null,
  reviews: [],
  similarProducts: [],
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
  }
})

export const { setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer
