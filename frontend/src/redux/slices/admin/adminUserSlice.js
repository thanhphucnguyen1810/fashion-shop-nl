import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL


// fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async () => {
    const response = await axios.get(
      `${API_URL}/api/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    )
    return response.data
  }
)

// Add the create user action
export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const fd = new FormData()
      fd.append('name', userData.name)
      fd.append('email', userData.email)
      fd.append('password', userData.password)
      fd.append('role', userData.role)
      fd.append('gender', userData.gender)
      if (userData.avatarFile) fd.append('avatar', userData.avatarFile)

      const response = await axios.post(
        `${API_URL}/api/admin/users`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Update user info
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, name, email, role, gender, avatarFile }) => {
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('role', role)
    fd.append('gender', gender)
    if (avatarFile) fd.append('avatar', avatarFile)

    const response = await axios.put(
      `${API_URL}/api/admin/users/${id}`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.user
  }
)

// Delete a user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id) => {
    await axios.delete(
      `${API_URL}/api/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      }
    )
    return id
  }
)

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/admin/users/${id}/status`, { isBlocked })
      return data.user
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // -------------------------------------------------------------
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // -------------------------------------------------------------
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })

      // -------------------------------------------------------------
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload)
      })

      // -------------------------------------------------------------
      // add User
      .addCase(addUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload.user) // add new user to the state
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = true
        state.error = action.payload.message
      })
    // -------------------------------------------------------------
    // Xử lý khi toggleUserStatus thành công
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload
        // Cập nhật người dùng trong mảng users của state
        state.users = state.users.map(user =>
          user._id === updatedUser._id ? updatedUser : user
        )
        state.loading = false
        state.error = null
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
    // -------------------------------------------------------------
  }
})

export default adminSlice.reducer
