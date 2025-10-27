import { useTheme } from '@mui/material/styles'
import Hero from '~/components/Layouts/Hero'
import FeaturedCollection from '~/components/Products/FeaturedCollection'
import FeaturedSection from '~/components/Products/FeaturedSection'
import GenderCollectionSection from '~/components/Products/GenderCollectionSection'
import NewArrivals from '~/components/Products/NewArrivals'
import ProductDetails from '~/components/Products/ProductDetails'
import ProductGrid from '~/components/Products/ProductGrid'

const placeholderProducts = [
  {
    _id: 1,
    name: 'Áo khoác thời trang',
    price: 120,
    images: [
      { url: 'https://picsum.photos/500/500?random=1', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 2,
    name: 'Áo khoác thời trang',
    price: 80,
    images: [
      { url: 'https://picsum.photos/500/500?random=2', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 3,
    name: 'Áo khoác thời trang',
    price: 150,
    images: [
      { url: 'https://picsum.photos/500/500?random=3', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 4,
    name: 'Áo khoác thời trang',
    price: 100,
    images: [
      { url: 'https://picsum.photos/500/500?random=4', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 5,
    name: 'Áo khoác thời trang',
    price: 120,
    images: [
      { url: 'https://picsum.photos/500/500?random=5', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 6,
    name: 'Áo khoác thời trang',
    price: 80,
    images: [
      { url: 'https://picsum.photos/500/500?random=6', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 7,
    name: 'Áo khoác thời trang',
    price: 150,
    images: [
      { url: 'https://picsum.photos/500/500?random=7', altText: 'Áo khoác thời trang' }
    ]
  },
  {
    _id: 8,
    name: 'Áo khoác thời trang',
    price: 100,
    images: [
      { url: 'https://picsum.photos/500/500?random=8', altText: 'Áo khoác thời trang' }
    ]
  }
]

const Home = () => {
  const theme = useTheme()
  return (
    <div style={{ backgroundColor: theme.palette.background.default }}>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Sản phẩm bán chạy */}
      <h2
        className="text-3xl text-center font-bold mb-4"
        style={{ color: theme.palette.text.primary }}
      >
        Sản phẩm bán chạy
      </h2>
      <ProductDetails />

      <div className="container mx-auto">
        <h2
          className="text-3xl text-center font-bold mb-4"
          style={{ color: theme.palette.text.primary }}
        >
          Thời trang nữ nổi bật
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>

      <FeaturedCollection />
      <FeaturedSection />
    </div>
  )
}

export default Home
