import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import PayPalButton from './PayPalButton'

const cart = {
  products:[
    {
      name: 'T-shirt',
      size: 'M',
      color: 'Red',
      price: 39.99,
      quantity: 1,
      image: 'https://picsum.photos/200?random=1'
    },
    {
      name: 'Jeans',
      size: 'L',
      color: 'Blue',
      price: 89.99,
      quantity: 1,
      image: 'https://picsum.photos/200?random=2'
    }
  ],
  totalPrice: 129.98
}

const Checkout = () => {
  const navigate = useNavigate()
  const theme = useTheme() // Lấy theme MUI

  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  })

  const [checkoutId, setCheckoutId] = useState(null)

  const handleCreateCheckout = (event) => {
    event.preventDefault()
    setCheckoutId(123)
  }

  const handlePaymentSuccess = (details) => {
    navigate('/order-confirmation')
  }

  // Màu border mặc định thay vì dùng class 'border' Tailwind
  const borderColor = theme.palette.divider

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      {/* Left Section */}
      <div
        style={{ backgroundColor: theme.palette.background.paper }}
        className='rounded-lg p-6'
      >
        <h2
          style={{ color: theme.palette.text.primary }}
          className='text-2xl uppercase mb-6'
        >
          Thanh toán
        </h2>
        <form onSubmit={handleCreateCheckout}>
          <h3
            style={{ color: theme.palette.text.primary }}
            className='text-lg mb-4'
          >
            Thông tin liên hệ
          </h3>
          <div className='mb-4'>
            <label
              style={{ color: theme.palette.text.primary }}
              className='block'
            >
              Email
            </label>
            <input
              type='email'
              value='user@example.com'
              className='w-full p-2 border rounded'
              disabled
              style={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper
              }}
            />
          </div>

          <h3
            style={{ color: theme.palette.text.primary }}
            className='text-lg mb-4'
          >
            Địa chỉ giao hàng
          </h3>

          <div className='mb-4 grid grid-cols-2 gap-4'>
            {/* First Name */}
            <div>
              <label
                style={{ color: theme.palette.text.primary }}
                className='block'
              >
                Họ
              </label>
              <input
                type='text'
                className='w-full p-2 rounded border border-gray-400'
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.default
                }}
                value={shippingAddress.firstName}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value
                  })
                }
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                style={{ color: theme.palette.text.primary }}
                className='block'
              >
                Tên
              </label>
              <input
                type='text'
                className='w-full p-2 rounded border border-gray-400'
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.default
                }}
                value={shippingAddress.lastName}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Address */}
          <div className='mb-4'>
            <label
              style={{ color: theme.palette.text.primary }}
              className='block'
            >
              Địa chỉ
            </label>
            <input
              type='text'
              className='w-full p-2 rounded border border-gray-400'
              style={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default
              }}
              value={shippingAddress.address}
              required
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value
                })
              }
            />
          </div>

          <div className='mb-4 grid grid-cols-2 gap-4'>
            {/* City */}
            <div>
              <label
                style={{ color: theme.palette.text.primary }}
                className='block'
              >
                Thành phố
              </label>
              <input
                type='text'
                className='w-full p-2 rounded border border-gray-400'
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.default
                }}
                value={shippingAddress.city}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value
                  })
                }
              />
            </div>

            {/* Postal Code */}
            <div>
              <label
                style={{ color: theme.palette.text.primary }}
                className='block'
              >
                Mã bưu điện
              </label>
              <input
                type='text'
                className='w-full p-2 rounded border border-gray-400'
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.default
                }}
                value={shippingAddress.postalCode}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Country */}
          <div className='mb-4'>
            <label
              style={{ color: theme.palette.text.primary }}
              className='block'
            >
              Quốc gia
            </label>
            <input
              type='text'
              className='w-full p-2 rounded border border-gray-400'
              style={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default
              }}
              value={shippingAddress.country}
              required
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value
                })
              }
            />
          </div>

          {/* Phone */}
          <div className='mb-4'>
            <label
              style={{ color: theme.palette.text.primary }}
              className='block'
            >
              Số điện thoại
            </label>
            <input
              type='tel'
              className='w-full p-2 rounded border border-gray-400'
              style={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default
              }}
              value={shippingAddress.phone}
              required
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value
                })
              }
            />
          </div>

          <div className='mt-6'>
            {!checkoutId ? (
              <button
                type='submit'
                className='py-3 px-0 rounded-md w-full font-semibold cursor-pointer'
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                Tiếp tục thanh toán
              </button>
            ) : (
              <div>
                <h3
                  style={{ color: theme.palette.text.primary }}
                  className='text-lg mb-4'
                >
                  Thanh toán bằng PayPal
                </h3>
                <PayPalButton
                  amount={100}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert('Thanh toán thất bại. Vui lòng thử lại.')}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div
        className='p-6 rounded-lg'
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <h3
          style={{ color: theme.palette.text.primary }}
          className='text-lg mb-4'
        >
          Tóm tắt đơn hàng
        </h3>
        <div
          className='border-t py-4 mb-4'
          style={{ borderColor: borderColor, borderTopWidth: 1, borderStyle: 'solid' }}
        >
          {cart.products.map((product, index) => (
            <div
              key={index}
              className='flex items-start justify-between py-2 border-b'
              style={{ borderColor: borderColor, borderBottomWidth: 1, borderStyle: 'solid' }}
            >
              <div className='flex items-start'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-20 h-24 object-cover mr-4'
                />
                <div>
                  <h3 style={{ color: theme.palette.text.primary }} className='text-md'>
                    {product.name}
                  </h3>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Kích cỡ: {product.size}
                  </p>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Màu sắc: {product.color}
                  </p>
                </div>
              </div>
              <p style={{ color: theme.palette.text.primary }} className='text-xl'>
                ${product.price?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className='flex justify-between items-center text-lg mb-4'>
          <p style={{ color: theme.palette.text.primary }}>Tạm tính</p>
          <p style={{ color: theme.palette.text.primary }}>
            ${cart.totalPrice?.toLocaleString()}
          </p>
        </div>

        <div className='flex justify-between items-center text-lg'>
          <p style={{ color: theme.palette.text.primary }}>Phí vận chuyển</p>
          <p style={{ color: theme.palette.text.primary }}>Miễn phí</p>
        </div>

        <div
          className='flex justify-between items-center text-lg mt-4 pt-4 border-t font-semibold'
          style={{ borderColor: borderColor, borderTopWidth: 1, borderStyle: 'solid' }}
        >
          <p style={{ color: theme.palette.text.primary }}>Tổng cộng</p>
          <p style={{ color: theme.palette.text.primary }}>
            ${cart.totalPrice?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Checkout
