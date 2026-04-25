import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAdminOrderDetails,
  fetchAllOrders,
  updateOrderStatus as updateOrderThunk
} from '~/redux/slices/admin/adminOrderSlice'
import OrderDetailModal from './OrderDetails'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'sonner'
import {
  FaSearch, FaTruck, FaUser, FaBox,
  FaChevronLeft, FaChevronRight, FaEye,
  FaBan, FaUserTie, FaSyncAlt
} from 'react-icons/fa'

import { fetchShippersAPI } from '~/apis/adminOrderAPI' // Import thêm hàm mới

// ===== CONSTANTS =====
const ORDER_STATUSES = [
  { value: 'AwaitingConfirmation', label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  { value: 'AwaitingPickup', label: 'Chờ shipper lấy', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  { value: 'PickedUp', label: 'Đã lấy hàng', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
  { value: 'InTransit', label: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  { value: 'OutForDelivery', label: 'Đang giao', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  { value: 'Delivered', label: 'Đã giao', color: 'bg-green-100 text-green-700', dot: 'bg-green-400' },
  { value: 'Confirmed', label: 'Đã xác nhận', color: 'bg-teal-100 text-teal-700', dot: 'bg-teal-400' },
  { value: 'Cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
  { value: 'PendingCheckout', label: 'Chờ thanh toán', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }
]

// Các trạng thái admin được phép đổi thủ công
const ADMIN_CHANGEABLE = [
  'AwaitingConfirmation',
  'AwaitingPickup',
  'Cancelled'
]

// Trạng thái cuối — không cho sửa
const FINAL_STATUSES = ['Confirmed', 'Cancelled', 'PendingCheckout']

const ITEMS_PER_PAGE = 8

const getStatusConfig = (status) =>
  ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[ORDER_STATUSES.length - 1]

// ===== STATUS BADGE =====
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

// ===== UPDATE STATUS MODAL =====
const UpdateStatusModal = ({ order, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)

  const allowedStatuses = ORDER_STATUSES.filter(s =>
    !['PendingCheckout', 'Confirmed'].includes(s.value)
  )

  const handleSubmit = async () => {
    if (selectedStatus === order.status) return onClose()
    setLoading(true)
    await onUpdate(order._id, selectedStatus)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Cập nhật trạng thái đơn hàng</h3>
        <p className="text-sm text-gray-500 mb-4">
          Đơn #{order._id.slice(-8).toUpperCase()} · Hiện tại: <StatusBadge status={order.status} />
        </p>

        <div className="space-y-2 mb-6">
          {allowedStatuses.map(s => (
            <label
              key={s.value}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedStatus === s.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={s.value}
                checked={selectedStatus === s.value}
                onChange={() => setSelectedStatus(s.value)}
                className="hidden"
              />
              <span className={`w-3 h-3 rounded-full ${s.dot}`} />
              <span className="text-sm font-medium text-gray-700">{s.label}</span>
              {selectedStatus === s.value && (
                <span className="ml-auto text-blue-600 text-xs font-bold">✓ Đã chọn</span>
              )}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedStatus === order.status}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== ASSIGN SHIPPER MODAL =====
const AssignShipperModal = ({ order, shippers, onClose, onAssign }) => {
  const [selectedShipper, setSelectedShipper] = useState(order.shipper?._id || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedShipper) return toast.error('Vui lòng chọn shipper')
    setLoading(true)
    await onAssign(order._id, selectedShipper)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Phân công Shipper</h3>
        <p className="text-sm text-gray-500 mb-4">Đơn #{order._id.slice(-8).toUpperCase()}</p>

        {shippers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaTruck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có shipper nào trong hệ thống</p>
            <p className="text-xs mt-1">Tạo tài khoản với role "shipper" trước</p>
          </div>
        ) : (
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {shippers.map(s => (
              <label
                key={s._id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedShipper === s._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipper"
                  value={s._id}
                  checked={selectedShipper === s._id}
                  onChange={() => setSelectedShipper(s._id)}
                  className="hidden"
                />
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </div>
                {selectedShipper === s._id && (
                  <span className="text-blue-600 text-xs font-bold">✓</span>
                )}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedShipper || shippers.length === 0}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Phân công'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== MAIN COMPONENT =====
const OrderManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { orders, loading, error } = useSelector(state => state.adminOrders)

  const [shippers, setShippers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('createdAt_desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updateStatusOrder, setUpdateStatusOrder] = useState(null)
  const [assignShipperOrder, setAssignShipperOrder] = useState(null)

  // Fetch shippers
  useEffect(() => {
    const loadShippers = async () => {
      try {
        const list = await fetchShippersAPI()
        setShippers(list)
      } catch (err) {
        toast.error('Không tải được danh sách Shipper')
      }
    }
    loadShippers()
  }, [])

  // Fetch orders
  useEffect(() => {
    if (!user || user.role !== 'admin') return navigate('/')
    dispatch(fetchAllOrders({ page: currentPage, search: searchTerm }))
  }, [dispatch, user, navigate, currentPage, searchTerm])

  // ===== HANDLERS =====
  const handleSearch = () => {
    setCurrentPage(1)
    dispatch(fetchAllOrders({ page: 1, search: searchTerm }))
  }

  const handleStatusUpdate = async (orderId, status) => {
    const result = await dispatch(updateOrderThunk({ id: orderId, status }))
    if (updateOrderThunk.fulfilled.match(result)) {
      toast.success('Cập nhật trạng thái thành công!')
      dispatch(fetchAllOrders({ page: currentPage, search: searchTerm }))
    } else {
      toast.error('Cập nhật thất bại!')
    }
  }

  const handleAssignShipper = async (orderId, shipperId) => {
    try {
      const res = await authorizedAxiosInstance.put(
        `${API_ROOT}/api/admin/orders/${orderId}/assign-shipper`,
        { shipperId }
      )

      // Giả sử API trả về order mới đã có object shipper { _id, name, ... }
      toast.success('Phân công shipper thành công!')

      // Tải lại danh sách từ server để đảm bảo dữ liệu mới nhất
      dispatch(fetchAllOrders({ page: currentPage, search: searchTerm }))
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Phân công thất bại!')
    }
  }

  const handleViewDetail = (orderId) => {
    dispatch(fetchAdminOrderDetails(orderId)).then(result => {
      if (result.payload) {
        setSelectedOrder(result.payload)
        setShowDetailModal(true)
      }
    })
  }

  // ===== FILTER + SORT (client-side trên trang hiện tại) =====
  const processedOrders = useMemo(() => {
    let result = [...orders]

    if (filterStatus) {
      result = result.filter(o => o.status === filterStatus)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(o =>
        o._id.toLowerCase().includes(term) ||
        o.user?.name?.toLowerCase().includes(term) ||
        o.shippingAddress?.name?.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'createdAt_desc') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'createdAt_asc') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'totalPrice_desc') return b.totalPrice - a.totalPrice
      if (sortBy === 'totalPrice_asc') return a.totalPrice - b.totalPrice
      return 0
    })

    return result
  }, [orders, filterStatus, searchTerm, sortBy])

  // Phân trang client-side
  const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Stats nhanh
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'AwaitingConfirmation').length,
    delivering: orders.filter(o => ['AwaitingPickup', 'PickedUp', 'InTransit', 'OutForDelivery'].includes(o.status)).length,
    done: orders.filter(o => ['Delivered', 'Confirmed'].includes(o.status)).length
  }), [orders])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm">Đang tải đơn hàng...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="p-8 text-center text-red-500">Lỗi: {error?.message || error}</div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý toàn bộ đơn hàng, phân công shipper và cập nhật trạng thái</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng đơn', value: stats.total, icon: FaBox, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Chờ xử lý', value: stats.pending, icon: FaBox, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Đang giao', value: stats.delivering, icon: FaTruck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Hoàn thành', value: stats.done, icon: FaUser, color: 'text-green-600', bg: 'bg-green-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm mã đơn, tên khách..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="createdAt_desc">Mới nhất</option>
            <option value="createdAt_asc">Cũ nhất</option>
            <option value="totalPrice_desc">Giá cao → thấp</option>
            <option value="totalPrice_asc">Giá thấp → cao</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Đơn hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sản phẩm</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Tổng tiền</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Shipper</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map(order => {
                  const isFinal = FINAL_STATUSES.includes(order.status)
                  const customerName = order.user?.name ||
                    (order.guestId ? `Guest #${order.guestId.slice(-6)}` : 'Khách vãng lai')

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      {/* Order ID + Date */}
                      <td className="px-4 py-4">
                        <p
                          className="font-mono font-bold text-blue-600 hover:underline cursor-pointer text-sm"
                          onClick={() => handleViewDetail(order._id)}
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit', month: '2-digit', year: 'numeric'
                          })}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xs shrink-0">
                            {customerName[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{customerName}</p>
                            <p className="text-xs text-gray-400">{order.shippingAddress?.phone || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          {order.orderItems?.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 object-cover rounded-lg border border-gray-100"
                            />
                          ))}
                          {order.orderItems?.length > 3 && (
                            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-500">
                              +{order.orderItems.length - 3}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{order.orderItems?.length} sản phẩm</p>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4 text-right">
                        <p className="font-bold text-gray-900">{order.totalPrice?.toLocaleString('vi-VN')}đ</p>
                        <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Shipper */}
                      <td className="px-4 py-4 text-center">
                        {order.shipper ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1.5">
                              <FaUserTie className="text-blue-500 w-3 h-3" />
                              <span className="text-xs font-semibold text-blue-600">
                                {order.shipper.name}
                              </span>
                            </div>
                            {/* Cho phép đổi shipper nếu chưa giao xong */}
                            {!['Delivered', 'Confirmed', 'Cancelled'].includes(order.status) && (
                              <button
                                onClick={() => setAssignShipperOrder(order)}
                                className="text-xs text-gray-400 hover:text-blue-600 underline"
                              >
                                Đổi
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssignShipperOrder(order)}
                            disabled={isFinal || order.status === 'AwaitingConfirmation'}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title={order.status === 'AwaitingConfirmation' ? 'Xác nhận đơn trước khi phân công' : ''}
                          >
                            <FaTruck className="w-3 h-3" />
                            Phân công
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => handleViewDetail(order._id)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>

                          {/* Cập nhật trạng thái */}
                          {!isFinal && (
                            <button
                              onClick={() => setUpdateStatusOrder(order)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <FaSyncAlt className="w-4 h-4" />
                            </button>
                          )}

                          {/* Hủy đơn */}
                          {!isFinal && !['Delivered', 'InTransit', 'OutForDelivery', 'PickedUp'].includes(order.status) && (
                            <button
                              onClick={() => {
                                if (window.confirm('Hủy đơn hàng này?')) {
                                  handleStatusUpdate(order._id, 'Cancelled')
                                }
                              }}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hủy đơn"
                            >
                              <FaBan className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <FaBox className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Không tìm thấy đơn hàng nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Hiển thị {paginatedOrders.length} / {processedOrders.length} đơn
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 text-sm font-semibold rounded-lg transition-all ${
                    currentPage === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {updateStatusOrder && (
        <UpdateStatusModal
          order={updateStatusOrder}
          onClose={() => setUpdateStatusOrder(null)}
          onUpdate={handleStatusUpdate}
        />
      )}

      {assignShipperOrder && (
        <AssignShipperModal
          order={assignShipperOrder}
          shippers={shippers}
          onClose={() => setAssignShipperOrder(null)}
          onAssign={handleAssignShipper}
        />
      )}

      <OrderDetailModal
        selectedOrder={selectedOrder}
        showDetailModal={showDetailModal}
        closeOrderDetail={() => { setSelectedOrder(null); setShowDetailModal(false) }}
      />
    </div>
  )
}

export default OrderManagement
