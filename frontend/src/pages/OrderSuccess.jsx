import React from 'react'
import { useParams, Link } from 'react-router-dom'

const OrderSuccess = () => {
  const { id: orderId } = useParams()

  // Tùy chọn: Dùng orderId để gọi API lấy chi tiết Order chính thức (nếu cần hiển thị tổng tiền thực tế)
  // const dispatch = useDispatch()
  // useEffect(() => {
  // 	 if (orderId) dispatch(getOrderDetail(orderId))
  // }, [orderId, dispatch])

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-2xl text-center border-t-8 border-green-500">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-4xl mb-6">
          <i className="fa-solid fa-check-circle"></i>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          ĐẶT HÀNG THÀNH CÔNG!
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đã được ghi nhận chính thức và đang được chuyển sang bộ phận kho hàng để xử lý.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700 font-medium">Mã đơn hàng chính thức:</p>
          <p className="text-2xl font-mono font-bold text-green-700 mt-1">
            #{orderId?.slice(-8).toUpperCase() || 'XXXXXX'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Chúng tôi sẽ gửi email xác nhận và thông tin theo dõi.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to={`/order/${orderId}`}
            className="block w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            XEM CHI TIẾT ĐƠN HÀNG
          </Link>
          <Link
            to="/"
            className="block w-full py-3 text-blue-600 font-bold border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> TIẾP TỤC MUA SẮM
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
