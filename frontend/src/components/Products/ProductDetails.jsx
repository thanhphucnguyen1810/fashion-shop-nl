
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProductGrid from './ProductGrid'
import { useTheme } from '@mui/material/styles'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, fetchSimilarProducts, createTemporaryOrder } from '~/redux/slices/productSlice'
import { addToCart } from '~/redux/slices/cartSlices'
import { fetchProductReviews, submitReview } from '~/redux/slices/reviewSlice'
import Loading from '../Common/Loading'
import { FaStar } from 'react-icons/fa'
import ProductReviews from '../ProductReviews'

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0đ'
  // Sử dụng 'vi-VN' để định dạng dấu chấm và thêm 'đ'
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
}

const renderRatingStars = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className='text-sm'
        style={{ color: i < fullStars ? '#ffc300' : '#E0E0E0' }}
      />
    )
  }
  return <div className='flex space-x-0.5 items-center'>{stars}</div>
}
// ----------------------------------------------------------------

const ProductDetails = ({ productId }) => {
  const theme = useTheme()
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products)
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews)
  const { user, guestId } = useSelector((state) => state.auth)

  const [mainImage, setMainImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const productFetchId = productId || id

  const totalReviews = reviews.length

  const averageRating =
  totalReviews > 0
    ? (reviews.reduce((a, b) => a + b.rating, 0) / totalReviews).toFixed(1)
    : 0

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId))
      dispatch(fetchSimilarProducts({ id: productFetchId }))
      dispatch(fetchProductReviews(productFetchId))
    }
  }, [dispatch, productFetchId])

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url)
      if (selectedProduct.colors.length > 0 && !selectedColor) {
        setSelectedColor(selectedProduct.colors[0])
      }
      if (selectedProduct.sizes.length > 0 && !selectedSize) {
        setSelectedSize(selectedProduct.sizes[0])
      }
    }
  }, [selectedProduct, selectedColor, selectedSize])

  const handleQuantityChange = (action) => {
    if (action === 'plus') setQuantity((prev) => prev + 1)
    if (action === 'minus' && quantity > 1) setQuantity((prev) => prev - 1)
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Vui lòng chọn màu sắc và kích cỡ trước khi thêm vào giỏ hàng.', {
        duration: 1000
      })
      return
    }
    setIsButtonDisabled(true)
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id
      })
    ).then(() => {
      toast.success('Đã thêm sản phẩm vào giỏ hàng!', { duration: 1000 })
    }).finally(() => {
      setIsButtonDisabled(false)
    })
  }

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Vui lòng chọn màu sắc và kích cỡ trước khi Mua Ngay.', { duration: 1000 })
      return
    }

    setIsButtonDisabled(true)

    const orderItems = [{
      productId: productFetchId,
      quantity,
      size: selectedSize,
      color: selectedColor
    }]

    dispatch(
      createTemporaryOrder({
        orderItems: orderItems,
        userId: user?._id,
        guestId: guestId
      })
    )
      .unwrap()
      .then((response) => {
        // Giả định response.orderId là ID của đơn hàng tạm thời
        const tempOrderId = response.orderId

        toast.success('Đang chuyển đến trang thanh toán...', { duration: 500 })

        // Điều hướng sang trang thanh toán, truyền Order ID tạm thời
        navigate('/checkout', {
          state: {
            orderId: tempOrderId,
            isBuyNow: true
          }
        })
      })
      .catch((error) => {
        console.error('Lỗi khi tạo đơn hàng tạm thời:', error)
        toast.error(`Lỗi: ${error}`, { duration: 2000 })
      })
      .finally(() => {
        setIsButtonDisabled(false)
      })
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className='p-6'>
      { selectedProduct && (
        <div className='max-w-6xl mx-auto'>
          {/* --------------------------- PHẦN TRÊN (HÌNH ẢNH & CHI TIẾT) --------------------------- */}
          <div
            className='p-6 md:p-8 rounded-lg shadow-md flex flex-col md:flex-row gap-8 md:gap-12 items-start'
            style={{ backgroundColor: theme.palette.background.paper }}
          >

            {/* --- CỘT TRÁI: HÌNH ẢNH (Chiếm 50%) --- */}
            <div className='w-full md:w-1/2 flex h-[450px] md:h-[500px] gap-4'>

              {/* List hình nhỏ (Scroll dọc) */}
              <div className='hidden md:flex flex-col space-y-4 w-24 overflow-y-auto pr-1 custom-scrollbar'>
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Hình ${index}`}
                    className='w-full aspect-square shrink-0 object-cover rounded-lg cursor-pointer border hover:opacity-80 transition'
                    style={{
                      borderColor: mainImage === image.url ? theme.palette.primary.main : 'transparent',
                      borderWidth: mainImage === image.url ? '2px' : '1px'
                    }}
                    onClick={() => setMainImage(image.url)}
                  />
                ))}
              </div>

              {/* Hình to chính */}
              <div className='flex-1 h-full relative bg-gray-50 rounded-lg overflow-hidden'>
                <img
                  src={mainImage}
                  alt='Sản phẩm chính'
                  className='w-full h-full object-contain mix-blend-multiply'
                />
              </div>
            </div>


            {/* --- CỘT PHẢI: THÔNG TIN (Chiếm 50%) --- */}
            <div className='w-full md:w-1/2 flex flex-col'>

              <h1
                className='text-2xl md:text-3xl font-bold mb-2 leading-tight'
                style={{ color: theme.palette.text.primary }}
              >
                {selectedProduct.name}
              </h1>

              {/* Rating và Review */}
              <div className='flex items-center mb-6'>
                <div className='flex items-center mr-3'>
                  <p className='text-base font-bold mr-2 border-b border-orange-500' style={{ color: theme.palette.error.main }}>
                    {averageRating}
                  </p>
                  {renderRatingStars(Math.round(averageRating))}
                </div>
                <div className='h-4 border-l mx-3' style={{ borderColor: theme.palette.divider }}></div>
                <p className='text-sm hover:underline cursor-pointer' style={{ color: theme.palette.text.secondary }}>
                  {totalReviews} Đánh giá
                </p>
              </div>

              {/* Khu vực Giá */}
              <div className='p-4 mb-6 rounded-lg' style={{ backgroundColor: theme.palette.grey[50] }}>
                <div className='flex items-baseline gap-3'>
                  <p className='text-3xl md:text-4xl font-bold' style={{ color: theme.palette.error.main }}>
                    {selectedProduct.disCountPrice ? formatCurrency(selectedProduct.disCountPrice) : formatCurrency(selectedProduct.price)}
                  </p>
                  {selectedProduct.disCountPrice && selectedProduct.disCountPrice < selectedProduct.price && (
                    <p className='text-lg line-through' style={{ color: theme.palette.text.secondary }}>
                      {formatCurrency(selectedProduct.price)}
                    </p>
                  )}
                </div>
              </div>

              {/* Màu sắc */}
              <div className='mb-6'>
                <p className='text-sm font-medium mb-3' style={{ color: theme.palette.text.secondary }}>
        Màu sắc
                </p>
                <div className='flex gap-3 flex-wrap'>
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 rounded border text-sm font-medium transition-all ${selectedColor === color ? 'shadow-sm ring-1 ring-offset-1' : 'hover:border-gray-400'}`}
                      style={{
                        backgroundColor: selectedColor === color ? theme.palette.background.paper : 'transparent', // Giữ nền trắng cho dễ đọc
                        color: selectedColor === color ? theme.palette.primary.main : theme.palette.text.primary,
                        borderColor: selectedColor === color ? theme.palette.primary.main : theme.palette.divider
                        // outlineColor: theme.palette.primary.main // Cho ring màu
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kích cỡ */}
              <div className='mb-6'>
                <p className='text-sm font-medium mb-3' style={{ color: theme.palette.text.secondary }}>
        Kích cỡ
                </p>
                <div className='flex gap-3 flex-wrap'>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-10 flex items-center justify-center rounded border text-sm font-medium transition-all ${selectedSize === size ? 'shadow-sm' : 'hover:border-gray-400'}`}
                      style={{
                        backgroundColor: selectedSize === size ? theme.palette.primary.main : theme.palette.background.paper,
                        color: selectedSize === size ? theme.palette.primary.contrastText : theme.palette.text.primary,
                        borderColor: selectedSize === size ? theme.palette.primary.main : theme.palette.divider
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số lượng & Nút Mua (Gộp chung 1 hàng cho gọn) */}
              <div className='mt-auto'> {/* mt-auto đẩy phần này xuống đáy nếu cột bên phải ngắn hơn ảnh */}
                <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-end'>

                  {/* Input Số lượng */}
                  <div className='mr-4'>
                    <p className='text-sm font-medium mb-2' style={{ color: theme.palette.text.secondary }}>Số lượng</p>
                    <div className='flex items-center border rounded overflow-hidden h-12 w-fit' style={{ borderColor: theme.palette.divider }}>
                      <button
                        onClick={() => handleQuantityChange('minus')}
                        className='px-3 h-full hover:bg-gray-100 transition'
                        disabled={quantity <= 1}
                        style={{ color: theme.palette.text.primary }}
                      >-</button>
                      <span className='px-4 font-medium border-x h-full flex items-center justify-center min-w-[3rem]' style={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('plus')}
                        className='px-3 h-full hover:bg-gray-100 transition'
                        style={{ color: theme.palette.text.primary }}
                      >+</button>
                    </div>
                  </div>

                  {/* Các nút bấm */}
                  <div className='flex gap-3 flex-1'>
                    <button
                      onClick={handleAddToCart}
                      disabled={isButtonDisabled}
                      className='h-12 px-4 rounded flex-1 uppercase font-bold border transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md'
                      style={{
                        backgroundColor: theme.palette.action.hover, // Màu nhạt
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        opacity: isButtonDisabled ? 0.6 : 1
                      }}
                    >
                      <i className="fa-solid fa-cart-plus"></i> {/* Ví dụ icon */}
             Thêm vào giỏ
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className='h-12 px-4 rounded flex-1 uppercase font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5'
                      style={{
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.primary.contrastText
                      }}
                    >
            Mua Ngay
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* --------------------------- PHẦN DƯỚI (TABS: CHI TIẾT & ĐÁNH GIÁ) --------------------------- */}
          <div className='mt-10 p-8 rounded-lg shadow-md' style={{ backgroundColor: theme.palette.background.paper }}>
            {/* Nav Tab */}
            <div className='flex border-b mb-4' style={{ borderColor: theme.palette.divider }}>
              {['description', 'details', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize text-lg ${activeTab === tab ? 'border-b-2' : ''}`}
                  style={{
                    color: activeTab === tab ? theme.palette.primary.main : theme.palette.text.secondary,
                    borderColor: activeTab === tab ? theme.palette.primary.main : 'transparent'
                  }}
                >
                  {tab === 'description' ? 'Mô tả Sản phẩm' : tab === 'details' ? 'Chi tiết Sản phẩm' : 'Đánh giá'}
                </button>
              ))}
            </div>

            {/* Nội dung Tab */}
            <div>
              {activeTab === 'description' && (
                <div className='whitespace-pre-wrap' style={{ color: theme.palette.text.primary }}>
                  <h3 className='text-xl font-bold mb-3'>MÔ TẢ SẢN PHẨM</h3>
                  <p>{selectedProduct.description}</p>
                </div>
              )}

              {activeTab === 'details' && (
                <div style={{ color: theme.palette.text.secondary }}>
                  <h3 className='text-xl font-bold mb-3' style={{ color: theme.palette.text.primary }}>CHI TIẾT SẢN PHẨM</h3>
                  <table className='w-full text-left text-sm'>
                    <tbody>
                      <tr className='border-b' style={{ borderColor: theme.palette.divider }}>
                        <td className='py-2 w-1/3'>Danh mục</td>
                        <td className='py-2'>{selectedProduct.category}</td>
                      </tr>
                      <tr className='border-b' style={{ borderColor: theme.palette.divider }}>
                        <td className='py-2'>Thương hiệu</td>
                        <td className='py-2'>{selectedProduct.brand}</td>
                      </tr>
                      <tr className='border-b' style={{ borderColor: theme.palette.divider }}>
                        <td className='py-2'>Chất liệu</td>
                        <td className='py-2'>{selectedProduct.material}</td>
                      </tr>
                      <tr className='border-b' style={{ borderColor: theme.palette.divider }}>
                        <td className='py-2'>Kích cỡ</td>
                        <td className='py-2'>{selectedProduct.sizes.join(', ')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && <ProductReviews productId={productFetchId} />}
            </div>
          </div>

          {/* Sản phẩm gợi ý */}
          <div className='mt-20'>

            <h2 className='text-2xl text-center font-Poppins mb-2 uppercase tracking-widest'>
          Có thể bạn cũng thích
            </h2>
            <ProductGrid products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
