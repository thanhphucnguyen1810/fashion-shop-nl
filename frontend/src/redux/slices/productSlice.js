import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Async thunk fetch sản phẩm từ backend với params filter
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
    page
  }) => {
    const query = new URLSearchParams()
    if (collection) query.append('collection', collection)
    if (size) query.append('size', size)
    if (color) query.append('color', color)
    if (gender) query.append('gender', gender)
    if (minPrice) query.append('minPrice', minPrice)
    if (maxPrice) query.append('maxPrice', maxPrice)
    if (sortBy) query.append('sortBy', sortBy)
    if (search) query.append('search', search)
    if (category) query.append('category', category)
    if (material) query.append('material', material)
    if (brand) query.append('brand', brand)
    if (page) query.append('page', page)
    if (limit) query.append('limit', limit)

    const response = await axios.get(`${API_URL}/api/products?${query.toString()}`)
    return response.data
  }
)

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (id) => {
  const response = await axios.get(`${API_URL}/api/products/${id}`)
  return response.data
})

// Async thunk to update products
export const updatedProduct = createAsyncThunk('products/updateProduct', async({ id, productData }) => {
  const response = await axios.put(`${API_URL}/api/products/${id}`, productData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      }
    }
  )
  return response.data
})

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk('products/fetchSimilarProducts', async ({ id }) => {
  const response = await axios.get(`${API_URL}/api/products/similar/${id}`)
  return response.data
})

// Tạo đơn hàng/mục tạm thời cho hành động Mua Ngay
export const createTemporaryOrder = createAsyncThunk(
  'products/createTemporaryOrder',
  async ({ orderItems, userId, guestId }, { rejectWithValue }) => {
    try {
      // API endpoint này cần được thiết lập ở Backend (Ví dụ: /api/orders/buy-now)
      const response = await axios.post(`${API_URL}/api/orders/buy-now`, {
        orderItems,
        userId,
        guestId
      },
      {
        headers: {
          // Sử dụng token nếu có, mặc dù action này có thể áp dụng cho guest
          Authorization: userId ? `Bearer ${localStorage.getItem('userToken')}` : undefined
        }
      })
      // Backend nên trả về một ID của đơn hàng tạm thời vừa được tạo
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  }
)

// fetch reviews
export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId) => {
    const response = await axios.get(`${API_URL}/api/reviews/product/${productId}`)
    return { productId, reviews: response.data }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    reviews: [],
    similarProducts: [],
    temporaryOrder: null,
    loading: 'idle',
    isFetching: false,
    error: null,
    page: 1,
    pages: 1,
    totalProducts: 0,
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
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
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
  },
  extraReducers: (builder) => {
    builder
      // handle fetching products with filters
      .addCase(fetchProducts.pending, (state) => {
        if (state.products.length > 0) {
          state.isFetching = true
        }
        else {
          state.loading = 'pending'
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products

        // Cập nhật thông tin phân trang (nếu có)
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.totalProducts = action.payload.totalProducts || 0

        state.loading = 'succeeded'
        state.isFetching = false
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.isFetching = false
        state.error = action.error.message
      })


    // handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false,
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false,
        state.error = action.error.message
      })

    // handle updating product
      .addCase(updatedProduct.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(updatedProduct.fulfilled, (state, action) => {
        state.loading = false
        const updatedProduct = action.payload
        const index = state.products.findIndex((product) => product._id === updatedProduct._id)
        if (index !== -1) {
          state.products[index] = updatedProduct
        }
      })
      .addCase(updatedProduct.rejected, (state, action) => {
        state.loading = false,
        state.error = action.error.message
      })

      // handle
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false,
        state.similarProducts = action.payload
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false,
        state.error = action.error.message
      })

      // handle createTemporaryOrder
      .addCase(createTemporaryOrder.pending, (state) => {
        state.loading = true
        state.error = null
        state.temporaryOrder = null
      })
      .addCase(createTemporaryOrder.fulfilled, (state, action) => {
        state.loading = false
        // Giả sử response.data là { orderId: '...' }
        state.temporaryOrder = action.payload
        // Trạng thái này sẽ không dùng nhiều, vì a điều hướng ngay
      })
      .addCase(createTemporaryOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

      // handle fetching reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = 'pending'
        state.error = null
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews
        state.loading = 'succeeded'
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message
      })
  }
})
export const { setFilters, clearFilters } = productSlice.actions
export default productSlice.reducer
