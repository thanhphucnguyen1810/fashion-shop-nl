import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import {
  getCheckoutDetail,
  finalizeOrder,
  getSepayQrInfo,
  checkPaymentStatus
} from '~/redux/slices/checkoutSlice'
import { Divider, CircularProgress } from '@mui/material'
import EnhancedQRCodePayment from '~/components/Checkout/EnhancedQRCodePayment'

const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const OrderConfirm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const pollingInterval = useRef(null)

  const [isFinalizing, setIsFinalizing] = useState(false)

  const { checkout, error, qrData, isPaidSuccess, finalOrderId } = useSelector((state) => state.checkout)

  const isCOD = checkout?.paymentMethod === 'COD'

  // 1. Lấy chi tiết Checkout khi vào trang
  useEffect(() => {
    if (id) dispatch(getCheckoutDetail(id))
  }, [id, dispatch])

  // 2. LOGIC RIÊNG CHO SEPAY: Tự động lấy QR và Check thanh toán
  useEffect(() => {
    // Nếu là SEPAY và chưa thanh toán -> Lấy ảnh QR
    if (checkout && checkout.paymentMethod === 'SEPAY' && !checkout.isPaid) {
      dispatch(getSepayQrInfo(checkout._id))
    }

    // Nếu là SEPAY và chưa xong -> Tự động check trạng thái mỗi 3 giây
    if (checkout?.paymentMethod === 'SEPAY' && !checkout.isPaid && !isPaidSuccess) {
      pollingInterval.current = setInterval(() => {
        dispatch(checkPaymentStatus(checkout._id))
      }, 3000)
    }

    // Dọn dẹp interval khi thoát trang
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
    }
  }, [checkout, isPaidSuccess, dispatch])

  // 3. LOGIC CHUYỂN TRANG KHI SEPAY THANH TOÁN THÀNH CÔNG
  useEffect(() => {
    if (isPaidSuccess && finalOrderId) {
      if (pollingInterval.current) clearInterval(pollingInterval.current)
      toast.success('Thanh toán thành công!')

      setTimeout(() => {
        const orderId = finalOrderId
        navigate(`/order-success/${orderId}`, { replace: true })
      }, 1500)
    }
  }, [isPaidSuccess, finalOrderId, navigate])


  // 4. LOGIC XỬ LÝ NÚT BẤM CHO COD
  const handleFinalizeCOD = async () => {
    if (!checkout || isFinalizing || checkout.isPaid) return
    setIsFinalizing(true)

    try {
      // Gọi API Finalize để chốt đơn COD
      const resultAction = await dispatch(finalizeOrder(checkout._id))

      if (finalizeOrder.fulfilled.match(resultAction)) {
        const orderId = resultAction.payload?.orderId
        navigate(`/order-success/${orderId}`, { replace: true })
      } else {
        toast.error('Lỗi: ' + (resultAction.payload?.message || resultAction.error.message))
      }
    } catch (err) {
      toast.error('Xác nhận thất bại.')
    } finally {
      setIsFinalizing(false)
    }
  }


  // Xử lý loading/lỗi
  if (error || !checkout) return <div className="p-10 text-center text-red-500 font-bold">Không tìm thấy đơn hàng hoặc có lỗi xảy ra.</div>

  // Màn hình chờ khi Sepay
  if (isPaidSuccess) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-green-50">
        <CircularProgress color="success" />
        <h2 className="mt-4 text-2xl font-bold text-green-700">Thanh toán thành công! Đang chuyển hướng...</h2>
      </div>
    )
  }

  const discountAmount = checkout.coupon?.discountAmount || 0
  const subTotal = checkout.totalPrice + discountAmount

  return (
    <div className="bg-gray-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-8 space-y-6">

          {/* CARD THANH TOÁN ( 2 TRƯỜNG HỢP) */}
          <div className={`bg-white rounded-xl p-8 shadow-md border-t-4 ${isCOD ? 'border-blue-500' : 'border-green-500'}`}>

            {/* ================= TRƯỜNG HỢP 1: COD  ================= */}
            {isCOD ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">Xác nhận đơn hàng (COD)</h2>
                  <p className="text-gray-600 mt-2 mb-4">
                      Bạn đã chọn thanh toán khi nhận hàng. Vui lòng kiểm tra kỹ thông tin và bấm xác nhận để hoàn tất.
                  </p>

                  {/* NÚT BẤM XÁC NHẬN*/}
                  <button
                    onClick={handleFinalizeCOD}
                    disabled={isFinalizing}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <CircularProgress
                        size={20}
                        color="inherit"
                        style={{ display: isFinalizing ? 'block' : 'none' }}
                      />
                      <i
                        className="fa-solid fa-check"
                        style={{ display: isFinalizing ? 'none' : 'block' }}
                      ></i>
                    </span>

                    <span>
                      {isFinalizing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                    </span>
                  </button>

                </div>
              </div>
            ) : (
            /* ================= TRƯỜNG HỢP 2: SEPAY ================= */
              <EnhancedQRCodePayment
                qrData={qrData}
                isPaidSuccess={isPaidSuccess}
              />
            )}
          </div>

          {/* THÔNG TIN NGƯỜI NHẬN */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Thông tin nhận hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">Người nhận:</p>
                <p className="font-semibold text-base">{checkout.shippingAddress?.firstName} {checkout.shippingAddress?.lastName}</p>
                <p>{checkout.shippingAddress?.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Địa chỉ giao hàng:</p>
                <p className="font-medium">{checkout.shippingAddress?.address}</p>
                <p>{checkout.shippingAddress?.city}, {checkout.shippingAddress?.country}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-end">
              <Link to="/checkout" className="text-blue-600 font-bold hover:underline text-sm flex items-center gap-1">
                <i className="fa-solid fa-pen"></i> Chỉnh sửa thông tin
              </Link>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-bold text-gray-900">Tóm tắt đơn hàng</h3>
            </div>
            <div className="p-4 space-y-3">
              {/* List sản phẩm */}
              <div className="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {checkout.checkoutItems?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="flex-1 pr-2">
                      <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-xs">x{item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Divider />

              {/* Tổng tiền */}
              <div className="space-y-2 pt-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Vận chuyển</span>
                  <span className="text-green-600 font-bold">Miễn phí</span>
                </div>

                <div className="flex justify-between items-center border-t pt-3 mt-2">
                  <span className="font-bold text-lg text-gray-900">Tổng cộng</span>
                  <span className="font-bold text-xl text-red-600">{formatCurrency(checkout.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OrderConfirm
