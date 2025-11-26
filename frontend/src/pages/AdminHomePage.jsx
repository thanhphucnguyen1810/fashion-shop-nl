import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchAdminProducts } from '~/redux/slices/admin/adminProductSlice'
import { fetchAllOrders } from '~/redux/slices/admin/adminOrderSlice'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts' // <-- Thêm imports cho Recharts

// Format currency
const formatCurrency = (value) => `${value.toFixed(2).toLocaleString()}đ`

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

// Component Biểu đồ thống kê trạng thái đơn hàng
const OrderStatsChart = ({ data, isDark }) => {
  return (
    <div
      className={`p-4 shadow-md rounded-lg ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">{'Thống kê số lượng đơn hàng theo trạng thái'}</h2>
      {data.length === 0 ? (
        <p className='text-center py-10 text-gray-500'>Không có dữ liệu đơn hàng để hiển thị biểu đồ.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            barSize={30}
          >
            {/* Đường kẻ ngang mờ */}
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4b5563' : '#e5e7eb'} />
            {/* Trục X: Tên trạng thái */}
            <XAxis dataKey="name" stroke={isDark ? '#d1d5db' : '#4b5563'} />
            {/* Trục Y: Số lượng đơn */}
            <YAxis stroke={isDark ? '#d1d5db' : '#4b5563'} allowDecimals={false} />
            {/* Tooltip khi di chuột */}
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                color: isDark ? '#ffffff' : '#1f2937',
                fontSize: '14px'
              }}
              labelStyle={{ color: isDark ? '#ffffff' : '#1f2937', fontWeight: 'bold' }}
              formatter={(value, name) => [`${value} đơn`, 'Số lượng']}
            />
            {/* Thanh Bar. Sử dụng dataKey="value" để lấy số lượng, và fill để lấy màu đã gán */}
            <Bar dataKey="value" name="Số lượng đơn" fill="#8884d8"
              data={data.map(item => ({ ...item, fill: item.fill }))}
            />

          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// Hàm gán màu sắc cho từng trạng thái
const getColorForStatus = (status) => {
  switch (status) {
  case 'Pending':
    return '#ffc107' // Vàng (Đang chờ)
  case 'Processing':
    return '#17a2b8' // Xanh lam (Đang xử lý)
  case 'Delivered':
    return '#28a745' // Xanh lá (Đã giao)
  case 'Cancelled':
    return '#dc3545' // Đỏ (Đã hủy)
  default:
    return '#6c757d' // Xám (Không xác định)
  }
}

// Hàm xử lý dữ liệu đơn hàng thành định dạng cho biểu đồ
const getOrderStatusData = (orders) => {
  if (!orders || orders.length === 0) return []

  // Đếm số lượng đơn hàng theo trạng thái
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'Không xác định'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Chuyển đổi sang định dạng Recharts: [{ name: 'Status', value: count, fill: color }]
  // Sắp xếp giảm dần theo số lượng đơn
  return Object.keys(statusCounts)
    .map((status) => ({
      name: status,
      value: statusCounts[status],
      fill: getColorForStatus(status)
    }))
    .sort((a, b) => b.value - a.value)
}


const AdminHomePage = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const dispatch = useDispatch()

  const {
    products,
    loading: productsLoading,
    error: productsError
  } = useSelector((state) => state.adminProducts)
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error:ordersError
  } = useSelector((state) => state.adminOrders)

  // Xử lý dữ liệu cho biểu đồ
  const orderStatusData = getOrderStatusData(orders)

  useEffect(() => {
    dispatch(fetchAdminProducts())
    dispatch(fetchAllOrders())
  }, [dispatch]) // Thêm dispatch vào dependency array để tránh lỗi

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">{'Bảng điều khiển quản trị'}</h1>

      {/* Summary Cards */}
      {productsLoading || ordersLoading ? (
        <p>Loading...</p>
      ): productsError ? (
        <p className='text-red-500'> Error fetching products: {productsError}</p>
      ): ordersError ? (
        <p className='text-red-500'> Error fetching orders: {ordersError}</p>
      ): (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Doanh thu"
              value={formatCurrency(totalSales)}
            />
            <StatCard
              title="Tổng đơn hàng"
              value={totalOrders}
              link="/admin/orders"
              linkText="Quản lý đơn hàng"
            />
            <StatCard
              title="Tổng sản phẩm"
              value={products.length}
              link="/admin/products"
              linkText="Quản lý sản phẩm"
            />
          </div>

          {/* New Chart Section */}
          <div className="mt-8">
            <OrderStatsChart data={orderStatusData} isDark={isDark} />
          </div>
        </>
      )}


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
                // Chỉ hiển thị 5 đơn hàng gần nhất cho bảng đơn hàng gần đây
                orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className={`border-b transition cursor-pointer ${
                      isDark
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name || 'Guest'}</td>
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
