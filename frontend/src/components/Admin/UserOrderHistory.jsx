import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersByUser } from '~/redux/slices/admin/adminOrderSlice'
import OrderDetailModal from './OrderDetails'
import { FaArrowLeft, FaEye, FaReceipt, FaHistory } from 'react-icons/fa'

const UserOrderHistory = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.adminOrders)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(fetchOrdersByUser(userId))
  }, [dispatch, userId])

  const handleOpenDetail = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Hàm render nhãn trạng thái "sang" hơn
  const renderStatus = (status) => {
    const statusConfig = {
      Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      InTransit: 'bg-blue-100 text-blue-700 border-blue-200',
      AwaitingConfirmation: 'bg-amber-100 text-amber-700 border-amber-200',
      Cancelled: 'bg-red-100 text-red-700 border-red-200',
      default: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    const style = statusConfig[status] || statusConfig.default
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Trở về danh sách người dùng
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <FaHistory className="text-blue-500" />
              Lịch sử mua hàng
            </h2>
            <p className="text-gray-500 mt-1">
              Quản lý và xem lại tất cả các giao dịch của khách hàng <span className="font-mono text-blue-600">#{userId.slice(-6)}</span>
            </p>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-400">Tổng số đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 animate-pulse">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-gray-900 group-hover:text-blue-600">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{order.paymentMethod}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">{order.paymentStatus || 'Chưa xác định'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-base font-bold text-blue-600">
                        {order.totalPrice?.toLocaleString()}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                      >
                        <FaEye className="text-xs" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <FaReceipt className="text-gray-200 text-6xl mb-4" />
                        <p className="text-gray-400 text-lg">Khách hàng chưa thực hiện giao dịch nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal chi tiết hóa đơn */}
      {showModal && (
        <OrderDetailModal
          selectedOrder={selectedOrder}
          showDetailModal={showModal}
          closeOrderDetail={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default UserOrderHistory
