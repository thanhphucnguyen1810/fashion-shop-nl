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
import useSettings from '~/hooks/useSettings'
import DesktopNav from './DesktopNav'

const Navbar = () => {
  const theme = useTheme()
  const { onToggleMode } = useSettings()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen)
  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen)

  const primaryColor = theme.palette.primary.main

  return (
    <>
      <nav className="w-full flex items-center justify-between py-2 px-4 md:px-6 relative z-40 bg-white dark:bg-slate-900 shadow-sm">
        {/* Bên trái: Logo + Nav */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg md:text-xl font-bold font-Lobster tracking-wide flex-shrink-0"
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
          {/* Dark/Light mode */}
          <button
            onClick={onToggleMode}
            className="text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
            title="Chuyển giao diện sáng/tối"
          >
            {theme.palette.mode === 'light' ? (
              <FiMoon style={{ color: primaryColor }} />
            ) : (
              <FiSun style={{ color: theme.palette.warning.light }} />
            )}
          </button>

          <button className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-400 transition">
            <Link
              to='/admin'
              className='block bg-gray-500 px-2 rounded text-sm text-white'
            >
              Admin
            </Link>
          </button>

          {/* Đăng nhập / Đăng ký */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/login"
              className="text-sm font-medium hover:underline"
              style={{ color: theme.palette.text.primary }}
            >
              Đăng nhập
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/register"
              className="text-sm font-medium hover:underline"
              style={{ color: theme.palette.primary.main }}
            >
              Đăng ký
            </Link>
          </div>

          {/* Hồ sơ */}
          <Link
            to="/profile"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
            title="Hồ sơ cá nhân"
          >
            <HiOutlineUser className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
          </Link>

          {/* Giỏ hàng */}
          <button
            onClick={toggleCartDrawer}
            className="relative p-2"
            title="Giỏ hàng"
          >
            <HiOutlineShoppingBag className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
              4
            </span>
          </button>

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
