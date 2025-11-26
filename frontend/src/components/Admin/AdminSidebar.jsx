import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
  FaStar,
  FaCog,
  FaTags,
  FaWarehouse,
  FaBell,
  FaChartBar,
  FaPenNib,
  FaEdit,
  FaTruck
} from 'react-icons/fa'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { logout } from '~/redux/slices/authSlice'
import { clearCart } from '~/redux/slices/cartSlices'

// Menu items definition
const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: <FaChartBar /> },
  { to: '/admin/users', label: 'Người dùng', icon: <FaUser /> },
  { to: '/admin/products', label: 'Sản phẩm', icon: <FaBoxOpen /> },
  { to: '/admin/categories', label: 'Danh mục', icon: <FaTags /> },

  { to: '/admin/orders', label: 'Đơn hàng', icon: <FaClipboardList /> },
  { to: '/admin/shipping', label: 'Vận chuyển', icon: <FaTruck /> },

  { to: '/admin/coupons', label: 'Mã giảm giá', icon: <FaTags /> },
  { to: '/admin/reviews', label: 'Đánh giá', icon: <FaStar /> },
  { to: '/admin/stock-in', label: 'Nhập hàng', icon: <FaWarehouse /> },

  { to: '/admin/blog', label: 'Blog', icon: <FaPenNib /> },
  { to: '/admin/posts', label: 'Bài viết', icon: <FaEdit /> },
  { to: '/', label: 'Cửa hàng', icon: <FaStore /> }
]

const AdminSidebar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  return (
    <aside
      className="p-6"
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        borderRight: `1px solid ${theme.palette.divider}`
      }}
    >
      {/* Logo */}
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium" style={{ color: theme.palette.primary.main }}>
          TheAurora
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-xl font-medium mb-6 text-center" style={{ color: theme.palette.text.primary }}>
        Quản trị
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2">
        {menuItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const baseStyle = {
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: isActive
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                backgroundColor: isActive
                  ? theme.palette.primary.main
                  : 'transparent',
                textDecoration: 'none'
              }

              const hoverStyle = {
                backgroundColor: !isActive
                  ? alpha(theme.palette.action.hover, 0.1)
                  : baseStyle.backgroundColor,
                color: !isActive ? theme.palette.text.primary : baseStyle.color
              }

              return {
                ...baseStyle,
                ':hover': hoverStyle
              }
            }}
            style={({ isActive }) => ({
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: isActive
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              backgroundColor: isActive
                ? theme.palette.primary.main
                : 'transparent',
              textDecoration: 'none',
              transition: 'background-color 0.2s ease',
              fontWeight: isActive ? 500 : 400
            })}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 rounded flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.palette.error.dark)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.palette.error.main)
          }
        >
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
