import React, { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCategories } from '~/redux/slices/categorySlice'

const BACKGROUND_COLOR = '#EBF5FF'
const TEXT_COLOR = '#1E293B'
const FALLBACK_ICON_URL = 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default-category-icon.png'

const CategoryMenu = memo(() => {
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
    <div className="py-2" style={{ backgroundColor: BACKGROUND_COLOR }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/collections?category=${category.slug}`}
              className="group w-20 sm:w-28 flex flex-col items-center p-1 rounded-lg transition duration-300 hover:scale-[1.03] cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-lg transition-all duration-300 mb-2">
                <img
                  src={category.image?.url || FALLBACK_ICON_URL}
                  alt={category.name}
                  className="w-full h-full object-cover p-2"
                  onError={(e) => { e.currentTarget.src = FALLBACK_ICON_URL }}
                />
              </div>
              <span className="text-[13px] font-Poppins text-center leading-tight" style={{ color: '#' + TEXT_COLOR }}>
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
})

export default CategoryMenu
