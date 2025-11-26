import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  'adminProducts/fetchAdminProducts',
  async () => {
    const response = await axios.get(
      `${API_URL}/api/admin/products`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
    )
    return response.data
  }
)

// Async function to create a new product
export const createProduct = createAsyncThunk(
  'adminProducts/createProduct',
  async (formData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }
)


// Async function to update an existing product
export const updateProduct = createAsyncThunk(
  'adminProducts/updateProduct',
  async ({ id, productData }) => {
    const response = await axios.put(
      `${API_URL}/api/admin/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }
)

// Async function to delete a product
export const deleteProduct = createAsyncThunk(
  'adminProducts/deleteProduct',
  async (id) => {
    await axios.delete(
      `${API_URL}/api/admin/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    )
    return id
  }
)


const adminProductSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create a product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload.newProduct)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload.product
        const index = state.products.findIndex(p => p._id === updated._id)
        if (index !== -1) state.products[index] = updated
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter((product) => product._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message
      })
  }
})

export default adminProductSlice.reducer
