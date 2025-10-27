import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

// Format currency
const formatCurrency = (value) => `${value.toLocaleString()}đ`

// Reusable Card component
const StatCard = ({ title, value, link, linkText }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <div
      className={`p-4 shadow-md rounded-lg ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      {link && linkText && (
        <Link
          to={link}
          className={`text-sm mt-2 inline-block ${
            isDark ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'
          }`}
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}

const AdminHomePage = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const orders = [
    {
      _id: 12345,
      user: { name: 'Thanh' },
      totalPrice: 120000,
      status: 'Đang xử lý'
    },
    {
      _id: 54321,
      user: { name: 'Phuc' },
      totalPrice: 330000,
      status: 'Đang xử lý'
    },
    {
      _id: 32451,
      user: { name: 'Thanh Phuc' },
      totalPrice: 200000,
      status: 'Đang xử lý'
    }
  ]

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">{'Bảng điều khiển quản trị'}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Doanh thu" value={formatCurrency(totalRevenue)} />
        <StatCard
          title="Tổng đơn hàng"
          value={orders.length}
          link="/admin/orders"
          linkText="Quản lý đơn hàng"
        />
        <StatCard
          title="Tổng sản phẩm"
          value={100}
          link="/admin/products"
          linkText="Quản lý sản phẩm"
        />
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Đơn hàng gần đây</h2>
        <div
          className={`overflow-x-auto rounded-md shadow ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <table
            className={`min-w-full text-left text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <thead
              className={`text-xs uppercase ${
                isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <tr>
                <th className="py-3 px-4">Mã đơn hàng</th>
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">Tổng giá</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className={`border-b transition cursor-pointer ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">{formatCurrency(order.totalPrice)}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className={`p-4 text-center ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Không tìm thấy đơn hàng gần đây.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage
