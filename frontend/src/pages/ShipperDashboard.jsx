import { useEffect, useState } from 'react'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'sonner'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CachedIcon from '@mui/icons-material/Cached'

const STATUS_ACTIONS = {
  AwaitingPickup:  { next: 'PickedUp', label: 'Xác nhận đã lấy hàng', color: 'bg-blue-600 hover:bg-blue-700' },
  PickedUp:        { next: 'InTransit', label: 'Bắt đầu vận chuyển', color: 'bg-indigo-600 hover:bg-indigo-700' },
  InTransit:       { next: 'OutForDelivery', label: 'Đang giao đến khách', color: 'bg-orange-500 hover:bg-orange-600' },
  OutForDelivery:  { next: 'Delivered', label: 'Xác nhận đã giao hàng', color: 'bg-green-600 hover:bg-green-700' }
}

const STATUS_LABEL = {
  AwaitingPickup:  'Chờ lấy hàng',
  PickedUp:        'Đã lấy hàng',
  InTransit:       'Đang vận chuyển',
  OutForDelivery:  'Đang giao',
  Delivered:       'Đã giao'
}

const ShipperDashboard = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchOrders = async () => {
    try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/shipper/orders`)
      setOrders(res.data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdateStatus = async (orderId, status) => {
    if (!window.confirm(`Xác nhận cập nhật: ${STATUS_LABEL[status]}?`)) return
    try {
      setUpdating(orderId)
      await authorizedAxiosInstance.put(`${API_ROOT}/api/shipper/orders/${orderId}/status`, { status })
      toast.success('Cập nhật thành công!')
      fetchOrders()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <CachedIcon className="animate-spin text-blue-600 text-4xl" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LocalShippingIcon className="text-blue-600" /> Đơn Hàng Của Tôi
          </h1>
          <p className="text-gray-500 mt-1">Quản lý các đơn hàng được phân công</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
            <Inventory2Icon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Không có đơn hàng nào được phân công</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const action = STATUS_ACTIONS[order.status]
              const addr = order.shippingAddress || {}

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          order.status === 'AwaitingPickup' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'OutForDelivery' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                        }`}>
                          {STATUS_LABEL[order.status]}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1.5">
                        <p className="font-semibold text-gray-800 text-base">{addr.name}</p>
                        <p>Số điện thoại: {addr.phone}</p>
                        <p>Địa chỉ: {[addr.street, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}</p>
                      </div>

                      <div className="mt-4 flex gap-2 flex-wrap">
                        {order.orderItems?.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                        ))}
                        {order.orderItems?.length > 3 && (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-semibold">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 items-end">
                      <p className="font-bold text-blue-600 text-lg">
                        {order.totalPrice?.toLocaleString('vi-VN')}đ
                      </p>

                      {action && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, action.next)}
                          disabled={updating === order._id}
                          className={`px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 ${action.color}`}
                        >
                          {updating === order._id ? (
                            <>
                              <CachedIcon className="animate-spin w-4 h-4" />
                              Đang xử lý
                            </>
                          ) : (
                            <>
                              <CheckCircleOutlineIcon className="w-4 h-4" />
                              {action.label}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShipperDashboard
