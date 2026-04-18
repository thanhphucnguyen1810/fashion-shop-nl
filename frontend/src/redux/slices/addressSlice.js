import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getAddressesAPI,
  addAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI
} from '~/apis/addressAPI'

// ================= STATE =================

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: false
}

// ================= THUNK =================

// GET
export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getAddressesAPI()
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi tải địa chỉ' })
    }
  }
)

// ADD
export const addAddress = createAsyncThunk(
  'address/add',
  async (data, { rejectWithValue }) => {
    try {
      return await addAddressAPI(data)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi thêm địa chỉ' })
    }
  }
)

// UPDATE
export const updateAddress = createAsyncThunk(
  'address/update',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      return await updateAddressAPI(id, updatedData)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật địa chỉ' })
    }
  }
)

// DELETE
export const deleteAddress = createAsyncThunk(
  'address/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteAddressAPI(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Lỗi xóa địa chỉ' })
    }
  }
)

// SET DEFAULT
export const setDefaultAddress = createAsyncThunk(
  'address/default',
  async (id, { rejectWithValue }) => {
    try {
      return await setDefaultAddressAPI(id)
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Không đặt được mặc định' })
    }
  }
)

// ================= SLICE =================

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressStatus: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // ADD
      .addCase(addAddress.pending, (state) => {
        state.success = false
        state.error = null
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.success = true
        state.list.push(action.payload)
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload?.message
      })

      // UPDATE
      .addCase(updateAddress.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a._id === action.payload._id)
        if (idx !== -1) state.list[idx] = action.payload
      })

      // DELETE
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a._id !== action.payload)
      })

      // SET DEFAULT
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.list = state.list.map(a => ({ ...a, isDefault: false }))
        const idx = state.list.findIndex(a => a._id === action.payload._id)
        if (idx !== -1) state.list[idx] = action.payload
      })
  }
})

export const { clearAddressStatus } = addressSlice.actions
export default addressSlice.reducer
