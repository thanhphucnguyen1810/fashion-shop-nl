import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

const OrderDetailsPage = () => {
  const { id } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const theme = useTheme()

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: 'PayPal',
      shippingMethod: 'Standard',
      shippingAddress: { city: 'New York', state: 'NY', country: 'USA' },
      orderItems: [
        {
          productId: '1',
          name: 'Jacket',
          price: 100,
          quantity: 1,
          image: 'https://picsum.photos/150?random=1'
        },
        {
          productId: '2',
          name: 'T-Shirt',
          price: 200,
          quantity: 2,
          image: 'https://picsum.photos/150?random=2'
        }
      ]
    }
    setOrderDetails(mockOrderDetails)
  }, [id])

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl md:text-3xl font-bold mb-6'>Chi tiết đơn hàng</h2>
      {!orderDetails ? (
        <p>Không tìm thấy thông tin đơn hàng</p>
      ) : (
        <div
          className='p-4 sm:p-6 rounded-lg border'
          style={{ borderColor: theme.palette.divider }}
        >
          {/* Order Info */}
          <div className='flex flex-col sm:flex-row justify-between mb-8'>
            <div>
              <h3 className='text-lg md:text-xl font-semibold'>
                Mã đơn hàng: #{orderDetails._id}
              </h3>
              <p style={{ color: theme.palette.text.secondary }}>
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className='flex flex-col items-start sm:items-end mt-4 sm:mt-0'>
              <span
                style={{
                  backgroundColor: orderDetails.isPaid
                    ? theme.palette.success.light
                    : theme.palette.error.light,
                  color: orderDetails.isPaid
                    ? theme.palette.success.lighter
                    : theme.palette.error.lighter
                }}
                className='px-3 py-1 rounded-full text-sm font-medium mb-2'
              >
                {orderDetails.isPaid ? 'Đã thanh toán' : 'Chờ xác nhận'}
              </span>
              <span
                style={{
                  backgroundColor: orderDetails.isDelivered
                    ? theme.palette.success.light
                    : theme.palette.warning.light,
                  color: orderDetails.isDelivered
                    ? theme.palette.success.lighter
                    : theme.palette.warning.lighter
                }}
                className='px-3 py-1 rounded-full text-sm font-medium mb-2'
              >
                {orderDetails.isDelivered ? 'Đã giao hàng' : 'Đang giao'}
              </span>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8'>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Thông tin thanh toán</h4>
              <p>Phương thức thanh toán: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>
            <div>
              <h4 className='text-lg font-semibold mb-2'>Thông tin giao hàng</h4>
              <p>Phương thức giao hàng: {orderDetails.shippingMethod}</p>
              <p>
                Địa chỉ:{' '}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className='overflow-x-auto'>
            <h4 className='text-lg font-semibold mb-4'>Sản phẩm</h4>
            <table
              className='min-w-full mb-4'
              style={{ color: theme.palette.text.primary }}
            >
              <thead style={{ backgroundColor: theme.palette.grey[500], color: theme.palette.text.primary }}>
                <tr>
                  <th className='py-2 px-4 text-left'>Tên sản phẩm</th>
                  <th className='py-2 px-4 text-left'>Đơn giá</th>
                  <th className='py-2 px-4 text-left'>Số lượng</th>
                  <th className='py-2 px-4 text-left'>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <td className='py-2 px-4 flex items-center'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-12 h-12 rounded-lg mr-4'
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        style={{ color: theme.palette.primary.main }}
                        className='hover:underline'
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className='py-2 px-4'>${item.price}</td>
                    <td className='py-2 px-4'>{item.quantity}</td>
                    <td className='py-2 px-4'>${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back Link */}
          <Link
            to='/my-orders'
            style={{ color: theme.palette.primary.main }}
            className='hover:underline'
          >
            Quay lại đơn hàng của tôi
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderDetailsPage
