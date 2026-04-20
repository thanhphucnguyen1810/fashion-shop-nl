import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { FaStar, FaHeart } from 'react-icons/fa'
import Loading from '../Common/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite, toggleFavoriteLocal } from '~/redux/slices/authSlice'
import { FaShoppingCart } from 'react-icons/fa'
import { addToCart } from '~/redux/slices/cartSlices'

const renderRatingStars = (rating) => {
  const fullStars = Math.floor(rating || 0)
  const emptyStars = 5 - fullStars
  const stars = []

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className='mr-0.5 w-3 h-3' style={{ color: '#F59E0B' }} />)
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaStar key={`empty-${i}`} className='mr-0.5 w-3 h-3' style={{ color: '#6B7280', opacity: 0.3 }} />)
  }
  return <div className='flex items-center'>{stars}</div>
}

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const ProductGrid = ({ products, error, columnCount, isFetching }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const favoriteProductIds = useSelector((state) => state.auth.user?.favorites ?? [])

  let columnClass = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  if (columnCount === 4) {
    columnClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
  } else if (columnCount === 5) {
    columnClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5'
  }


  if (products.length === 0) {
    if (isFetching) {
      return <Loading />
    }
    if (error) {
      return <p className='text-red-600 text-center p-8'>Lỗi tải sản phẩm: {error}</p>
    }
    if (!isFetching) {
      return <p className='text-gray-500 text-center p-8'>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
    }
  }

  const handleToggleFavorite = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    const isCurrentlyFavorite = favoriteProductIds.some(fav =>
      (fav._id ? fav._id.toString() : fav.toString()) === productId.toString()
    )

    dispatch(toggleFavoriteLocal(productId))

    if (isCurrentlyFavorite) {
      dispatch(removeFavorite(productId))
    } else {
      dispatch(addFavorite(productId))
    }
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        size: product.sizes?.[0] || null,
        color: product.colors?.[0] || null
      })
    )
  }

  return (
    <div
      className={`grid ${columnClass} gap-4 sm:gap-6 transition-opacity duration-300`}
      style={{ opacity: isFetching ? 0.6 : 1 }}
    >
      {products.map((product) => {
        const isFavorite = favoriteProductIds.some(fav => {
          const favId = fav._id ? fav._id.toString() : fav.toString()
          return favId === product._id.toString()
        })
        return (
          <div
            key={product._id}
            className='relative group overflow-hidden bg-white rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
            style={{ border: `1px solid ${theme.palette.divider}` }}
          >
            <Link to={`/products/${product._id}`} className='block'>

              {/* IMAGE */}
              <div className='relative w-full aspect-3/4 bg-gray-50 overflow-hidden'>
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className='w-full h-full object-cover transition duration-500 group-hover:scale-105'
                />

                {/* TAG */}
                <div className='absolute top-2 left-2 flex gap-1'>
                  <span className='px-2 py-0.5 text-[10px] bg-blue-500 text-white rounded'>NEW</span>
                  {product.disCountPrice < product.price && (
                    <span className='px-2 py-0.5 text-[10px] bg-red-500 text-white rounded'>SALE</span>
                  )}
                </div>

                {/* FAVORITE */}
                <button
                  onClick={(e) => handleToggleFavorite(e, product._id)}
                  className='absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur shadow'
                >
                  <FaHeart
                    className='w-4 h-4'
                    style={{ color: isFavorite ? '#ff4d4f' : '#999' }}
                  />
                </button>

                {/* ADD TO CART (HOVER) */}
                <div className='absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-all duration-300'>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className='w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600'
                  >
                    <FaShoppingCart />
          Thêm vào giỏ
                  </button>
                </div>
              </div>

              {/* INFO */}
              <div className='p-3 space-y-1'>
                <div className='flex items-center text-xs'>
                  {renderRatingStars(product.rating)}
                  <span className='ml-1 text-gray-400'>
          ({product.numReviews || 0})
                  </span>
                </div>

                <h4 className='text-sm font-medium line-clamp-2 min-h-10'>
                  {product.name}
                </h4>

                {product.disCountPrice < product.price ? (
                  <div className='flex gap-2 items-end'>
                    <p className='text-red-500 font-semibold'>
                      {formatCurrency(product.disCountPrice)}
                    </p>
                    <p className='text-xs line-through text-gray-400'>
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                ) : (
                  <p className='font-semibold text-gray-800'>
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default ProductGrid
