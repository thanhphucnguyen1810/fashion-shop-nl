import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCategories } from '~/redux/slices/categorySlice'

const BACKGROUND_COLOR = '#D0D1D9'
const TEXT_COLOR = '0F4C81'
const FALLBACK_ICON_URL = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-category-icon.png'

const CategoryMenu = () => {
  const dispatch = useDispatch()
  const { items: categories, loading, error } = useSelector((state) => state.categories)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  if (loading && categories.length === 0) {
    return <div className="p-4 text-gray-500 text-sm max-w-7xl mx-auto">Đang tải danh mục...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500 text-sm max-w-7xl mx-auto">Lỗi tải danh mục.</div>
  }

  return (
    <div className="py-3" style={{ backgroundColor: BACKGROUND_COLOR }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/collections?category=${category.slug}`}
              className="group block text-center p-2 rounded-lg transition duration-300 transform hover:scale-[1.03] hover:shadow-md cursor-pointer"
              style={{ backgroundColor: '#FFFFFF', color: TEXT_COLOR }}
            >
              {/* KHỐI ẢNH ĐẠI DIỆN */}
              <div className="flex justify-center items-center h-20 w-full mb-2">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-200 shadow-sm group hover:shadow-lg transition-all duration-300">
                  <img
                    src={category.image?.url || FALLBACK_ICON_URL}
                    alt={category.name}
                    className="w-full h-full object-contain p-2 transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_ICON_URL
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-300"></div>
                </div>

              </div>
              {/* TÊN DANH MỤC */}
              <span className="text-sm md:text-base font-Poppins font-semibold transition duration-150 group-hover:text-blue-700" style={{ color: TEXT_COLOR }}>
                {category.name}
              </span>
            </Link>
          ))}

          {categories.length === 0 && !loading && (
            <span className="text-sm text-gray-400 col-span-full text-center">Không có danh mục nào.</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryMenu
