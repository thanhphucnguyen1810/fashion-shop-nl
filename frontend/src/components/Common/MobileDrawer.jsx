import { useTheme } from '@mui/material/styles'
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'

const MobileDrawer = ({ navDrawerOpen, toggleNavDrawer }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tất cả sản phẩm', path: '/collections/all' },
    { label: 'Thời trang nam', path: '/collections/men' },
    { label: 'Thời trang nữ', path: '/collections/women' },
    { label: 'Phụ kiện', path: '/collections/accessories' },
    { label: 'Liên hệ', path: '/contact' },
    { label: 'Đăng nhập', path: '/login' },
    { label: 'Đăng ký', path: '/register' }
  ]

  const getColor = (hovered = false) => {
    if (isDark) {
      return hovered ? theme.palette.text.primary : theme.palette.text.secondary
    }
    return hovered ? theme.palette.primary.dark : theme.palette.primary.light
  }

  return (
    <div
      className={`fixed top-0 left-0 w-3/4 max-w-xs h-full shadow-xl transform transition-transform duration-300 z-50 ${
        navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-label"
    >
      <div className="flex justify-end p-4">
        <button
          onClick={toggleNavDrawer}
          aria-label="Đóng menu"
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded"
        >
          <IoMdClose
            className="w-6 h-6 transition-colors"
            style={{
              color: isDark ? theme.palette.text.secondary : theme.palette.grey[700]
            }}
          />
        </button>
      </div>

      <div className="px-6 py-4">
        <h2
          id="mobile-menu-label"
          className="text-lg font-Lobster mb-5"
          style={{
            color: isDark ? theme.palette.info.light : theme.palette.primary.main
          }}
        >
          Danh mục
        </h2>

        <nav className="flex flex-col space-y-3" role="menu">
          {navLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              onClick={toggleNavDrawer}
              className="block font-Poppins text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors duration-200"
              style={{ color: getColor(false) }}
              onFocus={(e) => (e.target.style.color = getColor(true))}
              onBlur={(e) => (e.target.style.color = getColor(false))}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default MobileDrawer
