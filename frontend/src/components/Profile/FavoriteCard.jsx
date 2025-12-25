
const FavoriteCard = ({ product, theme, onRemoveFavorite }) => (
  <div
    className='relative overflow-hidden transition-all duration-300 group'
    style={{
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px'
    }}
  >
    {/* Product Image */}
    <div className='w-full aspect-square overflow-hidden'>
      <img
        src={product?.images?.[0]?.url || 'placeholder_url'}
        alt={product?.name || 'Sản phẩm'}
        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
      />
    </div>

    {/* Product Info */}
    <div className='p-2 md:p-3'>
      <h3 className='text-sm font-medium line-clamp-2' style={{ color: theme.palette.text.primary, minHeight: '40px' }}>
        {product?.name || 'Tên Sản Phẩm (Thiếu dữ liệu)'}
      </h3>
      <p className='text-md mt-1 font-bold' style={{ color: theme.palette.error.main }}>
        {product?.price ? `${product.price.toLocaleString('vi-VN')}₫` : 'N/A'}
      </p>
    </div>

    {/* Nút Xóa*/}
    <button
      onClick={(e) => {
        e.stopPropagation()
        onRemoveFavorite(product._id)
      }}
      className='absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100'
      title='Xóa khỏi Yêu thích'
    >
      <span className='material-icons' style={{ fontSize: '18px' }}>
            clear
      </span>
    </button>
  </div>
)

export default FavoriteCard
