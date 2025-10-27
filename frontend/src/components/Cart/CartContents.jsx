import { FiTrash2 } from 'react-icons/fi'
import { useTheme } from '@mui/material/styles'

const cartProducts = [
  {
    productId: 1,
    name: 'Áo thun',
    size: 'M, L, XL, XXL',
    color: 'Đỏ, Xanh dương, Hồng',
    price: 39.99,
    quantity: 1,
    image: 'https://picsum.photos/200?random=1'
  },
  {
    productId: 2,
    name: 'Quần jeans',
    size: 'M, L, XL, S',
    color: 'Xanh, Xám, Trắng',
    price: 89.99,
    quantity: 1,
    image: 'https://picsum.photos/200?random=2'
  },
  {
    productId: 3,
    name: 'Quần kaki',
    size: 'S, M, L, XL',
    color: 'Xanh lá, Xanh dương, Đỏ',
    price: 80.0,
    quantity: 1,
    image: 'https://picsum.photos/200?random=3'
  }
]

const CartContents = () => {
  const theme = useTheme()

  return (
    <div
      className="p-4 rounded-xl shadow-md w-full max-w-3xl mx-auto"
      style={{ backgroundColor: theme.palette.background.paper }}
    >
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-4 border-b last:border-none"
          style={{ borderColor: theme.palette.divider }}
        >
          {/* Bên trái */}
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded-xl shadow-sm"
            />
            <div>
              <h3
                className="text-base font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                {product.name}
              </h3>
              <p className="text-xs" style={{ color: theme.palette.text.secondary }}>
                Kích cỡ:{' '}
                <span style={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                  {product.size}
                </span>
                <br />
                Màu sắc:{' '}
                <span style={{ color: theme.palette.secondary.main, fontWeight: 500 }}>
                  {product.color}
                </span>
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <button
                  className="w-7 h-7 flex items-center justify-center border rounded-full text-sm font-bold transition"
                  style={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.primary.main
                  }}
                >
                  −
                </button>
                <span
                  className="text-sm font-semibold"
                  style={{ color: theme.palette.text.primary }}
                >
                  {product.quantity}
                </span>
                <button
                  className="w-7 h-7 flex items-center justify-center border rounded-full text-sm font-bold transition"
                  style={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.primary.main
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bên phải */}
          <div className="text-right">
            <p
              className="text-sm font-semibold mb-2"
              style={{ color: theme.palette.text.primary }}
            >
              {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'USD' })}
            </p>
            <button title="Xóa sản phẩm" style={{ color: theme.palette.error.main }}>
              <FiTrash2 className="h-5 w-5 hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartContents
