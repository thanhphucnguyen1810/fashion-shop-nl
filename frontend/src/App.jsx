import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import '~/index.css'
import UserLayout from '~/components/Layouts/UserLayout'
import SettingsProvider from '~/contexts/SettingsContext'

import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Register from '~/pages/Register'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmail from './pages/VerifyEmail'
import Profile from '~/pages/Profile'
import CollectionPage from '~/pages/CollectionPage'
import ProductDetails from '~/components/Products/ProductDetails'
import Contact from '~/pages/Contact'
import Checkout from '~/components/Cart/Checkout'
import OrderConfirmationPage from '~/pages/OrderConfirmationPage'
import OrderSuccessPage from '~/pages/OrderSuccess'
import OrderDetailsPage from '~/pages/OrderDetailsPage'
import MyOrdersPage from '~/pages/MyOrdersPage'

import AdminLayout from '~/components/Admin/AdminLayout'
import AdminHomePage from '~/pages/AdminHomePage'
import UserManagement from './components/Admin/UserManagement'
import ProductManagement from './components/Admin/ProductManagement'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManagement from './components/Admin/OrderManagement'
import AdminDiscountCodes from './components/Admin/AdminDiscountCodes'
import AdminReviews from './components/Admin/AdminReviews'
import StockInList from './components/Admin/StockInList'
import ProtectedRoute from './components/Common/ProtectedRoute'
import UserOrderHistory from './components/Admin/UserOrderHistory'
import CategoryManagement from './components/Admin/CategoryManagement'
import OrdersStatusTabs from './components/OrdersStatusTabs'


function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Toaster position='top-right' />
        <Routes>
          {/* User Layout */}
          <Route path='/' element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='login/success' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path='forgot-password' element={<ForgotPasswordPage />} />
            <Route path='reset-password/:token' element={<ResetPasswordPage />} />
            <Route path='profile' element={<Profile />} />
            <Route path='contact' element={<Contact />} />

            {/* Collection Pages */}
            <Route path='collections' element={<CollectionPage />} />
            <Route path='collections/:collections' element={<CollectionPage />} />
            {/* <Route path='collections/:category/:subcategory' element={<CollectionPage />} /> */}

            {/* Product Details */}
            <Route path='products/:id' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='order-confirm/:id' element={<OrderConfirmationPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path='order/:id' element={<OrderDetailsPage />} />
            <Route path='my-orders' element={<OrdersStatusTabs />} />

          </Route>
          {/* Admin Layout */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute role='admin'>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path='users' element={<UserManagement />} />
            <Route path="users/:userId/orders" element={<UserOrderHistory />} />
            <Route path='products' element={<ProductManagement />} />
            <Route path='products/:id/edit' element={<EditProductPage />} />
            <Route path='orders' element={<OrderManagement />} />
            <Route path='coupons' element={<AdminDiscountCodes />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path='stock-in' element={<StockInList />} />
            <Route path='categories' element={<CategoryManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App

