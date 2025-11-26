import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // Import useNavigate
import axios from 'axios'
import { FaBox, FaCalendarAlt, FaMoneyBillAlt, FaTag, FaChevronRight, FaShoppingCart, FaUser } from 'react-icons/fa'
// Đảm bảo bạn đã import các icon cần thiết

const API_URL = import.meta.env.VITE_API_URL

// Hàm lấy tên khách hàng, cần được gọi ở useEffect bên ngoài
// Giả định bạn có state [user, setUser] và gọi API user/:id để lấy tên
const customerName = 'Tên Khách Hàng Ví Dụ' // Thay thế bằng logic state thực tế

const UserOrderHistory = () => {
  const { userId } = useParams()
  const navigate = useNavigate() // Dùng để điều hướng đến trang chi tiết

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState(`Khách hàng ID: ${userId.slice(0, 8)}...`)

  // ... (Code useEffect và fetchOrders/fetchUser ở đây, giữ nguyên logic đã sửa)

  // --- Hàm hỗ trợ định dạng Status ---
  const getStatusStyle = (status) => {
    switch (status) {
    case 'Đã giao':
    case 'Hoàn thành':
      return 'bg-green-100 text-green-700'
    case 'Đang xử lý':
    case 'Đã xác nhận':
      return 'bg-yellow-100 text-yellow-700'
    case 'Đã hủy':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
    }
  }

  // ------------------------------------------

  // Sử dụng useEffect từ phản hồi trước để lấy orders và user name
  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        // 1. Lấy thông tin User
        const userRes = await axios.get(`${API_URL}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        })
        setCustomerName(userRes.data.name || customerName) // Cập nhật tên

        // 2. Lấy đơn hàng của User
        const ordersRes = await axios.get(
          `${API_URL}/api/admin/orders/user/${userId}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
        )
        setOrders(ordersRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchUserDataAndOrders()
  }, [userId])


  if (loading) return <p className="p-5 text-center text-lg text-blue-600">Đang tải lịch sử đơn hàng...</p>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TIÊU ĐỀ ADMIN */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        <FaBox className="inline mr-2 text-indigo-500" /> Lịch sử Đơn hàng
      </h2>
      <p className="text-lg text-gray-600 mb-6 border-b-2 border-red-500 pb-2 flex items-center">
        <FaUser className="mr-2 text-red-500"/> Khách hàng: <span className="font-extrabold ml-1">{customerName}</span>
      </p>

      {/* KIỂM TRA ĐƠN HÀNG RỖNG */}
      {Array.isArray(orders) && orders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-md mt-10 border border-dashed border-gray-300">
          <p className="text-xl text-gray-600">Khách hàng này chưa đặt đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {Array.isArray(orders) && orders.map((order) => {
            const firstItem = order.orderItems && order.orderItems[0]
            const itemCount = order.orderItems ? order.orderItems.length : 0

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* HEADER: Mã Đơn & Trạng thái (Shopee style) */}
                <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center">
                    <FaTag className="mr-2 text-red-500" />
                    Mã đơn hàng: <span className="text-gray-900 ml-1 font-mono uppercase font-semibold">DH{order._id.slice(-8)}</span>
                  </p>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* THÔNG TIN SẢN PHẨM (Shopee style - Chỉ hiển thị sản phẩm đầu tiên) */}
                {firstItem && (
                  <div className="flex p-4 items-center space-x-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order._id}`)} // Điều hướng khi click vào sản phẩm
                  >
                    <img
                      src={firstItem.productId?.images?.[0] || 'placeholder-url'} // Giả định cấu trúc ảnh
                      alt={firstItem.productId?.name || 'Sản phẩm'}
                      className="w-16 h-16 object-cover border rounded"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 line-clamp-2">
                        {firstItem.productId?.name || 'Tên Sản phẩm không rõ'}
                      </p>
                      <p className="text-sm text-gray-500">
                                x{firstItem.quantity || 1}
                      </p>
                    </div>

                    <FaChevronRight className="text-gray-400 text-xs"/>
                  </div>
                )}

                {/* DÒNG TỔNG KẾT VÀ NÚT HÀNH ĐỘNG */}
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end items-center space-x-4 bg-white">
                  <p className="text-sm text-gray-600 flex items-center">
                    {itemCount} Sản phẩm
                  </p>

                  <div className="flex items-center">
                    <FaMoneyBillAlt className="mr-2 text-red-600 text-xl" />
                    <span className="font-semibold text-gray-800">Tổng tiền:</span>
                    <span className="text-xl font-extrabold text-red-600 ml-2">
                      {order.totalPrice ? order.totalPrice.toLocaleString('vi-VN') : 0}₫
                    </span>
                  </div>

                  {/* Nút Xem Chi Tiết (Hành động Admin chính) */}
                  <button
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition duration-150 shadow-md ml-4 flex items-center"
                  >
                    <FaShoppingCart className="mr-2"/>
                        Quản lý Đơn hàng
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserOrderHistory
