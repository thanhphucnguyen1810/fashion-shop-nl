import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderDetails } from '~/redux/slices/orderSlice'
import ReviewFormModal from '~/components/ReviewFormModal'
import {
  FaArrowLeft,
  FaBox,
  FaMapMarkerAlt,
  FaTruck,
  FaStore,
  FaShippingFast,
  FaCheckCircle,
  FaBoxOpen,
  FaClipboardCheck,
  FaCheck,
  FaSpinner,
  FaRegCircle,
  FaClock,
  FaHistory
} from 'react-icons/fa'
import {
  MdOutlineReceiptLong,
  MdLocalShipping,
  MdDiscount,
  MdPayments,
  MdCheckCircle,
  MdSchedule
} from 'react-icons/md'
import { Button } from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { toast } from 'sonner'
import { confirmReceivedAPI } from '~/apis/orderAPI'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)

const STATUS_CONFIG = {
  PendingCheckout:      { label: 'Chờ thanh toán', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  AwaitingConfirmation: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  AwaitingPickup:       { label: 'Chờ shipper lấy', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  PickedUp:             { label: 'Đã lấy hàng', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  InTransit:            { label: 'Đang vận chuyển', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  OutForDelivery:       { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  Delivered:            { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  Confirmed:            { label: 'Đã xác nhận', color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  Cancelled:            { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' }
}

const PROGRESS_STEPS = [
  { key: 'AwaitingConfirmation', label: 'Xác nhận', icon: <FaClipboardCheck /> },
  { key: 'AwaitingPickup', label: 'Chờ lấy', icon: <FaStore /> },
  { key: 'InTransit', label: 'Vận chuyển', icon: <FaTruck /> },
  { key: 'OutForDelivery', label: 'Đang giao', icon: <FaShippingFast /> },
  { key: 'Delivered', label: 'Đã giao', icon: <FaCheckCircle /> },
  { key: 'Confirmed', label: 'Hoàn tất', icon: <FaBoxOpen /> }
]

const ORDER_STEP_INDEX = {
  AwaitingConfirmation: 0,
  AwaitingPickup:       1,
  PickedUp:             1, // cùng bước với AwaitingPickup
  InTransit:            2,
  OutForDelivery:       3,
  Delivered:            4,
  Confirmed:            5
}

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AwaitingConfirmation
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.color}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

const OrderProgress = ({ status }) => {
  const currentStep = ORDER_STEP_INDEX[status] ?? -1
  if (currentStep === -1 || status === 'Cancelled') return null

  return (
    <div className="mt-6 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStep / (PROGRESS_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {PROGRESS_STEPS.map((step, idx) => (
          <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
              idx <= currentStep
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step.icon}
            </div>
            <span className={`text-xs font-medium text-center ${idx <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const OrderTimeline = ({ timeline = [] }) => {
  if (!timeline.length) return null

  const sorted = [...timeline].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  const ROLE_LABEL = {
    admin: 'Cửa hàng',
    shipper: 'Shipper',
    user: 'Bạn',
    system: 'Hệ thống'
  }

  const ROLE_COLOR = {
    admin: 'text-purple-500',
    shipper: 'text-blue-500',
    user: 'text-green-500',
    system: 'text-gray-400'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="flex items-center gap-3 text-base font-bold text-gray-900 mb-6">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <FaHistory className="text-gray-600 text-sm" />
        </div>  Lịch Sử Đơn Hàng
      </h3>

      <div className="relative">
        {/* Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-5">
          {sorted.map((item, idx) => {
            const isLatest = idx === 0

            return (
              <div key={idx} className="flex gap-4 relative items-start">
                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center z-10">
                  {isLatest ? (
                    <FaCheckCircle
                      className={`text-lg ${ROLE_COLOR[item.role]}`}
                    />
                  ) : (
                    <FaRegCircle className="text-gray-300 text-sm" />
                  )}
                </div>

                {/* CONTENT */}
                <div className={`flex-1 pb-4 ${isLatest ? '' : 'opacity-60'}`}>
                  <p
                    className={`text-sm font-semibold ${
                      isLatest ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {item.message}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <FaClock className="text-gray-400 text-xs" />

                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>

                    <span className="text-xs text-gray-300">·</span>

                    <span className="text-xs text-gray-400">
                      {ROLE_LABEL[item.role]}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const OrderDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { orderDetails: order, loading, error } = useSelector(state => state.orders)

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [confirming, setConfirming] = useState(false)

  const handleConfirmReceived = async () => {
    if (!window.confirm('Bạn xác nhận đã nhận được hàng?')) return
    try {
      setConfirming(true)
      await confirmReceivedAPI(order._id)
      toast.success('Xác nhận nhận hàng thành công!')
      dispatch(fetchOrderDetails(id)) // reload
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setConfirming(false)
    }
  }

  useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id))
  }, [dispatch, id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500">Đang tải đơn hàng...</p>
      </div>
    </div>
  )

  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-500 text-lg">{error || 'Không tìm thấy đơn hàng.'}</p>
        <Link to="/my-orders" className="text-blue-600 hover:underline">← Quay lại đơn hàng</Link>
      </div>
    </div>
  )

  const addr = order.shippingAddress || {}
  const coupon = order.coupon || {}
  const subtotal = order.orderItems?.reduce((acc, i) => acc + i.price * i.quantity, 0) || 0
  const fullAddress = [addr.street, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/my-orders" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Đơn hàng của tôi</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-semibold">#{order._id?.slice(-8).toUpperCase()}</span>
        </div>

        <div className="space-y-4">

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="text-lg font-bold font-mono text-gray-900">
                  #{order._id?.slice(-12).toUpperCase()}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Progress Bar */}
            <OrderProgress status={order.status} />
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
              <FaMapMarkerAlt className="text-red-500" />
              Địa Chỉ Nhận Hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Người nhận</p>
                <p className="font-semibold text-gray-900">{addr.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Điện thoại</p>
                <p className="font-semibold text-gray-900">{addr.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Địa chỉ</p>
                <p className="text-gray-700">{fullAddress || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <FaTruck className="text-blue-500" />
                {order.shippingMethod || 'Giao hàng tiêu chuẩn'}
              </span>
              <span className="text-gray-400">|</span>
              <span>Mã vận đơn: <strong>{order.trackingNumber || 'Đang cập nhật'}</strong></span>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
              <FaBox className="text-green-500" />
              Sản Phẩm ({order.orderItems?.length || 0})
            </h3>
            <div className="divide-y divide-gray-50">
              {order.orderItems?.map((item) => (
                <div key={item.productId} className="py-4 flex items-start gap-4">
                  <Link to={`/products/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100 hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">Size: {item.size || 'Mặc định'}</span>
                      {item.color && <span className="text-xs text-gray-500">Màu: {item.color}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Số lượng: ×{item.quantity}</p>
                    {order.status === 'Delivered' && (
                      <Button
                        onClick={() => {
                          setSelectedProduct({ productId: item.productId, productName: item.name, productImage: item.image })
                          setIsReviewOpen(true)
                        }}
                        size="small"
                        variant="outlined"
                        startIcon={<RateReviewIcon />}
                        sx={{ mt: 1, fontSize: '0.75rem', textTransform: 'none' }}
                      >
                        Đánh giá
                      </Button>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-red-600">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(item.price)} / cái</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.status === 'Delivered' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-800">Shipper đã giao hàng thành công!</p>
                <p className="text-sm text-green-600 mt-1">Bấm xác nhận nếu bạn đã nhận được hàng.</p>
              </div>
              <button
                onClick={handleConfirmReceived}
                disabled={confirming}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {confirming ? (
                  <>
                    <FaSpinner className="animate-spin" />
      Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaCheck />
      Đã nhận hàng
                  </>
                )}
              </button>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
              <MdOutlineReceiptLong className="text-gray-500" />
              Tổng kết thanh toán
            </h3>
            <div className="space-y-3 max-w-sm ml-auto">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <MdLocalShipping size={16} />
                    Miễn phí
                </span>
              </div>
              {coupon.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá ({coupon.code})</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <MdDiscount size={16} />
                    -{formatCurrency(coupon.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <span className="font-bold text-gray-900">Tổng thanh toán</span>
                <span className="flex items-center gap-1 text-xl font-semibold text-gray-900">
                  <MdPayments size={18} />
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <span>Phương thức</span>
                <span className="font-medium">
                  {order.paymentMethod} · {order.isPaid ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <MdCheckCircle size={16} />
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600">
                      <MdSchedule size={16} />
                      Chờ thanh toán
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <OrderTimeline timeline={order.timeline} />

          {/* Footer */}
          <div className="text-center py-4">
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              <FaArrowLeft className="w-3 h-3" />
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ReviewFormModal
          open={isReviewOpen}
          handleClose={() => { setIsReviewOpen(false); setSelectedProduct(null) }}
          productId={selectedProduct.productId}
          productName={selectedProduct.productName}
          productImage={selectedProduct.productImage}
        />
      )}
    </div>
  )
}

export default OrderDetailsPage
