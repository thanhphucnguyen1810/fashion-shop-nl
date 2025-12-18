import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/redux/slices/authSlice'
import productReducer from '~/redux/slices/productSlice'
import cartReducer from '~/redux/slices/cartSlices'
import adminCouponsReducer from '~/redux/slices/admin/adminCouponSlice'
import checkoutReducer from '~/redux/slices/checkoutSlice'
import orderReducer from '~/redux/slices/orderSlice'
import adminReducer from '~/redux/slices/admin/adminUserSlice'
import adminProductReducer from '~/redux/slices/admin/adminProductSlice'
import adminOrderReducer from '~/redux/slices/admin/adminOrderSlice'
import categoryReducer from '~/redux/slices/categorySlice'
import reviewReducer from '~/redux/slices/reviewSlice'
import addressReducer from '~/redux/slices/addressSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    reviews: reviewReducer,
    address: addressReducer,
    adminCoupons: adminCouponsReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer
  }
})

export default store
