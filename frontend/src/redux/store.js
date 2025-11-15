import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/redux/slices/authSlide'

const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

export default store
