import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/orders`,
        // Lấy token từ localStorage hoặc cơ chế quản lý token của bạn
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// update orders delivery status
export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// delete an order
export const deleteOrder = createAsyncThunk(
  'adminOrders/deleteOrder', // Đã xóa khoảng trắng dư thừa trong tên
  async (id, { rejectWithValue }) => { // Chỉ nhận ID là tham số
    try {
      await axios.delete(
        `${API_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      )
      return id // Trả về ID để filter trong reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)


const adminOrderSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true,
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
        state.totalOrders = action.payload.length
        // calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice
        }, 0)
        state.totalSales = totalSales
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch orders'
      })

    // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload
        const orderIndex = state.orders.findIndex((order) => order._id === updatedOrder._id)
        if ( orderIndex !== -1) {
          // Thay thế đơn hàng cũ bằng dữ liệu mới nhất (có user populated)
          state.orders[orderIndex] = updatedOrder
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error('Update status failed:', action.payload)
      })

    // Delete Orders
      .addCase(deleteOrder.fulfilled, (state, action) => {
        // action.payload là ID của đơn hàng đã xóa
        state.orders = state.orders.filter((order) => order._id !== action.payload)
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        // Xử lý lỗi nếu cần
        console.error('Delete order failed:', action.payload)
      })
  }
})

export default adminOrderSlice.reducer
