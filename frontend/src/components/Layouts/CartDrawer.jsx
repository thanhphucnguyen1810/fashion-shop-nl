import { IoMdClose } from 'react-icons/io'
import { useTheme } from '@mui/material/styles'
import CartContents from '~/components/Cart/CartContents'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useState } from 'react'
import { applyCoupon } from '~/redux/slices/cartSlices'
import { toast } from 'sonner'

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const textPrimary = isDark ? theme.palette.common.white : theme.palette.primary.dark
  const bgMain = isDark ? 'bg-slate-800' : 'bg-white'
  const bgSection = isDark ? 'bg-slate-900' : 'bg-gray-50'
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200'
  const btnBg = theme.palette.primary.main
  const btnHover = theme.palette.primary.dark
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500'

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, guestId } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)
  const userId = user ? user._id : null

  const [couponCode, setCouponCode] = useState('')

  const totalItems = cart?.products?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0
  const subtotal = cart?.products?.reduce(
    (acc, item) => acc + (item?.quantity || 0) * (item.price || 0),
    0
  ) || 0
  const discountAmount = cart?.coupon?.discountAmount || 0
  const grandTotal = Math.max(0, subtotal - discountAmount)

  const handleCheckout = () => {
    toggleCartDrawer()
    if (!user) {
      navigate('/login?redirect=checkout')
    } else {
      navigate('/checkout')
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      await dispatch(applyCoupon({ code: couponCode, userId, guestId })).unwrap()
      toast.success('Áp dụng mã giảm giá thành công!')
    } catch (error) {
      const errorMessage = error.message || 'Lỗi không xác định khi áp dụng mã.'
      toast.error(errorMessage)
    }
  }

  return (
    <div className={`fixed inset-0 z-1000 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

      {/* 1. OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleCartDrawer}
        ></div>
      )}

      {/* DRAWER CONTENT */}
      <div
        className={`
          fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-120 h-full
          ${bgMain}
          shadow-xl transform transition-transform duration-300
          flex flex-col z-50 
          ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >

        {/* HEADER */}
        <div
          className={`flex items-center justify-between p-4 border-b ${borderColor}`}
          style={{ backgroundColor: theme.palette.background.paper }}
        >
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon style={{ color: textPrimary }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: textPrimary }}
            >
              Giỏ hàng của bạn ({totalItems})
            </h2>
          </div>
          <button
            onClick={toggleCartDrawer}
            className={'hover:opacity-70 transition'}
            style={{ color: textPrimary }}
            title="Đóng giỏ hàng"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        {/* 2. Nội dung giỏ hàng */}
        <div className={`grow overflow-y-auto ${bgSection} p-4`}>
          {cart && cart?.products?.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p className={`text-center py-8 ${secondaryText}`}>Giỏ hàng đang trống!</p>
          )}
        </div>

        {/* 3. FOOTER (Khu vực thanh toán) */}
        <div className={`p-4 border-t ${borderColor} ${bgMain} sticky bottom-0`}>
          {cart && cart?.products?.length > 0 && (
            <>
              {/*Khu vực nhập Mã giảm giá */}
              <div className="flex items-center space-x-2 mb-4 p-3 border rounded-md" style={{ borderColor: borderColor }}>
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className={`grow border-none focus:ring-0 focus:outline-none ${bgMain} ${textPrimary} placeholder-${secondaryText}`}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="px-4 py-1 text-sm font-medium rounded-sm transition duration-150 text-white"
                  style={{
                    backgroundColor: btnBg
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = btnHover)}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = btnBg)}
                  onClick={handleApplyCoupon}
                >
                  Áp dụng
                </button>
              </div>

              <div className="space-y-1 mb-3 text-sm">
                <div className="flex justify-between">
                  <span className={secondaryText}>Tạm tính ({totalItems} sản phẩm):</span>
                  <span className={textPrimary}>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className={secondaryText}>Giảm giá:</span>
                    <span className="font-medium text-green-600">
                      - {discountAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-4 pt-3 border-t" style={{ borderColor: borderColor }}>
                <span className={`text-base font-bold ${textPrimary}`}>Tổng thanh toán:</span>
                <span className={'text-2xl font-bold'} style={{ color: theme.palette.primary.main }}>
                  {grandTotal.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <button
                className={'w-full text-white py-3 rounded-sm font-semibold transition duration-200 shadow-lg'}
                style={{
                  backgroundColor: btnBg
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = btnHover)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = btnBg)}
                onClick={handleCheckout}
              >
                Thanh toán ({totalItems})
              </button>
              <p className={`text-xs text-center mt-3 ${secondaryText}`}>
                Phí vận chuyển, thuế và các ưu đãi khác sẽ được tính ở bước tiếp theo.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
