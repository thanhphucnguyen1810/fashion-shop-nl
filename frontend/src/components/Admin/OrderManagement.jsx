import { useTheme, alpha } from '@mui/material/styles'
import React, { useState } from 'react'
import { FaTimes, FaUser, FaMoneyBillWave, FaTruck, FaHome, FaBox, FaReceipt, FaSearch } from 'react-icons/fa'
import OrderDetailModal from './OrderDetails'

const ORDER_STATUSES = [
  { value: 'Pending Payment', label: 'Chờ thanh toán', color: 'bg-yellow-300 text-yellow-900' },
  { value: 'Processing', label: 'Đang xử lý', color: 'bg-blue-300 text-blue-900' },
  { value: 'Packing', label: 'Đang đóng gói', color: 'bg-indigo-300 text-indigo-900' },
  { value: 'Shipped', label: 'Đã gửi hàng', color: 'bg-purple-300 text-purple-900' },
  { value: 'Out for Delivery', label: 'Đang giao hàng', color: 'bg-pink-300 text-pink-900' },
  { value: 'Delivered', label: 'Đã giao hàng', color: 'bg-green-300 text-green-900' },
  { value: 'Cancelled', label: 'Đã hủy', color: 'bg-red-300 text-red-900' }
]

const MOCK_ORDERS = [
  {
    _id: 12345,
    user: { name: 'Nguyễn Thanh Phúc' },
    totalPrice: 120000,
    status: 'Processing',
    createdAt: '2025-06-07',
    paymentMethod: 'Thẻ tín dụng',
    address: '123 Đường Chính, Thành phố',
    items: [
      { id: 1, name: 'Sản phẩm A', quantity: 2, price: 30 },
      { id: 2, name: 'Sản phẩm B', quantity: 1, price: 60 }
    ]
  },
  {
    _id: 12346,
    user: { name: 'Nguyễn Văn A' },
    totalPrice: 200000,
    status: 'Pending Payment',
    createdAt: '2025-06-06',
    paymentMethod: 'Thanh toán khi nhận hàng',
    address: '456 Đường Khác, Thành phố',
    items: [
      { id: 3, name: 'Sản phẩm C', quantity: 4, price: 50 }
    ]
  }
]

const ITEMS_PER_PAGE = 5

const OrderManagement = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('createdAt_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const theme = useTheme()

  const filteredOrders = orders
    .filter(order =>
      (order._id.toString().includes(searchTerm) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus ? order.status === filterStatus : true)
    )

  filteredOrders.sort((a, b) => {
    if (sortBy === 'createdAt_desc') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'createdAt_asc') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'totalPrice_desc') return b.totalPrice - a.totalPrice
    if (sortBy === 'totalPrice_asc') return a.totalPrice - b.totalPrice
    return 0
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleStatusChange = (orderId, newStatus) => {
    alert(`Cập nhật đơn hàng #${orderId} sang trạng thái "${newStatus}"`)
    setOrders(prev =>
      prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const handleCancelOrder = (orderId) => {
    if (!window.confirm(`Bạn có chắc muốn hủy đơn hàng #${orderId} không?`)) return
    alert(`Đơn hàng #${orderId} đã được hủy`)
    setOrders(prev =>
      prev.map(o => (o._id === orderId ? { ...o, status: 'Cancelled' } : o))
    )
  }

  const openOrderDetail = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const closeOrderDetail = () => {
    setSelectedOrder(null)
    setShowDetailModal(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h2>

      {/* Thanh tìm kiếm & lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search input + search button */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-11 pr-24 text-sm rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: '1px solid rgba(0,0,0,0.2)'
            }}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
            onClick={() => console.log('Search:', searchTerm)}
          >
           Tìm
          </button>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderColor: alpha(theme.palette.text.primary, 0.3)
          }}
        >
          <option value="">Tất cả trạng thái</option>
          {ORDER_STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderColor: alpha(theme.palette.text.primary, 0.3)
          }}
        >
          <option value="createdAt_desc">Mới nhất</option>
          <option value="createdAt_asc">Cũ nhất</option>
          <option value="totalPrice_desc">Giá cao đến thấp</option>
          <option value="totalPrice_asc">Giá thấp đến cao</option>
        </select>
      </div>

      {/* Bảng đơn hàng */}
      <div
        className="overflow-x-auto shadow-md sm:rounded-lg"
        style={{
          backgroundColor: theme.palette.background.paper
        }}
      >
        <div className="min-w-[1000px]"> {/* Đặt width tối thiểu để bảng không bung */}
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const statusObj = ORDER_STATUSES.find(s => s.value === order.status) || {}
                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td
                        className="py-4 px-4 font-medium whitespace-nowrap cursor-pointer text-blue-600 hover:underline"
                        onClick={() => openOrderDetail(order)}
                      >
                  #{order._id}
                      </td>
                      <td className="py-4 px-4">{order.user.name}</td>
                      <td className="py-4 px-4">{order.totalPrice.toLocaleString()} đ</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusObj.color || 'bg-gray-300 text-gray-700'}`}>
                          {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2 flex-wrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1"
                        >
                          {ORDER_STATUSES.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                        >
                    Hủy
                        </button>
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                    Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
              Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}

      {/* Chi tiết đơn hàng */}
      <OrderDetailModal
        selectedOrder={selectedOrder}
        showDetailModal={showDetailModal}
        closeOrderDetail={closeOrderDetail}
      />

    </div>
  )
}

export default OrderManagement
