import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { FaFilter } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import FilterSidebar from '~/components/Products/FilterSidebar'
import ProductGrid from '~/components/Products/ProductGrid'
import SortOptions from '~/components/Products/SortOptions'
import { fetchProducts, setFilters } from '~/redux/slices/productSlice'

const CollectionPage = () => {
  const { collections } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  // Lấy filters từ Redux để sử dụng (tùy chọn)
  const { products, loading, error, filters } = useSelector((state) => state.products)
  const sidebarRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Gộp tất cả logic tải dữ liệu và đồng bộ trạng thái vào một useEffect
  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams])

    // 1. Cập nhật Redux state filters từ URL
    // Mục tiêu là set tất cả bộ lọc (bao gồm search) lên Redux
    // và đảm bảo 'collection' từ route cũng được đưa vào Redux filters
    const allFilters = {
      ...queryParams,
      collection: collections || ''
    }

    // Dispatch action để cập nhật Redux filters state
    dispatch(setFilters(allFilters))

    // 2. Gọi API fetchProducts với tất cả các bộ lọc đã được đồng bộ
    dispatch(fetchProducts(allFilters))

  }, [dispatch, collections, searchParams])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        } fixed top-10 left-0 bottom-0 z-10 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out overflow-y-auto lg:static lg:translate-x-0
          lg:h-auto lg:mt-0 lg:pt-0 
          pt-16`}
      >
        <FilterSidebar />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 p-4 space-y-4">
        {filters.search && (
          <p className="text-sm text-gray-500">
                  Đang tìm kiếm theo từ khóa: "{filters.search}"
          </p>
        )}

        <SortOptions />

        <ProductGrid products={products} loading={loading} error={error} columnCount={4} />
      </div>
    </div>
  )
}

export default CollectionPage
