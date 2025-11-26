import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { FaArrowUp } from 'react-icons/fa'

import palette from '~/theme/palette'
import Hero from '~/components/Layouts/Hero'
import FeaturedCollection from '~/components/Products/FeaturedCollection'
import FeaturedSection from '~/components/Products/FeaturedSection'
import GenderCollectionSection from '~/components/Products/GenderCollectionSection'
import NewArrivals from '~/components/Products/NewArrivals'
import ProductDetails from '~/components/Products/ProductDetails'
import ProductGrid from '~/components/Products/ProductGrid'
import CategoryMenu from '~/components/CategoryMenu'
import { fetchProducts } from '~/redux/slices/productSlice'

const Home = () => {
  const theme = useTheme()
  const mode = theme.palette.mode
  const colors = palette[mode]
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state.products)
  const [bestSellerProduct, setBestSellerProduct] = useState(null)

  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    //Fetch products for a specific collection
    dispatch(
      fetchProducts({
        gender: 'Women',
        category: 'Bottom Wear',
        limit: 8
      })
    )

    // fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/best-seller`
        )
        setBestSellerProduct(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBestSeller()
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true) // Hiện nút khi cuộn xuống quá 300px
      } else {
        setShowScrollButton(false) // Ẩn nút khi ở trên đầu
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup function để gỡ bỏ sự kiện khi component unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dispatch])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div style={{ backgroundColor: theme.palette.background.default }}>
      <CategoryMenu />
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Sản phẩm bán chạy */}
      <h2 className='pt-12 text-4xl font-Poppins mb-2 text-center uppercase tracking-widest' style={{ color: colors.text }}>
        Sản phẩm bán chạy
      </h2>
      <p className='text-md mb-8 max-w-3xl mx-auto font-Poppins italic' style={{ color: colors.mutedText }}>
    Cập nhật ngay các sản phẩm bán chạy, được cộng đồng săn đón và dẫn đầu mọi xu hướng.
      </p>
      {bestSellerProduct ? (
        <div className='container mx-auto'>
          <ProductGrid
            products={bestSellerProduct}
            loading={false}
            error={error}
            columnCount={4}
          />
        </div>
      ) : (
        <p className='text-center'>Loading best seller products ... </p>
      )}

      <FeaturedCollection />
      <FeaturedSection />

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 group"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}
    </div>
  )
}

export default Home
