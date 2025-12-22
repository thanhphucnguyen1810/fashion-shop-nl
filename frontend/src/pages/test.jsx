function A (
  return(
    <>
      {/* Bảng các đơn hàng gần đây */}
      <div className={`mt-8 p-6 rounded-xl shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>

          <Link to="/admin/orders" className="text-blue-500 text-sm hover:underline">Xem tất cả</Link>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>

                <th className="p-3 text-gray-500 font-medium">Mã đơn</th>

                <th className="p-3 text-gray-500 font-medium">Khách hàng</th>

                <th className="p-3 text-gray-500 font-medium">Ngày đặt</th>

                <th className="p-3 text-gray-500 font-medium">Tổng tiền</th>

                <th className="p-3 text-gray-500 font-medium">Trạng thái</th>

              </tr>

            </thead>

            <tbody>

              {orders.slice(0, 5).map(order => (

                <tr key={order._id} className={`border-b last:border-0 ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-50 hover:bg-gray-50'}`}>

                  <td className="p-3 font-mono text-xs text-blue-500">#{order._id.slice(-8)}</td>

                  <td className="p-3">{order.user?.name || 'Guest'}</td>

                  <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>

                  <td className="p-3 font-semibold">{formatCurrency(order.totalPrice)}</td>

                  <td className="p-3">

                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${

                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' :

                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'

                    }`}>

                      {order.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  )
)