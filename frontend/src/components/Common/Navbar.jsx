import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight
} from 'react-icons/hi2'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@mui/material/styles'

import SearchBar from './SearchBar'
import CartDrawer from '~/components/Layouts/CartDrawer'
import MobileDrawer from '~/components/Common/MobileDrawer'
import DesktopNav from './DesktopNav'
import { useSelector } from 'react-redux'

const ACCENT_COLOR = '#00ABFD'
const CTA_COLOR = '#F7D87C'

const Navbar = () => {

  const theme = useTheme()
  const primaryColor = ACCENT_COLOR

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen)
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen)

  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const isLoggedIn = !!user
  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0


  return (
    <>
      <nav className="w-full flex items-center justify-between py-2 px-4 md:px-6 relative z-40 bg-white dark:bg-slate-900 shadow-sm">
        {/* Bên trái: Logo + Nav */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold font-Lobster tracking-wide flex-shrink-0"
            style={{ color: primaryColor }}
          >
             TheAurora
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex flex-1 justify-center items-center min-w-0 ml-4">
            <DesktopNav />
          </div>
        </div>

        {/* Bên phải: Icons */}
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">


          <button className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-400 transition">
            { user && user.role === 'admin' && (
              <Link
                to='/admin'
                className='block bg-gray-500 px-2 rounded text-sm text-white'
              >
              Admin
              </Link>
            )}
          </button>

          {/* Search */}
          <div className='overflow-hidden'>
            <SearchBar />
          </div>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-3">
              {/* Hồ sơ */}
              <Link
                to="/profile"
                className="flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                title={`${user?.name || 'Người dùng'}`}
              >
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar?.url}
                    alt={user.name || 'Avatar'}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-gray-300 dark:border-gray-500"
                  />
                ) : (
                  <div
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : <HiOutlineUser className="w-4 h-4" />}
                  </div>
                )}

                <span
                  className="hidden lg:inline ml-2 text-sm font-medium"
                  style={{ color: theme.palette.text.primary }}
                >
                  {user?.name || 'Hồ sơ'}
                </span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ease-in-out border border-current hover:bg-opacity-5 hover:bg-current"
                style={{
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.text.primary
                }}
              >
               Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-1.5 rounded-full shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                style={{
                  backgroundColor: CTA_COLOR,
                  color: theme.palette.text.primary
                }}
              >
             Đăng ký
              </Link>
            </div>
          )}


          {/* Giỏ hàng */}
          <button
            onClick={toggleCartDrawer}
            className="relative p-2"
            title="Giỏ hàng"
          >
            <HiOutlineShoppingBag className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Dark/Light mode */}
          {/* <button
            onClick={onToggleMode}
            className="text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
            title="Chuyển giao diện sáng/tối"
          >
            {theme.palette.mode === 'light' ? (
              <FiMoon style={{ color: primaryColor }} />
            ) : (
              <FiSun style={{ color: CTA_COLOR }} />
            )}
          </button> */}

          {/* Menu di động */}
          <button
            onClick={toggleNavDrawer}
            className="md:hidden p-2"
            title="Danh mục"
          >
            <HiBars3BottomRight className="w-6 h-6" style={{ color: primaryColor }} />
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      <MobileDrawer navDrawerOpen={navDrawerOpen} toggleNavDrawer={toggleNavDrawer} />

    </>
  )
}

export default Navbar
