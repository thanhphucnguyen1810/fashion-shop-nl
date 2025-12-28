import { useTheme } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { FaTimes, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminOrderDetails, fetchAllOrders, updateOrderStatus as updateOrderThunk } from '~/redux/slices/admin/adminOrderSlice'
import OrderDetailModal from './OrderDetails'

const ORDER_STATUSES = [
  { value: 'PendingCheckout', label: 'Tạo đơn tạm', color: 'bg-gray-300 text-gray-700' },
  { value: 'AwaitingConfirmation', label: 'Chờ xác nhận', color: 'bg-yellow-300 text-yellow-900' },
  { value: 'AwaitingShipment', label: 'Chờ giao hàng', color: 'bg-blue-300 text-blue-900' },
  { value: 'InTransit', label: 'Đang giao hàng', color: 'bg-purple-300 text-purple-900' },
  { value: 'Delivered', label: 'Đã giao thành công', color: 'bg-green-300 text-green-900' },
  { value: 'Cancelled', label: 'Đã hủy', color: 'bg-red-300 text-red-900' }
]

const ITEMS_PER_PAGE = 5

const OrderManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { orders, loading, error } = useSelector((state) => state.adminOrders)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    } else {
      dispatch(fetchAllOrders())
    }
  }, [dispatch, user, navigate])

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderThunk({ id: orderId, status }))
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('createdAt_desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  const theme = useTheme()

  const filteredOrders = orders
    .filter(order => {
      const customerName = order.user?.name || order.guestId || 'Khách (Guest)'
      const orderIdString = order._id.toString()
      const term = searchTerm.toLowerCase()

      return (
        (orderIdString.includes(term) || customerName.toLowerCase().includes(term)) &&
            (filterStatus ? order.status === filterStatus : true)
      )
    })

  filteredOrders.sort((a, b) => {
    if (sortBy === 'createdAt_desc') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'createdAt_asc') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'totalPrice_desc') return b.totalPrice - a.totalPrice
    if (sortBy === 'totalPrice_asc') return a.totalPrice - b.totalPrice
    return 0
  })

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleCancelOrder = (orderId) => {
    if (!window.confirm(`Bạn có chắc muốn hủy đơn hàng #${orderId} không?`)) return

    dispatch(updateOrderThunk({ id: orderId, status: 'Cancelled' }))
      .then(() => setStatusMessage(`Đơn hàng #${orderId} đã được hủy thành công.`))
      .catch(() => setStatusMessage(`Lỗi khi hủy đơn hàng #${orderId}.`))
  }

  const openOrderDetail = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const closeOrderDetail = () => {
    setSelectedOrder(null)
    setShowDetailModal(false)
  }

  const LoadingPlaceholder = () => (
    <div className="text-center p-8">Đang tải dữ liệu...</div>
  )

  const handleViewAndPrint = (orderId) => {
    dispatch(fetchAdminOrderDetails(orderId)).then((result) => {
      if (result.payload) {
        setSelectedOrder(result.payload)
        setShowDetailModal(true)
      }
    })
  }

  if (loading) return <LoadingPlaceholder />
  if (error) return <p className="text-red-500 p-4 text-center">Lỗi: {error}</p>


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản Lý Đơn Hàng</h2>

      {statusMessage && (
        <div className="mb-4 p-3 bg-indigo-100 text-indigo-700 rounded-lg flex justify-between items-center shadow-md">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)}><FaTimes /></button>
        </div>
      )}

      {/* Thanh tìm kiếm & lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách hàng hoặc Guest ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
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
          onChange={(e) => {
            setFilterStatus(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 rounded flex items-center gap-2 border"
        >
          <option value="">-- Tất cả trạng thái --</option>
          {ORDER_STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded flex items-center gap-2 border"
        >
          <option value="createdAt_desc">Mới nhất</option>
          <option value="createdAt_asc">Cũ nhất</option>
          <option value="totalPrice_desc">Giá cao đến thấp</option>
          <option value="totalPrice_asc">Giá thấp đến cao</option>
        </select>
      </div>

      {/* Bảng đơn hàng */}
      <div
        className="overflow-x-auto shadow-xl rounded-xl"
        style={{
          backgroundColor: theme.palette.background.paper
        }}
      >
        <div className="min-w-[1000px]">
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
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
                  const customerDisplay = order.user?.name || (order.guestId ? `[GUEST] ${order.guestId.substring(0, 8)}...` : 'Khách vãng lai')

                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td
                        className="py-4 px-4 font-medium whitespace-nowrap cursor-pointer text-blue-600 hover:underline"
                        onClick={() => openOrderDetail(order)}
                      >
                     #{order._id.substring(0, 10)}...
                      </td>
                      <td className="py-4 px-4 text-gray-800">{customerDisplay}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        {Number(order.totalPrice).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusObj.color || 'bg-gray-300 text-gray-700'}`}>
                          {statusObj.label || order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2 flex-wrap">
                        {order.status !== 'PendingCheckout' ? (
                          <>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-1.5 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                              disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                            >
                              {ORDER_STATUSES.filter(s => s.value !== 'PendingCheckout').map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 shadow-md transition active:scale-95"
                              disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                            >Hủy
                            </button>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic px-2 py-1">Chưa hoàn tất thanh toán</span>
                        )}
                        <button
                          onClick={() => handleViewAndPrint(order._id)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 shadow-md transition active:scale-95"
                        > Xem chi tiết
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
            className="px-3 py-1 border rounded-lg disabled:opacity-50 bg-white hover:bg-gray-100"
          > Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 bg-white hover:bg-gray-100"
          >Sau
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
