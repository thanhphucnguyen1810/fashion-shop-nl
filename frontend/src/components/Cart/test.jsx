import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import InputField from '../InputField'
import { createCheckout } from '~/redux/slices/checkoutSlice'
import PayPalButton from './PayPalButton'

// Giả định SepayButton là một nút/component chuyển hướng
const SepayButton = ({ onClick, amount }) => (
  <button
    type="button"
    onClick={onClick}
    className="py-3 px-0 rounded-md w-full font-semibold cursor-pointer text-white transition duration-200"
    style={{ backgroundColor: 'green' }} // Màu Sepay (Ví dụ)
  >
        Thanh toán qua Sepay (${amount?.toLocaleString() || 0})
  </button>
)
// -------------------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL


const Checkout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Lấy dữ liệu từ Redux Store
  const { cart, loading, error } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  // Khởi tạo State
  const [paymentMethod, setPaymentMethod] = useState('Paypal') // Mặc định
  const [checkoutId, setCheckoutId] = useState(null)
  const [isCreating, setIsCreating] = useState(false) // Trạng thái tạo đơn hàng

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam', // Mặc định Vietnam
    phone: ''
  })

  // -------------------------------------------------------------
  // LOGIC KHỞI TẠO DỮ LIỆU
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Kiểm tra giỏ hàng và chuyển hướng
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate('/')
      toast.error('Giỏ hàng đang trống.')
    }

    // 2. Điền thông tin người dùng có sẵn
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        // Giả định user có các trường address, phone, city...
        address: user.address || prev.address,
        city: user.city || prev.city,
        postalCode: user.postalCode || prev.postalCode,
        phone: user.phone || prev.phone
      }))
    }
  }, [cart, navigate, user])

  // -------------------------------------------------------------
  // LOGIC TÍNH TOÁN (Dùng useMemo để tối ưu)
  // -------------------------------------------------------------
  const { subTotal, discountAmount, finalTotal } = useMemo(() => {
    if (!cart || !cart.products) return { subTotal: 0, discountAmount: 0, finalTotal: 0 }

    const calculatedSubTotal = cart.products.reduce(
      (acc, item) => acc + (item.quantity * item.price),
      0
    )
    const calculatedDiscountAmount = cart.coupon?.discountAmount || 0
    const shippingFee = 0 // Giả định phí vận chuyển miễn phí

    const calculatedFinalTotal = calculatedSubTotal - calculatedDiscountAmount + shippingFee

    return {
      subTotal: calculatedSubTotal,
      discountAmount: calculatedDiscountAmount,
      finalTotal: Math.max(0, calculatedFinalTotal)
    }
  }, [cart])

  // -------------------------------------------------------------
  // LOGIC XỬ LÝ THANH TOÁN (BACKEND API)
  // -------------------------------------------------------------

  // Hàm gọi khi PayPal/Sepay báo thành công
  const handlePaymentSuccess = async (details) => {
    try {
      // Bước 2a: Cập nhật trạng thái thanh toán trên server (đánh dấu là PAID)
      const response = await axios.put(
        `${API_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: 'paid', paymentDetails: details },
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      )

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId) // Bước 3: Hoàn tất đơn hàng
      } else {
        toast.error('Cập nhật thanh toán thất bại.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Lỗi xử lý thanh toán. Vui lòng kiểm tra lại đơn hàng.')
    }
  }

  // Hàm hoàn tất đơn hàng (Tạo Order chính thức, trừ tồn kho...)
  const handleFinalizeCheckout = async (id) => {
    try {
      await axios.post(
        `${API_URL}/api/checkout/${id}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      )
      toast.success('Đặt hàng thành công! Đang chuyển hướng...')
      navigate('/order-confirmation')
    } catch (error) {
      console.error(error)
      toast.error('Lỗi hoàn tất đơn hàng. Vui lòng liên hệ hỗ trợ.')
    }
  }

  // Hàm Khởi tạo Checkout (Backend Call 1)
  const handleCreateCheckout = async (event) => {
    event.preventDefault()

    // Xác thực Form cơ bản
    if (!shippingAddress.firstName || !shippingAddress.address || !shippingAddress.phone) {
      toast.error('Vui lòng điền đầy đủ Họ, Địa chỉ và SĐT.')
      return
    }

    setIsCreating(true)

    // LOGIC TẠO ĐƠN HÀNG TRÊN SERVER ⭐️
    try {
      // Giả sử createCheckout là một asyncThunk của bạn
      const res = await dispatch(
        // Thay thế bằng action thực tế của bạn
        // createCheckout({
        //     checkoutItems: cart.products,
        //     shippingAddress,
        //     paymentMethod,
        //     totalPrice: finalTotal,
        //     coupon: cart.coupon
        // })
        // Tạm thời giả lập API Call:
        async () => {
          // Gọi API thực tế ở đây
          const response = await axios.post(`${API_URL}/api/checkout/create`, { /* data */ })
          return response.data // Server trả về { _id: '...' , paymentLink: '...' }
        }
      ).unwrap() // Nếu không dùng Thunk, dùng Promise.resolve(res)

      // Giả lập kết quả API
      const apiResult = { _id: 'chk_' + Date.now(), paymentLink: '/sepay-redirect' }

      const newCheckoutId = apiResult._id || res._id
      setCheckoutId(newCheckoutId)

      if (paymentMethod === 'Sepay' && apiResult.paymentLink) {
        // Xử lý Sepay: Chuyển hướng đến cổng thanh toán
        window.location.href = apiResult.paymentLink
        // Sau khi thanh toán, Sepay sẽ Webhook về server và server gọi finalize.
      } else {
        // Xử lý PayPal: Chờ người dùng nhấn nút PayPal button
        toast.success('Đã khởi tạo đơn hàng. Vui lòng thanh toán.')
      }

    } catch (err) {
      const errorMessage = err.message || err.payload?.message || 'Lỗi khi khởi tạo đơn hàng.'
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  // -------------------------------------------------------------
  // LOGIC RENDER
  // -------------------------------------------------------------
  const borderColor = theme.palette.divider
  const primaryColor = theme.palette.primary.main

  if (loading) return <p>Đang tải giỏ hàng...</p>
  if (error) return <p>Lỗi: {error}</p>
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Giỏ hàng đang trống!</p>
  }

  // // Helper cho Input
  // const InputField = ({ label, name, type = 'text', value, onChange, disabled = false }) => (
  //   <div>
  //     <label style={{ color: theme.palette.text.primary }} className='block'>{label}</label>
  //     <input
  //       type={type}
  //       className='w-full p-2 rounded border border-gray-400'
  //       style={{
  //         color: theme.palette.text.primary,
  //         backgroundColor: theme.palette.background.default
  //       }}
  //       name={name}
  //       value={value}
  //       required
  //       onChange={onChange}
  //       disabled={disabled}
  //     />
  //   </div>
  // )

  // Hàm format tiền tệ
  const formatCurrency = (amount) =>
    amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })


  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* Left Section: FORM */}
      <div
        style={{ backgroundColor: theme.palette.background.paper }}
        className='rounded-lg p-6'
      >
        <h2 className='text-4xl text-center font-Poppins mb-2 uppercase tracking-widest'>
          Thanh toán
        </h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 style={{ color: theme.palette.text.primary }} className='text-xl font-semibold mb-6 uppercase'>
        Thông tin nhận hàng
          </h3>

          {/* 1. THÔNG TIN LIÊN HỆ */}
          <div className='mb-6'>
            <h4 style={{ color: theme.palette.text.secondary }} className='text-sm font-medium mb-1'>
            Email liên hệ
            </h4>
            <InputField
              label="Email"
              type="email"
              value={user ? user.email : ''}
              disabled
              theme={theme}
            />
          </div>

          {/* 2. ĐỊA CHỈ GIAO HÀNG */}
          <h4 style={{ color: theme.palette.text.primary }} className='text-lg font-medium mb-4'>
        Địa chỉ nhận hàng và Người nhận
          </h4>

          {/* Họ và Tên (2 cột) */}
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <InputField
              label="Họ"
              name="firstName"
              value={shippingAddress.firstName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
              theme={theme}
            />
            <InputField
              label="Tên"
              name="lastName"
              value={shippingAddress.lastName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
              theme={theme}
            />
          </div>

          {/* Địa chỉ Chi tiết (1 cột) - SỬA LỖI LẶP */}
          <div className='mb-4'>
            <InputField
              label="Địa chỉ chi tiết (Số nhà, tên đường/phố)"
              name="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              theme={theme}
            />
          </div>

          {/* Thành phố/Tỉnh & Mã bưu điện (2 cột) */}
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <InputField
              label="Thành phố/Tỉnh"
              name="city"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              theme={theme}
            />
            <InputField
              label="Mã bưu điện (Tùy chọn)"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              required={false}
              theme={theme}
            />
          </div>

          {/* Quốc gia (1 cột) */}
          <div className='mb-4'>
            <InputField
              label="Quốc gia"
              name="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              theme={theme}
            />
          </div>

          {/* Số điện thoại (1 cột) */}
          <div className='mb-6'>
            <InputField
              label="Số điện thoại nhận hàng"
              name="phone"
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              theme={theme}
            />
          </div>


          {/* --- KHU VỰC LỰA CHỌN THANH TOÁN (Giữ nguyên) --- */}
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4 mt-6'>
        Phương thức Thanh toán
          </h3>
          <div className='mb-6 space-y-3'>
            {['Paypal', 'Sepay'].map((method) => (
              <label
                key={method}
                className='flex items-center p-3 rounded-md cursor-pointer'
                style={{
                  border: `1px solid ${paymentMethod === method ? primaryColor : borderColor}`,
                  color: theme.palette.text.secondary
                }}
              >
                <input
                  type='radio'
                  name='payment'
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className='mr-3'
                />
                Thanh toán qua {method}
              </label>
            ))}
          </div>

          <div className='mt-6'>
            {!checkoutId ? (
              <button
                type='submit'
                className='py-3 px-0 rounded-md w-full font-semibold cursor-pointer'
                style={{
                  backgroundColor: primaryColor,
                  color: theme.palette.primary.contrastText,
                  opacity: isCreating ? 0.7 : 1
                }}
                disabled={isCreating}
              >
                {isCreating ? 'Đang khởi tạo...' : 'Khởi tạo đơn hàng & Tiếp tục'}
              </button>
            ) : (
              <div>
                <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4'>
                    Thanh toán bằng {paymentMethod}
                </h3>

                {/* HIỂN THỊ NÚT THANH TOÁN TƯƠNG ỨNG */}
                {paymentMethod === 'Paypal' && (
                  <PayPalButton
                    amount={finalTotal}
                    onSuccess={handlePaymentSuccess}
                    onError={() => toast.error('Thanh toán PayPal thất bại. Vui lòng thử lại.')}
                  />
                )}

                {paymentMethod === 'Sepay' && (
                  <SepayButton
                    amount={finalTotal}
                    onClick={() => handleCreateCheckout({ preventDefault: () => {} })}
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section:(CHECKOUT SUMMARY) */}
      <div
        className='p-6 rounded-xl shadow-lg h-fit sticky top-8'
        style={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${borderColor}`
        }}
      >
        <div>
          <h3
            style={{
              color: theme.palette.text.primary,
              borderBottom: `2px solid ${borderColor}`
            }}
            className='text-xl font-bold pb-3 mb-4'
          >
        Tóm tắt Đơn hàng
          </h3>

          {/* CHI TIẾT SẢN PHẨM  */}
          <div
            className='py-2 mb-4 space-y-3'
          >
            {cart.products.map((product, index) => (
              <div
                key={index}
                className='flex items-center justify-between py-2'
                style={{
                  borderBottom: `1px dashed ${borderColor}`
                }}
              >
                <div className='flex items-start'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-14 h-14 object-cover mr-4 rounded-md border'
                    style={{ borderColor: borderColor }}
                  />
                  <div>
                    <h4
                      style={{ color: theme.palette.text.primary }}
                      className='text-sm font-medium leading-tight'
                    >
                      {product.name}
                    </h4>
                    <p style={{ color: theme.palette.text.secondary }} className='text-xs mt-0.5'>
                            Số lượng: <span className='font-semibold'>x{product.quantity}</span>
                    </p>
                  </div>
                </div>
                {/* Tổng tiền từng sản phẩm */}
                <p
                  style={{ color: theme.palette.text.primary }}
                  className='text-sm font-semibold'
                >
                  {formatCurrency(product.price * product.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* CHI TIẾT GIÁ */}
          <div className='space-y-3'>
            <div className='flex justify-between items-center text-md'>
              <p style={{ color: theme.palette.text.primary }}>Tạm tính</p>
              <p className='font-medium' style={{ color: theme.palette.text.primary }}>
                {formatCurrency(subTotal)}
              </p>
            </div>

            {discountAmount > 0 && (
              <div className='flex justify-between items-center text-md'>
                <p className='font-medium text-green-500'>Mã giảm giá</p>
                <p className='font-bold text-green-500'>
                    - {formatCurrency(discountAmount)}
                </p>
              </div>
            )}

            {/* PHÍ VẬN CHUYỂN */}
            <div className='flex justify-between items-center text-md'>
              <p style={{ color: theme.palette.text.primary }}>Phí vận chuyển</p>
              <p className='font-medium' style={{ color: theme.palette.text.primary }}>
                Miễn phí
              </p>
            </div>
          </div>

          {/* TỔNG CỘNG */}
          <div
            className='flex justify-between items-center text-xl mt-5 pt-4 border-t font-bold'
            style={{
              borderColor: borderColor,
              borderTopWidth: 1,
              borderStyle: 'solid'
            }}
          >
            <p style={{ color: theme.palette.text.primary }}>Tổng cộng</p>
            <p style={{ color: primaryColor }} className='text-xl'>
              {formatCurrency(finalTotal)}
            </p>
          </div>
        </div>


      </div>

    </div>
  )
}

export default Checkout
