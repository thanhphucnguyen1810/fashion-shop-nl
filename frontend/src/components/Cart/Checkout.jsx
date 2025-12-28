import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import InputField from '../InputFieldCheckout'
import { createCheckout } from '~/redux/slices/checkoutSlice'
import { fetchAddresses } from '~/redux/slices/addressSlice'
import { CircularProgress } from '@mui/material'

const Checkout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { cart } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.checkout)
  const { list: addresses } = useSelector((state) => state.address)

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam',
    phone: ''
  })

  // --- 1. KIỂM TRA GIỎ HÀNG & ĐIỀN SẴN THÔNG TIN USER ---
  useEffect(() => {
    if (!cart?.products?.length) {
      navigate('/')
      toast.error('Giỏ hàng đang trống.')
      return
    }

    if (user) {
      if (!addresses.length) {
        dispatch(fetchAddresses())
      }

      const defaultAddress = addresses?.find(addr => addr.isDefault)

      let initialData = { ...shippingAddress }

      if (defaultAddress) {
        const fullNameParts = defaultAddress.name?.split(' ')

        initialData = {
          firstName: fullNameParts?.[0] || '',
          lastName: fullNameParts?.slice(1).join(' ') || '',
          address: `${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.district}`,
          city: defaultAddress.province || '',
          phone: defaultAddress.phone || '',
          country: 'Vietnam',
          postalCode: defaultAddress.postalCode || ''
        }

      } else {
        // Ưu tiên 2: Thông tin User cơ bản (chỉ áp dụng nếu chưa có địa chỉ mặc định)
        initialData = {
          ...initialData,
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          address: user.address || initialData.address,
          city: user.city || initialData.city,
          postalCode: user.postalCode || initialData.postalCode,
          phone: user.phone || initialData.phone
        }
      }

      // CẬP NHẬT STATE
      setShippingAddress(initialData)
    }
  }, [cart, user, navigate, addresses, dispatch])

  // --- TÍNH TOÁN GIÁ TRỊ ĐƠN HÀNG ---
  const { subTotal, discountAmount, finalTotal } = useMemo(() => {
    if (!cart?.products) return { subTotal: 0, discountAmount: 0, finalTotal: 0 }

    const sub = cart.products.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const discount = cart.coupon?.discountAmount || 0

    return {
      subTotal: sub,
      discountAmount: discount,
      finalTotal: Math.max(0, sub - discount)
    }
  }, [cart])

  // --- XỬ LÝ TẠO BẢN GHI CHECKOUT TẠM THỜI ---
  const handlePlaceOrder = async (event) => {
    event.preventDefault()

    if (!shippingAddress.firstName || !shippingAddress.address || !shippingAddress.phone) {
      toast.error('Vui lòng điền đủ Họ tên, Địa chỉ và SĐT.')
      return
    }

    const shippingAddressForApi = {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
      phone: shippingAddress.phone,
      street: shippingAddress.address,
      province: shippingAddress.city,
      district: 'Chưa cập nhật',
      ward: 'Chưa cập nhật'
    }

    try {
      // BƯỚC 1: GỌI API TẠO BẢN GHI CHECKOUT TẠM THỜI (Status: Pending)
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress: shippingAddressForApi,
          paymentMethod,
          totalPrice: finalTotal,
          coupon: cart.coupon || null
        })
      ).unwrap()

      const newCheckoutId = res.checkout._id
      toast.success('Đơn hàng tạm thời đã được tạo! Vui lòng xác nhận.')

      // BƯỚC 2: CHUYỂN HƯỚNG SANG TRANG CONFIRM ĐỂ THỰC HIỆN ACTION CUỐI CÙNG
      navigate(`/order-confirm/${newCheckoutId}`)

    } catch (err) {
      toast.error(err?.message || 'Không tạo được đơn hàng.')
    }
  }

  // --- RENDER UI ---
  const borderColor = theme.palette.divider
  const primaryColor = theme.palette.primary.main
  const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* === CỘT TRÁI: FORM THÔNG TIN === */}
      <div className='rounded-lg p-6 shadow-sm' style={{ backgroundColor: theme.palette.background.paper }}>
        <h2 className='text-3xl text-center font-semibold mb-6 uppercase'>Thanh toán</h2>

        <form onSubmit={handlePlaceOrder}>

          {/* Thông tin giao hàng... (GIỮ NGUYÊN FORM INPUT) */}
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg font-semibold mb-4 border-b pb-2'>
            1. Thông tin nhận hàng
          </h3>
          {/* Họ Tên */}
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <InputField
              label="Họ" name="firstName" value={shippingAddress.firstName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
              theme={theme}
            />
            <InputField
              label="Tên" name="lastName" value={shippingAddress.lastName}
              onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
              theme={theme}
            />
          </div>
          {/* Địa chỉ & SĐT */}
          <div className='mb-4'>
            <InputField
              label="Số điện thoại" name="phone" type="tel" value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              theme={theme}
            />
          </div>
          <div className='mb-4'>
            <InputField
              label="Địa chỉ chi tiết" name="address" value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              theme={theme}
            />
          </div>
          {/* Tỉnh/Thành - Quốc gia */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <InputField
              label="Tỉnh / Thành phố" name="city" value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              theme={theme}
            />
            <InputField
              label="Quốc gia" name="country" value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              theme={theme}
            />
          </div>

          {/* Phương thức thanh toán */}
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg font-semibold mb-4 border-b pb-2'>
            2. Phương thức thanh toán
          </h3>

          <FormControl component="fieldset" className="w-full mb-6">
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {/* COD Option */}
              <div className={`p-3 border rounded-md mb-3 flex items-center transition-colors ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <FormControlLabel
                  value="COD"
                  control={<Radio />}
                  label={<span className="font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</span>}
                  className="w-full m-0"
                />
                <i className="fa-solid fa-money-bill-wave text-green-600 ml-auto text-xl px-2"></i>
              </div>

              {/* SEPAY Option */}
              <div
                className={`p-3 border rounded-md flex items-center transition-colors ${
                  paymentMethod === 'SEPAY'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <FormControlLabel
                  value="SEPAY"
                  control={<Radio />}
                  label={
                    <span className="font-medium text-gray-700">
                    Thanh toán qua Sepay
                    </span>
                  }
                  className="w-full m-0"
                />
                <div className="ml-auto flex items-center justify-center">
                  <img
                    src="https://sepay.vn/assets/img/logo/sepay-blue-154x50.png"
                    alt="Sepay"
                    className="h-8 object-contain"
                  />
                </div>

              </div>

            </RadioGroup>
          </FormControl>

          {/* Nút hành động */}
          <div className='mt-6'>
            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 rounded-md font-bold uppercase text-white transition-opacity hover:opacity-90 shadow-md flex items-center justify-center gap-2'
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Đang tạo...
                </>
              ) : `Khởi tạo đơn hàng (${formatCurrency(finalTotal)})`}
            </button>
          </div>

        </form>
      </div>

      {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (GIỮ NGUYÊN) === */}
      <div className='h-fit sticky top-8'>
        <div className='p-6 rounded-xl shadow-lg border' style={{ backgroundColor: theme.palette.background.paper, borderColor }}>
          <h3 style={{ color: theme.palette.text.primary }} className='text-xl font-bold pb-4 mb-4 border-b'>
            Tóm tắt đơn hàng
          </h3>

          {/* List sản phẩm */}
          <div className='space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2'>
            {cart.products.map((product, index) => (
              <div key={index} className='flex gap-4'>
                <img
                  src={product.image} alt={product.name}
                  className='w-16 h-16 object-cover rounded border' style={{ borderColor }}
                />
                <div className='flex-1'>
                  <h4 className='text-sm font-medium line-clamp-2' style={{ color: theme.palette.text.primary }}>{product.name}</h4>
                  <div className='flex justify-between mt-1 text-sm'>
                    <span style={{ color: theme.palette.text.secondary }}>SL: {product.quantity}</span>
                    <span className='font-semibold' style={{ color: theme.palette.text.primary }}>
                      {formatCurrency(product.price * product.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className='space-y-3 text-sm border-t pt-4' style={{ borderColor }}>
            <div className='flex justify-between'>
              <span style={{ color: theme.palette.text.secondary }}>Tạm tính</span>
              <span style={{ color: theme.palette.text.primary }}>{formatCurrency(subTotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className='flex justify-between text-green-600'>
                <span>Giảm giá</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className='flex justify-between'>
              <span style={{ color: theme.palette.text.secondary }}>Phí vận chuyển</span>
              <span className='font-medium text-green-600'>Miễn phí</span>
            </div>

            <div className='flex justify-between items-center text-xl font-bold pt-2 border-t mt-2' style={{ borderColor, color: theme.palette.error.main }}>
              <span>Tổng cộng</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Checkout
