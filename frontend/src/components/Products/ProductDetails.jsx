import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProductGrid from './ProductGrid'
import { useTheme } from '@mui/material/styles'

const selectedProduct = {
  name: 'Áo khoác thời trang',
  price: 120,
  originalPrice: 150,
  description: 'Đây là một chiếc áo khoác thời trang với thiết kế đẹp và chất lượng cao.',
  brand: 'FashionBrand',
  material: 'Da',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['Black', 'White', 'Red', 'Blue', 'Green'],
  images: Array.from({ length: 5 }, (_, i) => ({
    url: `https://picsum.photos/500/500?random=${i + 1}`,
    altText: `Áo khoác thời trang ${i + 1}`
  }))
}

const similarProducts = [
  {
    _id: 1,
    name: 'Áo khoác thời trang',
    price: 120,
    images: [{ url: 'https://picsum.photos/500/500?random=1', altText: 'Áo khoác thời trang' }]
  },
  {
    _id: 2,
    name: 'Áo khoác phong cách',
    price: 80,
    images: [{ url: 'https://picsum.photos/500/500?random=2', altText: 'Áo khoác phong cách' }]
  },
  {
    _id: 3,
    name: 'Áo khoác da cao cấp',
    price: 150,
    images: [{ url: 'https://picsum.photos/500/500?random=3', altText: 'Áo khoác da cao cấp' }]
  },
  {
    _id: 4,
    name: 'Áo khoác đơn giản',
    price: 100,
    images: [{ url: 'https://picsum.photos/500/500?random=4', altText: 'Áo khoác đơn giản' }]
  }
]

const ProductDetails = () => {
  const theme = useTheme()
  const [mainImage, setMainImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url)
    }
  }, [selectedProduct])

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
    // Giả lập quá trình thêm vào giỏ hàng mất 500ms
    setTimeout(() => {
      toast.success('Sản phẩm đã được thêm vào giỏ hàng.', {
        duration: 1000
      })
      setIsButtonDisabled(false)
    }, 500)
  }

  return (
    <div className='p-6'>
      <div
        className='max-w-6xl mx-auto p-8 rounded-lg transition-colors duration-300'
        style={{ backgroundColor: theme.palette.mode === 'dark' }}
      >
        <div className='flex flex-col md:flex-row'>
          {/* Hình nhỏ bên trái */}
          <div className='hidden md:flex flex-col space-y-4 mr-6'>
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Hình ${index}`}
                className='w-20 h-20 object-cover rounded-lg cursor-pointer border'
                style={{
                  borderColor:
                    mainImage === image.url
                      ? theme.palette.primary.main
                      : theme.palette.divider
                }}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Hình chính */}
          <div className='md:w-1/2'>
            <div className='mb-4'>
              <img
                src={mainImage}
                alt='Sản phẩm chính'
                className='w-full h-auto object-cover rounded-lg'
              />
            </div>
          </div>

          {/* Thumbnail trên mobile */}
          <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4'>
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Hình ${index}`}
                className='w-20 h-20 object-cover rounded-lg cursor-pointer border'
                style={{
                  borderColor:
                    mainImage === image.url
                      ? theme.palette.primary.main
                      : theme.palette.divider
                }}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Thông tin sản phẩm */}
          <div className='md:w-1/2 md:ml-10'>
            <h1
              className='text-2xl md:text-3xl font-semibold mb-2'
              style={{ color: theme.palette.text.primary }}
            >
              {selectedProduct.name}
            </h1>

            <p
              className='text-lg line-through mb-1'
              style={{ color: theme.palette.text.secondary }}
            >
              {selectedProduct.originalPrice &&
                `${selectedProduct.originalPrice.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'USD'
                })}`}
            </p>

            <p className='text-xl mb-2' style={{ color: theme.palette.text.primary }}>
              {selectedProduct.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>

            <p className='mb-4' style={{ color: theme.palette.text.secondary }}>
              {selectedProduct.description}
            </p>

            {/* Màu sắc */}
            <div className='mb-4'>
              <p className='text-sm' style={{ color: theme.palette.text.primary }}>
                Màu sắc:
              </p>
              <div className='flex gap-2 mt-2'>
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className='w-8 h-8 rounded-full'
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: 'brightness(0.5)',
                      border:
                        selectedColor === color
                          ? `3px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.divider}`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Kích cỡ */}
            <div className='mb-4'>
              <p className='text-sm' style={{ color: theme.palette.text.primary }}>
                Kích cỡ:
              </p>
              <div className='flex gap-2 mt-2'>
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className='px-4 py-2 rounded border'
                    style={{
                      backgroundColor:
                        selectedSize === size ? theme.palette.primary.main : 'transparent',
                      color:
                        selectedSize === size
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className='mb-6'>
              <p className='text-sm' style={{ color: theme.palette.text.primary }}>
                Số lượng:
              </p>
              <div className='flex items-center space-x-4 mt-2'>
                <button
                  onClick={() => handleQuantityChange('minus')}
                  className='px-2 py-1 rounded text-lg'
                  style={{
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.text.primary
                  }}
                >
                  -
                </button>
                <span className='text-lg' style={{ color: theme.palette.text.primary }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('plus')}
                  className='px-2 py-1 rounded text-lg'
                  style={{
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.text.primary
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className='py-2 px-6 rounded w-full uppercase transition-colors duration-300'
              style={{
                backgroundColor: isButtonDisabled
                  ? theme.palette.action.disabledBackground
                  : theme.palette.primary.main,
                color: isButtonDisabled
                  ? theme.palette.action.disabled
                  : theme.palette.primary.contrastText,
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled ? 0.5 : 1
              }}
            >
              {isButtonDisabled ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>

            {/* Thông tin chi tiết */}
            <div className='mt-10' style={{ color: theme.palette.text.secondary }}>
              <h3 className='text-xl font-bold mb-4'>Đặc điểm sản phẩm:</h3>
              <table className='w-full text-left text-sm'>
                <tbody>
                  <tr>
                    <td className='py-1'>Thương hiệu</td>
                    <td className='py-1'>{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className='py-1'>Chất liệu</td>
                    <td className='py-1'>{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sản phẩm gợi ý */}
        <div className='mt-20'>
          <h2
            className='text-2xl text-center font-medium mb-4'
            style={{ color: theme.palette.text.primary }}
          >
            Có thể bạn cũng thích
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
