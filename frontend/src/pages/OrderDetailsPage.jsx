import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderDetails } from '~/redux/slices/orderSlice'

// Hàm format tiền tệ Việt Nam
const formatCurrency = (amount) => {
  // FIX: Đảm bảo format an toàn, không lỗi khi amount là null/undefined
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numAmount)
}

// Hàm chuyển đổi trạng thái đơn hàng (để hiển thị bằng Tiếng Việt)
const getOrderStatusText = (status) => {
  switch (status) {
  case 'AwaitingConfirmation':
    return 'Chờ xác nhận'
  case 'Processing':
  case 'Shipped':
    return 'Đang vận chuyển'
  case 'Delivered':
    return 'Đã giao hàng'
  case 'Cancelled':
    return 'Đã hủy'
  case 'PendingCheckout':
    return 'Chờ thanh toán Online'
  default:
    return status || 'Không rõ'
  }
}

// Hàm xác định màu cho tag trạng thái
const getStatusColor = (theme, status) => {
  switch (status) {
  case 'Delivered':
    return { bg: theme.palette.success.main, text: 'white' }
  case 'Cancelled':
    return { bg: theme.palette.error.main, text: 'white' }
  case 'AwaitingConfirmation':
  case 'Processing':
  case 'Shipped':
    return { bg: theme.palette.warning.main, text: 'white' }
  case 'PendingCheckout':
    return { bg: theme.palette.primary.main, text: 'white' }
  default:
    return { bg: theme.palette.grey[400], text: theme.palette.grey[800] }
  }
}


