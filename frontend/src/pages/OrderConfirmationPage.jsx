import { useTheme } from '@mui/material/styles'

const checkout = {
  _id: '12323',
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: '1',
      name: 'Áo thun',
      size: 'M',
      color: 'Đỏ',
      price: 39.99,
      quantity: 1,
      image: 'https://picsum.photos/200?random=1'
    },
    {
      productId: '2',
      name: 'Quần jeans',
      size: 'L',
      color: 'Xanh',
      price: 89.99,
      quantity: 1,
      image: 'https://picsum.photos/200?random=2'
    }
  ],
  shippingAddress: {
    address: '123 Đường Chính',
    city: 'Thành phố Cần Thơ',
    postalCode: '10001',
    country: 'VietNam',
    phone: '1234567890'
  },
  totalPrice: 129.98
}

const OrderConfirmationPage = () => {
  const theme = useTheme()

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt)
    orderDate.setDate(orderDate.getDate() + 10)
    return orderDate.toLocaleString()
  }

  return (
    <div
      className='max-w-4xl mx-auto p-6 rounded-lg border'
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      <h1
        className='text-4xl font-bold text-center mb-8'
        style={{ color: theme.palette.primary.main }}
      >
        Cảm ơn bạn đã đặt hàng!
      </h1>

      {checkout && (
        <div>
          <div className='flex justify-between mb-20'>
            <div>
              <h2 className='text-xl font-semibold' style={{ color: theme.palette.text.primary }}>
                Mã đơn hàng: {checkout._id}
              </h2>
              <p style={{ color: theme.palette.text.secondary }}>
                Ngày đặt: {new Date(checkout.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p style={{ color: theme.palette.success.main }}>
                Dự kiến giao hàng: {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          <div className='mb-20'>
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className='flex items-center mb-4'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-16 h-16 object-cover rounded-md mr-4'
                />
                <div>
                  <h4 className='text-md font-semibold' style={{ color: theme.palette.text.primary }}>
                    {item.name}
                  </h4>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Màu: {item.color} | Kích cỡ: {item.size}
                  </p>
                </div>
                <div className='ml-auto text-right'>
                  <p className='text-md' style={{ color: theme.palette.text.primary }}>
                    {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'USD' })}
                  </p>
                  <p style={{ color: theme.palette.text.secondary }}>
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold mb-2' style={{ color: theme.palette.text.primary }}>
                Thanh toán
              </h4>
              <p style={{ color: theme.palette.text.secondary }}>Paypal</p>
            </div>

            <div>
              <h4 className='text-lg font-semibold mb-2' style={{ color: theme.palette.text.primary }}>
                Giao hàng
              </h4>
              <p style={{ color: theme.palette.text.secondary }}>
                Giao đến: {checkout.shippingAddress.address}
              </p>
              <p style={{ color: theme.palette.text.secondary }}>
                {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderConfirmationPage
