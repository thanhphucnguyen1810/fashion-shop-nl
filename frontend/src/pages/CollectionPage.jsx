import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import FilterSidebar from '~/components/Products/FilterSidebar'
import ProductGrid from '~/components/Products/ProductGrid'
import SortOptions from '~/components/Products/SortOptions'
import { fetchProducts, setFilters } from '~/redux/slices/productSlice'

const LIMIT = 12

const CollectionPage = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { products, loading, error, isFetching, pages, totalProducts } = useSelector(state => state.products)

  const sidebarRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)

  // Reset trang khi filter thay đổi
  useEffect(() => { setPage(1) }, [searchParams])

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams])
    const allFilters = { ...queryParams, page, limit: LIMIT }
    dispatch(setFilters(allFilters))
    dispatch(fetchProducts(allFilters))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [dispatch, searchParams, page])

  // Đóng sidebar khi click ngoài (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleSidebar = useCallback(() => setIsSidebarOpen(p => !p), [])

  // Tạo danh sách trang cho phân trang thông minh
  const pageNumbers = useMemo(() => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', pages]
    if (page >= pages - 3) return [1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages]
    return [1, '...', page - 1, page, page + 1, '...', pages]
  }, [pages, page])

  const activeFiltersCount = useMemo(() => {
    const params = Object.fromEntries([...searchParams])
    return Object.keys(params).filter(k => !['sortBy', 'page'].includes(k) && params[k]).length
  }, [searchParams])

  const startItem = (page - 1) * LIMIT + 1
  const endItem = Math.min(page * LIMIT, totalProducts)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bộ Sưu Tập</h1>
              {totalProducts > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Hiển thị {startItem}–{endItem} trong {totalProducts} sản phẩm
                </p>
              )}
            </div>
            <SortOptions />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">

          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all font-semibold"
            >
              <FaFilter className="w-4 h-4" />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Mobile Sidebar Drawer */}
          <div
            ref={sidebarRef}
            className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h2 className="text-lg font-bold">Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              error={error}
              columnCount={4}
              isFetching={isFetching || loading}
            />

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-3 h-3" />
                  Prev
                </button>

                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        page === p
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
