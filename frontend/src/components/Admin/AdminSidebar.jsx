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
  const isDark = theme.palette.mode === 'dark'

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  return (
    <aside
      className="p-6 flex flex-col" // Sử dụng flex-col để chia không gian
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        height: '100vh', // Cố định chiều cao bằng màn hình
        position: 'sticky', // Giữ sidebar đứng yên khi scroll trang chính
        top: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        width: '260px' // Đảm bảo độ rộng cố định
      }}
    >
      {/* Phần Logo: Không cuộn */}
      <div className="mb-6 flex-shrink-0">
        <Link to="/admin" className="text-2xl font-bold tracking-tighter" style={{ color: theme.palette.primary.main }}>
          TheAurora
        </Link>
        <h2 className="text-xs uppercase tracking-widest mt-2 opacity-50 font-bold">
          Admin Panel
        </h2>
      </div>

      {/* Phần Navigation: CÓ THANH CUỘN RIÊNG */}
      <nav
        className="flex-grow overflow-y-auto pr-2 custom-scrollbar"
        style={{
          /* Tùy chỉnh thanh cuộn cho Chrome/Safari */
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none'
        }}
      >
        <div className="flex flex-col space-y-1">
          {menuItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: isActive
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                backgroundColor: isActive
                  ? theme.palette.primary.main
                  : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem'
              })}
              // Hiệu ứng hover cho NavLink
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = alpha(theme.palette.primary.main, 0.08)
                  e.currentTarget.style.color = theme.palette.primary.main
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = theme.palette.text.secondary
                }
              }}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Phần Logout: Không cuộn, luôn nằm dưới cùng */}
      <div className="mt-6 pt-4 flex-shrink-0 border-t border-dashed border-gray-500/20">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          style={{
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.error.main
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = alpha(theme.palette.error.main, 0.1)
            e.currentTarget.style.color = theme.palette.error.main
          }}
        >
          <FaSignOutAlt />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* CSS Injection cho scrollbar đẹp hơn */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#374151' : '#e5e7eb'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.palette.primary.main};
        }
      ` }} />
    </aside>
  )
}

export default AdminSidebar
