/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar, FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import palette from '~/theme/palette'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { addFavorite, removeFavorite } from '~/redux/slices/authSlice'

const FAVORITE_COLOR = '#ff4d4f'

const NewArrivals = () => {
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0đ'
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ'
  }
  const theme = useTheme()
  const mode = theme.palette.mode
  const colors = palette[mode]

  const PRIMARY_COLOR = theme.palette.primary.main
  const ERROR_COLOR = theme.palette.error.main

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

  const dispatch = useDispatch()
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const user = useSelector((state) => state.auth.user)
  const favoriteProductIds = user?.favorites || []
  const isLoggedIn = !!user


  const handleMouseDown = (e) => {
    setIsDragging(true)
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  const scroll = (direction) => {
    const scrollAmount = direction === 'left' ? -350 : 350
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const updateScrollButtons = () => {
    const container = scrollRef.current
    if (container) {
      const leftScroll = container.scrollLeft
      const isScrolledToRight = container.scrollWidth - container.clientWidth - leftScroll < 1

      setCanScrollLeft(leftScroll > 0)
      setCanScrollRight(!isScrolledToRight)
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)
      updateScrollButtons()
      return () => {
        container.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [newArrivals])

  // Hàm render Rating Stars
  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 0)
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

  const handleToggleFavorite = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm sản phẩm yêu thích.')
      // Chuyển hướng đến trang login nếu cần
      // navigate('/login')
      return
    }

    const isCurrentlyFavorite = favoriteProductIds.includes(productId)

    if (isCurrentlyFavorite) {
      dispatch(removeFavorite(productId))
    } else {
      dispatch(addFavorite(productId))
    }
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

        {/* Scroll Buttons */}
        <div className='absolute right-0 top-1/2 -mt-6 hidden md:flex space-x-2 z-10'>
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

      {/* Scrollable Content CONTAINER */}
      <div className='relative mx-auto container'>
        <div
          ref={scrollRef}
          className={'flex overflow-x-scroll gap-4 sm:gap-6 pb-4 cursor-grab'}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          style={{
            '--tw-bg-opacity': 1,
            scrollbarWidth: 'none',
            'msOverflowStyle': 'none'
          }}
        >
          {newArrivals.map((product) => {
            const isFavorite = favoriteProductIds.includes(product._id)
            return (
              <div
                key={product._id}
                className='relative group overflow-hidden transition-all duration-300 shrink-0 w-56 md:w-64 lg:w-72'
                style={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
                }}
              >
                <Link to={`/products/${product._id}`} className='block' style={{ textDecoration: 'none' }}>
                  <div className='flex flex-col h-full'>
                    {/* 1. Khu vực Hình ảnh & Sale Tag */}
                    <div className='w-full h-96 relative overflow-hidden'>
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0].url : 'placeholder_image_url'}
                        alt={product.name}
                        className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-105'
                        draggable='false'
                      />
                      <div className='absolute top-3 left-3 flex space-x-2'>
                        <span
                          className='px-3 py-1 text-xs font-bold tracking-widest text-white shadow-md'
                          style={{ backgroundColor: PRIMARY_COLOR }}
                        > NEW
                        </span>
                        {product.disCountPrice && product.disCountPrice < product.price && (
                          <span
                            className='px-3 py-1 text-xs font-bold tracking-widest text-white shadow-md'
                            style={{ backgroundColor: ERROR_COLOR }}
                          > SALE
                          </span>
                        )}
                      </div>

                      {/* Thêm sp yêu thích */}
                      <button
                        className='absolute top-3 right-3 p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110'
                        style={{
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          opacity: isFavorite ? 1 : 0.6
                        }}
                        onClick={(e) => handleToggleFavorite(e, product._id)}
                        aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                      >
                        <FaHeart
                          className='w-5 h-5 transition-all'
                          style={{
                            color: isFavorite ? FAVORITE_COLOR : colors.mutedText,
                            fill: isFavorite ? FAVORITE_COLOR : 'none',
                            stroke: colors.mutedText,
                            strokeWidth: isFavorite ? 0 : 30
                          }}
                        />
                      </button>
                    </div>

                  </div>

                  {/* 2. Khu vực Thông tin */}
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
                        <p className='text-lg font-bold' style={{ color: ERROR_COLOR }}>
                          {formatCurrency(product.disCountPrice)}
                        </p>
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
