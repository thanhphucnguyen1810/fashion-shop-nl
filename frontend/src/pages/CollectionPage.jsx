import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from '~/components/Products/FilterSidebar'
import ProductGrid from '~/components/Products/ProductGrid'
import SortOptions from '~/components/Products/SortOptions'

const CollectionPage = () => {
  const [products, setProducts] = useState([])
  const sidebarRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { collection, gender, category } = useParams()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          _id: 1,
          name: 'Áo khoác thời trang',
          price: 120,
          images: [{ url: 'https://picsum.photos/500/500?random=1', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 2,
          name: 'Áo khoác thời trang',
          price: 80,
          images: [{ url: 'https://picsum.photos/500/500?random=2', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 3,
          name: 'Áo khoác thời trang',
          price: 150,
          images: [{ url: 'https://picsum.photos/500/500?random=3', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 4,
          name: 'Áo khoác thời trang',
          price: 100,
          images: [{ url: 'https://picsum.photos/500/500?random=4', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 5,
          name: 'Áo khoác thời trang',
          price: 120,
          images: [{ url: 'https://picsum.photos/500/500?random=5', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 6,
          name: 'Áo khoác thời trang',
          price: 80,
          images: [{ url: 'https://picsum.photos/500/500?random=6', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 7,
          name: 'Áo khoác thời trang',
          price: 150,
          images: [{ url: 'https://picsum.photos/500/500?random=7', altText: 'Áo khoác thời trang' }]
        },
        {
          _id: 8,
          name: 'Áo khoác thời trang',
          price: 100,
          images: [{ url: 'https://picsum.photos/500/500?random=8', altText: 'Áo khoác thời trang' }]
        }
      ]

      let filtered = fetchedProducts
      // if (collection) {
      //   filtered = fetchedProducts.filter((p) => p.collection === collection)
      // } else if (gender && category) {
      //   filtered = fetchedProducts.filter((p) => p.gender === gender && p.category === category)
      // }

      setProducts(filtered)
    }, 1000)
  }, [collection, gender, category])

  const getTitle = () => {
    if (collection) return collection.replace('-', ' ').toUpperCase()
    if (gender && category) return `${gender} / ${category}`.replace('-', ' ').toUpperCase()
    return 'BỘ SƯU TẬP'
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Nút mở sidebar (mobile) */}
      <div className="p-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 py-2 border rounded-md shadow hover:bg-gray-100 transition"
        >
          <FaFilter />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 space-y-4">
        <h2 className="text-3xl font-semibold uppercase">{getTitle()}</h2>

        <SortOptions />

        <ProductGrid products={products} />
      </div>
    </div>
  )
}

export default CollectionPage
