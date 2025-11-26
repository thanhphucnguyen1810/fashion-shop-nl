import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom' // Giữ lại Link nếu cần
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserOrders } from '~/redux/slices/orderSlice'
import { CircularProgress, Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// --- Hàm chuyển đổi trạng thái (Giả định trạng thái order của bạn) ---
const getOrderStatusDisplay = (order) => {
  // Giả định trạng thái đơn hàng có trường 'status' trong DB
  const status = order.status || 'Pending' // Thêm trường status vào Order Model

  // Nếu chưa thanh toán và không phải COD => Cần thanh toán
  if (!order.isPaid && order.paymentMethod !== 'COD') {
    return { text: 'Chờ thanh toán', color: 'bg-red-100 text-red-700', icon: 'fa-solid fa-hourglass-half' }
  }

  switch (status.toLowerCase()) {
  case 'pending':
    return { text: 'Đang chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: 'fa-solid fa-box-open' }
  case 'processing':
    return { text: 'Đang đóng gói', color: 'bg-orange-100 text-orange-700', icon: 'fa-solid fa-box' }
  case 'shipped':
    return { text: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700', icon: 'fa-solid fa-truck-fast' }
  case 'delivered':
    return { text: 'Đã giao hàng', color: 'bg-green-100 text-green-700', icon: 'fa-solid fa-circle-check' }
  case 'cancelled':
    return { text: 'Đã hủy', color: 'bg-gray-100 text-gray-700', icon: 'fa-solid fa-circle-xmark' }
  default:
    return { text: 'Không xác định', color: 'bg-gray-100 text-gray-700', icon: 'fa-solid fa-circle-question' }
  }
}

const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const MyOrdersPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    dispatch(fetchUserOrders())
  }, [dispatch])

  const handleRowClick = (orderId) => {
    // Chuyển hướng đến trang chi tiết đơn hàng
    navigate(`/order/${orderId}`)
  }

  // Lọc đơn hàng
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.shippingAddress?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === 'all' ||
                (order.status || 'pending').toLowerCase() === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, filterStatus])


  if ( loading ) return (
    <Box className="min-h-[60vh] flex flex-col items-center justify-center">
      <CircularProgress color="primary" />
      <p className="mt-4 text-gray-500">Đang tải danh sách đơn hàng...</p>
    </Box>
  )
  if ( error ) return <p className="text-red-600 text-center mt-10">Lỗi khi tải đơn hàng: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <Typography
        variant="h4"
        component="h1"
        className="mb-8 font-bold"
        sx={{ color: theme.palette.text.primary }}
      >
            Đơn Hàng Của Tôi ({orders.length})
      </Typography>

      {/* --- Toolbar: Tìm kiếm & Lọc trạng thái --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <TextField
          label="Tìm kiếm theo Mã đơn hàng/Tên sản phẩm"
          variant="outlined"
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper
            }
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200, backgroundColor: theme.palette.background.paper }}>
          <InputLabel id="status-filter-label">Trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            label="Trạng thái"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="processing">Đang đóng gói</MenuItem>
            <MenuItem value="shipped">Đang vận chuyển</MenuItem>
            <MenuItem value="delivered">Đã giao hàng</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div
        className="relative shadow-lg sm:rounded-lg overflow-hidden"
        style={{ backgroundColor: theme.palette.background.paper }}
      >
        <table className="min-w-full text-left">
          <thead
            className="text-xs uppercase"
            style={{
              backgroundColor: theme.palette.grey[200],
              color: theme.palette.text.primary,
              borderBottom: `2px solid ${theme.palette.divider}`
            }}
          >
            <tr>
              <th className="py-3 px-4 w-40">Sản phẩm</th>
              <th className="py-3 px-4">Mã đơn hàng</th>
              <th className="py-3 px-4">Ngày đặt</th>
              <th className="py-3 px-4">Tổng tiền (₫)</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusDisplay = getOrderStatusDisplay(order)
                const isMomoPending = !order.isPaid && order.paymentMethod !== 'COD'

                return (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: theme.palette.divider,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary
                    }}
                  >
                    {/* Cột Sản phẩm (Đã tối ưu) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {/* Hiển thị tối đa 3 ảnh sản phẩm */}
                        {order.orderItems.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                        {/* Nếu còn nhiều sản phẩm hơn */}
                        {order.orderItems.length > 3 && (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg text-xs font-semibold text-gray-700">
                                    +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Cột Mã đơn hàng */}
                    <td
                      className="py-3 px-4 font-bold whitespace-nowrap text-sm"
                    >
                    #{order._id.slice(-8).toUpperCase()}
                    </td>

                    {/* Cột Ngày đặt */}
                    <td className="py-3 px-4 text-sm">
                      <span style={{ color: theme.palette.text.secondary }}>
                        {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: vi })}
                      </span>
                    </td>

                    {/* Cột Tổng tiền */}
                    <td className="py-3 px-4 font-bold text-red-600">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    {/* Cột Trạng thái (Trạng thái đơn hàng) */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap inline-flex items-center gap-2 ${statusDisplay.color}`}
                      >
                        <i className={statusDisplay.icon}></i>
                        {statusDisplay.text}
                      </span>
                    </td>

                    {/* Cột Chi tiết (Nút) */}
                    <td className="py-3 px-4">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation() // Ngăn chặn sự kiện click lan truyền lên hàng (tránh navigate 2 lần)
                          handleRowClick(order._id)
                        }}
                        sx={{
                          backgroundColor: isMomoPending ? theme.palette.error.main : theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: isMomoPending ? theme.palette.error.dark : theme.palette.primary.dark
                          },
                          color: 'white'
                        }}
                      >
                        {isMomoPending ? 'Thanh Toán Ngay' : 'Xem Chi Tiết'}
                      </Button>
                    </td>

                  </tr>
                )})
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 px-4 text-center text-lg font-medium"
                  style={{ color: theme.palette.text.secondary }}
                >
                  🛒 Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyOrdersPage
