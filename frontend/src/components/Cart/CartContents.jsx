import { FiTrash2 } from 'react-icons/fi'
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '~/redux/slices/cartSlices'


const CartContents = ({ cart, userId, guestId }) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const textPrimary = theme.palette.text.primary
  const textSecondary = theme.palette.text.secondary
  const primaryColor = theme.palette.primary.main
  const dividerColor = theme.palette.divider
  const errorColor = theme.palette.error.main


  // handle adding or substracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta
    if (newQuantity) {
      dispatch(updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        guestId,
        userId,
        size,
        color
      }))
    }
  }

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }))
  }

  return (
    <div className="w-full mx-auto">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex py-4 border-b last:border-none"
          style={{ borderColor: dividerColor }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover mr-4 rounded-md shrink-0"
          />

          <div className="grow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {/* Tên sản phẩm */}
              <h3
                className="text-sm font-semibold pr-4"
                style={{ color: textPrimary }}
              >
                {product.name}
              </h3>

              {/* Nút Xóa (Đặt ở góc trên bên phải) */}
              <button
                onClick={() => handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )}
                title="Xóa sản phẩm"
                className="shrink-0 ml-2"
                style={{ color: errorColor }}
              >
                <FiTrash2 className="h-4 w-4 hover:opacity-70 transition" />
              </button>
            </div>

            {/* Thuộc tính (Size, Color) */}
            <p className="text-xs mt-1" style={{ color: textSecondary }}>
              Kích cỡ: <span style={{ color: primaryColor, fontWeight: 500 }}>{product.size}</span>
              {' | '}
              Màu sắc: <span style={{ color: theme.palette.secondary.main, fontWeight: 500 }}>{product.color}</span>
            </p>

            {/* Giá & Số lượng */}
            <div className="flex items-center justify-between mt-2">
              {/* Giá sản phẩm */}
              <p
                className="text-sm font-bold"
                style={{ color: primaryColor }}
              >
                {product.price.toLocaleString('vi-VN')}₫
              </p>

              {/* Bộ đếm số lượng */}
              <div className="flex items-center border rounded" style={{ borderColor: dividerColor }}>
                {/* Nút giảm */}
                <button
                  onClick={() => handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color
                  )}
                  className="w-7 h-7 flex items-center justify-center text-base transition"
                  style={{ color: textPrimary, borderRight: `1px solid ${dividerColor}` }}
                  disabled={product.quantity <= 1}
                >
                  −
                </button>

                {/* Số lượng */}
                <span
                  className="w-8 h-7 flex items-center justify-center text-sm font-medium"
                  style={{ color: textPrimary, backgroundColor: theme.palette.action.hover }}
                >
                  {product.quantity}
                </span>

                {/* Nút tăng */}
                <button
                  onClick={() => handleAddToCart(
                    product.productId,
                    1,
                    product.quantity,
                    product.size,
                    product.color
                  )}
                  className="w-7 h-7 flex items-center justify-center text-base transition"
                  style={{ color: textPrimary, borderLeft: `1px solid ${dividerColor}` }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartContents
