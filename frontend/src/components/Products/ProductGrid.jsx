import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { FaStar } from 'react-icons/fa'
import Loading from '../Common/Loading'

const ACCENT_YELLOW = '#F59E0B'
const PRIMARY_COLOR = '#007bff'
const ERROR_COLOR = '#e53e3e'

const colors = {
  text: '#333',
  mutedText: '#6B7280'
}

const renderRatingStars = (rating) => {
  const fullStars = Math.floor(rating || 0)
  const emptyStars = 5 - fullStars
  const stars = []

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className='mr-0.5 w-3 h-3' style={{ color: ACCENT_YELLOW }} />)
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaStar key={`empty-${i}`} className='mr-0.5 w-3 h-3' style={{ color: colors.mutedText, opacity: 0.3 }} />)
  }
  return <div className='flex items-center'>{stars}</div>
}

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const ProductGrid = ({ products, loading, error, columnCount }) => {
  const theme = useTheme()

  let columnClass = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  if (columnCount === 4) {
    columnClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
  } else if (columnCount === 5) {
    columnClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5'
  }


  if (loading) {
    return <Loading />
  }
  if (error) {
    return <p className='text-red-600 text-center p-8'>Lỗi tải sản phẩm: {error}</p>
  }

  return (
    <div className={`grid ${columnClass} gap-4 sm:gap-6`}>
      {products.map((product) => (
        <div
          key={product._id}
          className='relative group overflow-hidden transition-all duration-300'
          style={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
          }}
        >
          <Link to={`/products/${product._id}`} className='block' style={{ textDecoration: 'none' }}>
            {/* 1. Khu vực Hình ảnh & Sale Tag */}
            <div className='w-full h-[350px] relative overflow-hidden'>
              {/* Ảnh Sản Phẩm */}
              <img
                src={product.images && product.images.length > 0 ? product.images[0].url : 'placeholder_image_url'}
                alt={product.name}
                // Áp dụng hiệu ứng hover:scale-105 và object-contain
                className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-105'
                draggable='false'
              />

              {/* TAGS (NEW & SALE) */}
              <div className='absolute top-3 left-3 flex space-x-2'>
                <span
                  className='px-3 py-1 text-xs font-bold tracking-widest text-white shadow-md'
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                        NEW
                </span>

                {/* Sale Tag (Nếu có giảm giá) */}
                {product.disCountPrice && product.disCountPrice < product.price && (
                  <span
                    className='px-3 py-1 text-xs font-bold tracking-widest text-white shadow-md'
                    style={{ backgroundColor: ERROR_COLOR }}
                  >
                            SALE
                  </span>
                )}
              </div>
            </div>

            {/* 2. Khu vực Thông tin (p-4) */}
            <div
              className='p-4 text-left transition-all duration-300'
              style={{
                backgroundColor: 'transparent',
                color: theme.palette.text.primary
              }}
            >
              {/* Đánh giá & Số lượng đánh giá */}
              <div className='flex items-center mb-1'>
                {renderRatingStars(product.rating)}
                <span className='ml-2 text-xs' style={{ color: colors.mutedText }}>
               ({product.numReviews || 0} Đánh giá)
                </span>
              </div>

              {/* Tên Sản Phẩm */}
              <h4 className='font-normal text-lg mb-1 line-clamp-1 tracking-wide'>
                {product.name}
              </h4>

              {/* Giá Khuyến Mãi & Giá Gốc */}
              {product.disCountPrice && product.disCountPrice < product.price ? (
                <div className='flex items-end space-x-2'>
                  {/* Giá Khuyến Mãi (Màu Đỏ/Error) */}
                  <p className='text-lg font-bold' style={{ color: ERROR_COLOR }}>
                    {formatCurrency(product.disCountPrice)}
                  </p>
                  {/* Giá Gốc */}
                  <p className='text-sm line-through' style={{ color: colors.mutedText }}>
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ) : (
                <p className='text-lg font-bold' style={{ color: theme.palette.text.primary }}>
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
