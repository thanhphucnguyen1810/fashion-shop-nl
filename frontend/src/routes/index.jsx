import { Suspense, lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import UserLayout from '~/components/Layouts/UserLayout'
import AdminLayout from '~/components/Admin/AdminLayout'
import ProtectedRoute from '~/components/Common/ProtectedRoute'


/** Loading wrapper giống MUI pattern */
const Loadable = (Component) => (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component {...props} />
  </Suspense>
)

/** USER */
const Home = Loadable(lazy(() => import('~/pages/Home')))
const Login = Loadable(lazy(() => import('~/pages/Login')))
const Register = Loadable(lazy(() => import('~/pages/Register')))
const ForgotPassword = Loadable(lazy(() => import('~/pages/ForgotPasswordPage')))
const ResetPassword = Loadable(lazy(() => import('~/pages/ResetPasswordPage')))
const VerifyEmail = Loadable(lazy(() => import('~/pages/VerifyEmail')))
const Profile = Loadable(lazy(() => import('~/pages/Profile')))
const Contact = Loadable(lazy(() => import('~/pages/Contact')))
const Collection = Loadable(lazy(() => import('~/pages/CollectionPage')))
const ProductDetails = Loadable(lazy(() => import('~/components/Products/ProductDetails')))
const Checkout = Loadable(lazy(() => import('~/components/Cart/Checkout')))
const OrderConfirm = Loadable(lazy(() => import('~/pages/OrderConfirmationPage')))
const OrderSuccess = Loadable(lazy(() => import('~/pages/OrderSuccess')))
const OrderDetails = Loadable(lazy(() => import('~/pages/OrderDetailsPage')))
const MyOrders = Loadable(lazy(() => import('~/components/OrdersStatusTabs')))


/** ADMIN */
const AdminHome = Loadable(lazy(() => import('~/pages/AdminHomePage')))
const Users = Loadable(lazy(() => import('~/components/Admin/UserManagement')))
const UserOrders = Loadable(lazy(() => import('~/components/Admin/UserOrderHistory')))
const Products = Loadable(lazy(() => import('~/components/Admin/ProductManagement')))
const EditProduct = Loadable(lazy(() => import('~/components/Admin/EditProductPage')))
const Orders = Loadable(lazy(() => import('~/components/Admin/OrderManagement')))
const Coupons = Loadable(lazy(() => import('~/components/Admin/AdminDiscountCodes')))
const Reviews = Loadable(lazy(() => import('~/components/Admin/AdminReviews')))
const Categories = Loadable(lazy(() => import('~/components/Admin/CategoryManagement')))
const Logs = Loadable(lazy(() => import('~/components/Admin/AdminLogPage')))
const StockImports = Loadable(lazy(() => import('~/pages/AdminStockImportPage')))
const ShipperLayout = Loadable(lazy(() => import('~/components/Shipper/ShipperLayout')))
const ShipperDashboard = Loadable(lazy(() => import('~/pages/ShipperDashboard')))

export default function Router() {
  return useRoutes([
    /** USER ROUTES */
    {
      path: '/',
      element: <UserLayout />,
      children: [
        { index: true, element: <Home /> },

        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'login/success', element: <Login /> },

        { path: 'verify-email/:token', element: <VerifyEmail /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password/:token', element: <ResetPassword /> },

        { path: 'profile', element: <Profile /> },
        { path: 'contact', element: <Contact /> },

        { path: 'collections', element: <Collection /> },
        { path: 'collections/:collections', element: <Collection /> },

        { path: 'products/:id', element: <ProductDetails /> },

        { path: 'checkout', element: <Checkout /> },
        { path: 'order-confirm/:id', element: <OrderConfirm /> },
        { path: 'order-success/:id', element: <OrderSuccess /> },
        { path: 'order/:id', element: <OrderDetails /> },

        { path: 'my-orders', element: <MyOrders /> }
      ]
    },

    /** ADMIN ROUTES */
    {
      path: '/admin',
      element: (
        <ProtectedRoute role="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminHome /> },

        { path: 'users', element: <Users /> },
        { path: 'users/:userId/orders', element: <UserOrders /> },

        { path: 'products', element: <Products /> },
        { path: 'products/:id/edit', element: <EditProduct /> },

        { path: 'orders', element: <Orders /> },
        { path: 'coupons', element: <Coupons /> },
        { path: 'reviews', element: <Reviews /> },
        { path: 'categories', element: <Categories /> },
        { path: 'security', element: <Logs /> },
        { path: 'stock-imports', element: <StockImports /> }
      ]
    },
    {
      path: '/shipper',
      element: (
        <ProtectedRoute role={['shipper', 'admin']}>
          <ShipperLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <ShipperDashboard /> }

        // sau này thêm:
        // { path: 'orders', element: <ShipperOrders /> }
      ]
    },
    /** fallback */
    { path: '*', element: <Navigate to="/" replace /> }
  ])
}
