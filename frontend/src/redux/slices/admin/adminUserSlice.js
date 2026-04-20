import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchUsersAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI,
  toggleUserStatusAPI
} from '~/apis/adminUserAPI'

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try { return await fetchUsersAPI() }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    try { return await addUserAPI(userData) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async (userData, { rejectWithValue }) => {
    try { return await updateUserAPI(userData) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try { return await deleteUserAPI(id) }
    catch (err) { return rejectWithValue(err.response?.data) }
  }
)

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try { return await toggleUserStatusAPI({ id, isBlocked }) }
    catch (err) { return rejectWithValue(err.response?.data?.message || err.message) }
  }
)

// ================= SLICE =================

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
      // FETCH
      .addCase(fetchUsers.pending, (state) => { state.loading = true })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

      // ADD
      .addCase(addUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.push(action.payload.user)
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex(u => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload)
      })

      // TOGGLE STATUS
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.users = state.users.map(u =>
          u._id === action.payload._id ? action.payload : u
        )
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default adminSlice.reducer