const OrderDetailsPage = () => {
  const { id } = useParams()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { orderDetails, loading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id))
    }
  }, [dispatch, id])

  // FIX: Hiển thị trạng thái Loading/Error an toàn hơn
  if (loading) return <div className="text-center p-8 text-xl">Đang tải chi tiết đơn hàng...</div>
  if (error) return <div className="text-center p-8 text-red-600">Lỗi tải dữ liệu: {error}</div>
  if (!orderDetails) return <div className="text-center p-8">Không tìm thấy thông tin đơn hàng.</div>

  // --- LẤY DỮ LIỆU THỰC TẾ VÀ XỬ LÝ AN TOÀN (Dựa trên Schema HIỆN TẠI) ---
  const shippingAddress = orderDetails.shippingAddress || {}
  const user = orderDetails.user || {}
  const coupon = orderDetails.coupon || {}

  // FIX: Hợp nhất firstName và lastName từ shippingAddress
  const recipientName =
    (shippingAddress.firstName || user.fullName)
      ? `${shippingAddress.firstName || user.fullName || ''} ${shippingAddress.lastName || ''}`.trim()
      : 'Khách hàng (Chưa cung cấp)'

  // FIX: Lấy số điện thoại từ trường 'phone'
  const recipientPhone = shippingAddress.phone || user.phoneNumber || '---'

  // FIX: Hợp nhất địa chỉ từ trường 'address', 'city', 'country'
  const fullAddress =
    `${shippingAddress.address || ''}, ${shippingAddress.city || ''}, ${shippingAddress.country || ''}`
      .replace(/,\s*,\s*/g, ', ') // Xử lý các dấu phẩy bị lặp lại
      .trim()
      .replace(/^,|,$/g, '') // Loại bỏ dấu phẩy ở đầu hoặc cuối
    || 'Địa chỉ chưa xác định'

  const shippingFee = orderDetails.shippingFee || 0
  const discountAmount = coupon.discountAmount || 0

  // Sử dụng Optional Chaining an toàn
  const itemsSubtotal = orderDetails.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0
  const finalTotalPrice = orderDetails.totalPrice || 0
  const statusColor = getStatusColor(theme, orderDetails.status)

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6 text-gray-800'>Chi tiết đơn hàng</h2>

      <div className='space-y-4'>
        {/* 1. HEADER & STATUS BAR */}
        <div
          className='bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-t-4'
          style={{ borderColor: statusColor.bg }}
        >
          <div className="flex flex-col">
            <span className='text-lg font-semibold text-gray-700'>
              {/* FIX: Sử dụng Optional Chaining để tránh lỗi */}
                        Mã đơn hàng: <span style={{ color: theme.palette.primary.main }}>#{orderDetails._id?.slice(-12).toUpperCase() || '---'}</span>
            </span>
            <span className='text-sm text-gray-500'>
                        Ngày đặt: {new Date(orderDetails.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <div className='text-right'>
            <span
              // FIX: Áp dụng màu đã sửa lỗi sáng
              style={{
                backgroundColor: statusColor.bg,
                color: statusColor.text
              }}
              className='px-3 py-1 rounded-full text-sm font-bold uppercase'
            >
              {getOrderStatusText(orderDetails.status)}
            </span>
          </div>
        </div>

        {/* 2. SHIPPING & ADDRESS (Địa chỉ nhận hàng) */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h4 className='text-xl font-bold mb-4 flex items-center text-gray-800 border-b pb-2'>
            <i className="fa-solid fa-location-dot text-red-500 mr-3"></i> Địa Chỉ Nhận Hàng
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
            <div className="text-sm">
              <p className='font-semibold text-gray-700'>Người nhận</p>
              <p className='text-gray-600'>{recipientName}</p> {/* ✅ Đã Fix */}
            </div>
            <div className="text-sm">
              <p className='font-semibold text-gray-700'>Số điện thoại</p>
              <p className='text-gray-600'>{recipientPhone}</p> {/* ✅ Đã Fix */}
            </div>
            <div className="text-sm sm:col-span-1">
              <p className='font-semibold text-gray-700'>Địa chỉ</p>
              <p className='text-gray-600'>{fullAddress}</p> {/* ✅ Đã Fix */}
            </div>
          </div>
          <div className='mt-4 pt-4 border-t text-sm text-gray-600' style={{ borderColor: theme.palette.divider }}>
            <p>Phương thức vận chuyển: <span className="font-semibold">{orderDetails.shippingMethod || 'Tiêu chuẩn'}</span></p>
            <p>Mã vận đơn: <span className="font-semibold">{orderDetails.trackingNumber || 'Đang cập nhật'}</span></p>
          </div>
        </div>

        {/* 3. PRODUCT LIST */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h4 className='text-xl font-bold mb-4 flex items-center text-gray-800 border-b pb-2'>
            <i className="fa-solid fa-box text-green-500 mr-3"></i> Danh Sách Sản Phẩm
          </h4>
          {/* FIX: Sử dụng Optional Chaining an toàn */}
          <div className='space-y-4'>
            {orderDetails.orderItems?.map((item) => (
              <div key={item.productId} className='flex justify-between items-center py-3 border-b last:border-b-0' style={{ borderColor: theme.palette.divider }}>
                <div className='flex items-center flex-1 min-w-0'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-16 h-16 object-cover rounded-md mr-4 border'
                  />
                  <div className='flex flex-col min-w-0'>
                    <Link
                      to={`/product/${item.productId}`}
                      style={{ color: theme.palette.primary.main }}
                      className='font-semibold hover:text-red-500 transition-colors truncate'
                    >
                      {item.name} {/* ✅ Đã Fix */}
                    </Link>
                    <span className='text-xs text-gray-500'>Phân loại: {item.size || 'Mặc định'}</span>
                    <span className='text-sm text-gray-500 mt-1'>x{item.quantity}</span>
                  </div>
                </div>
                <div className='text-right ml-4'>
                  <p className='text-red-600 font-bold'>
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className='text-sm text-gray-500'>
                                    Đơn giá: {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
            {/* Trường hợp không có sản phẩm */}
            {(!orderDetails.orderItems || orderDetails.orderItems.length === 0) && (
              <p className='text-center text-gray-500 py-4'>Không có sản phẩm nào trong đơn hàng này.</p>
            )}
          </div>
        </div>

        {/* 4. PAYMENT SUMMARY */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h4 className='text-xl font-bold mb-4 flex items-center text-gray-800 border-b pb-2'>
            <i className="fa-solid fa-receipt text-yellow-600 mr-3"></i> Tổng Kết Thanh Toán
          </h4>
          <div className='space-y-2 max-w-lg ml-auto'>
            <div className='flex justify-between text-gray-700'>
              <span>Tổng tiền hàng:</span>
              <span className='font-medium'>{formatCurrency(itemsSubtotal)}</span>
            </div>
            <div className='flex justify-between text-gray-700'>
              <span>Phí vận chuyển:</span>
              <span className='font-medium'>{formatCurrency(shippingFee)}</span>
            </div>
            <div className='flex justify-between text-gray-700'>
              <span>Mã giảm giá ({coupon.code || '---'}):</span>
              <span className='font-medium text-green-600'>- {formatCurrency(discountAmount)}</span>
            </div>

            {/* Final Total */}
            <div className='flex justify-between border-t pt-3 mt-3 font-bold text-xl' style={{ borderColor: theme.palette.divider }}>
              <span className='text-red-600'>Tổng thanh toán:</span>
              <span className='text-red-600'>{formatCurrency(finalTotalPrice)}</span>
            </div>

            {/* Payment Method */}
            <div className='flex justify-between text-base pt-2' style={{ borderColor: theme.palette.divider }}>
              <span className='font-semibold'>Phương thức:</span>
              <span className='text-gray-800'>{orderDetails.paymentMethod || 'COD'} ({orderDetails.isPaid ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'})</span>
            </div>
          </div>
        </div>

        {/* Back Link (Footer) */}
        <div className='mt-8 text-center'>
          <Link
            to='/my-orders'
            style={{ color: theme.palette.primary.main }}
            className='hover:underline font-semibold text-lg py-2 px-4 rounded-lg bg-white shadow transition-shadow hover:shadow-lg'
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại Đơn hàng của tôi
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage
