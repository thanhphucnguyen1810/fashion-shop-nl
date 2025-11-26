/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import palette from '~/theme/palette'
import axios from 'axios'

// Component NewArrivals
const NewArrivals = () => {
  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ'
    // Sử dụng Intl.NumberFormat để định dạng số theo chuẩn Việt Nam (dùng dấu chấm)
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
  }
  const theme = useTheme()
  const mode = theme.palette.mode
  const colors = palette[mode]

  // Lấy màu sắc từ theme (Tập trung vào Primary và Error)
  const PRIMARY_COLOR = theme.palette.primary.main // Màu chủ đạo (Xanh, dùng cho NEW)
  const ERROR_COLOR = theme.palette.error.main // Màu đỏ (Dùng cho giá Sale)

  // Logic giữ nguyên
  const [newArrivals, setNewArrivals] = useState([])
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/new-arrivals`)
        setNewArrivals(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchNewArrivals()
  }, [])

  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX)
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -300 : 300
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const updateScrollButtons = () => {
    const container = scrollRef.current
    if (container) {
      const leftScroll = container.scrollLeft
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth

      setCanScrollLeft(leftScroll > 0)
      setCanScrollRight(rightScrollable)
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      updateScrollButtons()
      return () => {
        container.removeEventListener('scroll', updateScrollButtons)
      }
    }
  }, [newArrivals])

  // Hàm render Rating Stars
  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className='text-yellow-500 text-sm' />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className='text-yellow-500 text-sm opacity-50' />)
      } else {
        // Empty Star
        stars.push(<FaStar key={i} className='text-gray-300 text-sm' />)
      }
    }
    return <div className='flex space-x-0.5'>{stars}</div>
  }

  return (
    <section className='py-12 px-4 lg:px-0' style={{ backgroundColor: theme.palette.background.default }}>
      <div className='container mx-auto text-center mb-10 relative'>
        <h2 className='text-4xl font-Poppins mb-2 uppercase tracking-widest' style={{ color: colors.text }}>
          SẢN PHẨM MỚI
        </h2>
        <p className='text-md mb-8 max-w-2xl mx-auto font-Poppins italic' style={{ color: colors.mutedText }}>
        Chất lượng vượt thời gian, thiết kế mới nhất.
        </p>

        {/* Scroll Buttons - Đơn giản hóa kiểu dáng */}
        <div className='absolute right-0 bottom-[30px] flex space-x-2'>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className='p-2 rounded-full border transition-all duration-300'
            style={{
              backgroundColor: canScrollLeft ? theme.palette.background.paper : theme.palette.grey[200],
              color: PRIMARY_COLOR,
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              borderColor: theme.palette.divider
            }}
          >
            <FiChevronLeft className='text-xl' />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className='p-2 rounded-full border transition-all duration-300'
            style={{
              backgroundColor: canScrollRight ? theme.palette.background.paper : theme.palette.grey[200],
              color: PRIMARY_COLOR,
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              borderColor: theme.palette.divider
            }}
          >
            <FiChevronRight className='text-xl' />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-8 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className='min-w-full sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[20%] relative cursor-pointer group overflow-hidden transition-all duration-300' // Bỏ rounded-xl để ảnh có thể full width
            style={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
            }}
          >
            <Link to={`/products/${product._id}`} className='block'>
              {/* Hình ảnh */}
              <img
                src={product.images && product.images.length > 0 ? product.images[0].url : 'placeholder_image_url'}
                alt={product.name}
                className='w-full h-[350px] object-contain transition-transform duration-500 group-hover:scale-105'
                draggable='false'
              />

              {/*TAGS (Chỉ hiển thị NEW & SALE) */}
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

              <div
                className='p-4 text-left transition-all duration-300'
                style={{
                  backgroundColor: 'transparent',
                  color: theme.palette.text.primary
                }}
              >
                <div className='flex items-center mb-1'>
                  {renderRatingStars(product.rating)}
                  <span className='ml-2 text-xs' style={{ color: colors.mutedText }}>
                        ({product.numReviews || 0} Đánh giá)
                  </span>
                </div>
                {/* Tên Sản phẩm */}
                <h4 className='font-normal text-lg mb-1 line-clamp-1 tracking-wide'>
                  {product.name}
                </h4>

                {/* Hiển thị Giá */}
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
                  <p className='text-lg font-bold'>
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals
