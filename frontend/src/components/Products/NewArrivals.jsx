import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import palette from '~/theme/palette'

const NewArrivals = () => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const colors = palette[mode]

  const newArrivals = [
    {
      _id: '1',
      name: 'Stylish Jacket',
      price: 120,
      images: [
      // Sử dụng ID 237, 238, 239
        { url: 'https://picsum.photos/id/237/500/500', altText: 'Stylish Jacket - View 1' },
        { url: 'https://picsum.photos/id/238/500/500', altText: 'Stylish Jacket - View 2' },
        { url: 'https://picsum.photos/id/239/500/500', altText: 'Stylish Jacket - View 3' }
      ]
    },
    {
      _id: '2',
      name: 'Stylish Shirt',
      price: 120,
      images: [
      // Sử dụng ID 240, 241, 242
        { url: 'https://picsum.photos/id/240/500/500', altText: 'Stylish Shirt - View 1' },
        { url: 'https://picsum.photos/id/241/500/500', altText: 'Stylish Shirt - View 2' },
        { url: 'https://picsum.photos/id/242/500/500', altText: 'Stylish Shirt - View 3' }
      ]
    },
    {
      _id: '3',
      name: 'Stylish Pants',
      price: 120,
      images: [
      // Sử dụng ID 243, 244, 245
        { url: 'https://picsum.photos/id/243/500/500', altText: 'Stylish Pants - View 1' },
        { url: 'https://picsum.photos/id/244/500/500', altText: 'Stylish Pants - View 2' },
        { url: 'https://picsum.photos/id/245/500/500', altText: 'Stylish Pants - View 3' }
      ]
    },
    {
      _id: '4',
      name: 'Stylish Dress',
      price: 120,
      images: [
      // Sử dụng ID 246, 247, 248
        { url: 'https://picsum.photos/id/246/500/500', altText: 'Stylish Dress - View 1' },
        { url: 'https://picsum.photos/id/247/500/500', altText: 'Stylish Dress - View 2' },
        { url: 'https://picsum.photos/id/248/500/500', altText: 'Stylish Dress - View 3' }
      ]
    },
    {
      _id: '5',
      name: 'Stylish Sweater',
      price: 120,
      images: [
      // Sử dụng ID 249, 250, 251
        { url: 'https://picsum.photos/id/249/500/500', altText: 'Stylish Sweater - View 1' },
        { url: 'https://picsum.photos/id/250/500/500', altText: 'Stylish Sweater - View 2' },
        { url: 'https://picsum.photos/id/251/500/500', altText: 'Stylish Sweater - View 3' }
      ]
    },
    {
      _id: '6',
      name: 'Stylish Top A',
      price: 120,
      images: [
      // Sử dụng ID 252, 253, 254
        { url: 'https://picsum.photos/id/252/500/500', altText: 'Stylish Top A - View 1' },
        { url: 'https://picsum.photos/id/253/500/500', altText: 'Stylish Top A - View 2' },
        { url: 'https://picsum.photos/id/254/500/500', altText: 'Stylish Top A - View 3' }
      ]
    },
    {
      _id: '7',
      name: 'Stylish Top B',
      price: 120,
      images: [
      // Sử dụng ID 255, 256, 257
        { url: 'https://picsum.photos/id/255/500/500', altText: 'Stylish Top B - View 1' },
        { url: 'https://picsum.photos/id/256/500/500', altText: 'Stylish Top B - View 2' },
        { url: 'https://picsum.photos/id/257/500/500', altText: 'Stylish Top B - View 3' }
      ]
    },
    {
      _id: '8',
      name: 'Stylish Top C',
      price: 120,
      images: [
      // Sử dụng ID 258, 259, 260
        { url: 'https://picsum.photos/id/258/500/500', altText: 'Stylish Top C - View 1' },
        { url: 'https://picsum.photos/id/259/500/500', altText: 'Stylish Top C - View 2' },
        { url: 'https://picsum.photos/id/260/500/500', altText: 'Stylish Top C - View 3' }
      ]
    }
  ]

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
  }, [])

  return (
    <section className='py-16 px-4 lg:px-0' style={{ backgroundColor: colors.background }}>
      <div className='container mx-auto text-center mb-10 relative'>
        <h2 className='text-3xl font-bold mb-4' style={{ color: colors.text }}>
          Khám Phá Bộ Sưu Tập Mới
        </h2>
        <p className='text-lg mb-8' style={{ color: colors.mutedText }}>
        Cập nhật xu hướng mới nhất với những thiết kế vừa ra mắt, giúp bạn luôn nổi bật và sành điệu mỗi ngày.
        </p>

        {/* Scroll Buttons */}
        <div className='absolute right-0 bottom-[30px] flex space-x-2'>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className='p-2 rounded border'
            style={{
              backgroundColor: canScrollLeft ? colors.background : colors.border,
              color: canScrollLeft ? colors.text : colors.mutedText,
              cursor: canScrollLeft ? 'pointer' : 'not-allowed',
              borderColor: colors.border
            }}
          >
            <FiChevronLeft className='text-2xl' />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className='p-2 rounded border'
            style={{
              backgroundColor: canScrollRight ? colors.background : colors.border,
              color: canScrollRight ? colors.text : colors.mutedText,
              cursor: canScrollRight ? 'pointer' : 'not-allowed',
              borderColor: colors.border
            }}
          >
            <FiChevronRight className='text-2xl' />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div key={product._id} className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'>
            <img
              src={product.images[0].url}
              alt={product.images[0]?.altText || product.name}
              className='w-full h-[500px] object-cover rounded-lg'
              draggable='false'
            />
            <div
              className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md p-4 rounded-b-lg'
              style={{ backgroundColor: `${colors.background}cc`, color: colors.text }}
            >
              <Link to={`/product/${product._id}`} className='block'>
                <h4 className='font-medium'>{product.name}</h4>
                <p className='mt-1'>${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals
