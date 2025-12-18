import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const renderStars = (rating) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className="mr-1"
          color={i <= rating ? '#ffc300' : '#ddd'}
        />
      ))}
    </div>
  )
}

const ProductReviews = ({ productId }) => {
  const { reviews, loading } = useSelector((state) => state.reviews)

  const [filter, setFilter] = useState({
    hasComment: false,
    hasImage: false,
    stars: 0
  })

  const [filteredList, setFilteredList] = useState([])

  const totalReviews = reviews.length

  const average =
    totalReviews > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / totalReviews).toFixed(1)
      : 0

  const avgRounded = totalReviews > 0 ? Math.round(average) : 0

  const countStars = (num) => reviews.filter((r) => r.rating === num).length

  // Apply filters
  useEffect(() => {
    let list = [...reviews]

    if (filter.hasComment)
      list = list.filter((r) => r.comment && r.comment.trim().length > 0)

    if (filter.hasImage)
      list = list.filter((r) => r.images && r.images.length > 0)

    if (filter.stars > 0)
      list = list.filter((r) => r.rating === filter.stars)

    setFilteredList(list)
  }, [filter, reviews])

  if (loading) return <p>Đang tải đánh giá...</p>

  return (
    <div className="p-4 border rounded-lg mt-6">

      {/* Summary */}
      <h3 className="text-xl font-bold mb-4">
        ĐÁNH GIÁ ({totalReviews})
      </h3>

      <div className="flex items-center gap-6">

        <div className="text-center">
          <p className="text-4xl font-bold text-orange-500">{average}</p>
          {renderStars(avgRounded)}
          <p className="text-xs text-gray-500 mt-1">
            {totalReviews} đánh giá
          </p>
        </div>

        {/* Star bars */}
        <div className="flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="w-6 text-sm">{s}★</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div
                  className="bg-orange-400 h-2 rounded"
                  style={{
                    width: `${
                      totalReviews ? (countStars(s) / totalReviews) * 100 : 0
                    }%`
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">{countStars(s)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <h4 className="font-semibold mt-6 mb-2">Lọc đánh giá theo:</h4>

      <div className="flex flex-wrap gap-3">

        <button
          className={`px-3 py-1 border rounded ${
            filter.hasComment ? 'bg-black text-white' : ''
          }`}
          onClick={() =>
            setFilter((f) => ({ ...f, hasComment: !f.hasComment }))
          }
        >
          Có bình luận
        </button>

        <button
          className={`px-3 py-1 border rounded ${
            filter.hasImage ? 'bg-black text-white' : ''
          }`}
          onClick={() =>
            setFilter((f) => ({ ...f, hasImage: !f.hasImage }))
          }
        >
          Có hình ảnh
        </button>

        {[5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            className={`px-3 py-1 border rounded ${
              filter.stars === s ? 'bg-orange-500 text-white' : ''
            }`}
            onClick={() =>
              setFilter((f) => ({
                ...f,
                stars: f.stars === s ? 0 : s
              }))
            }
          >
            {s} <FaStar />
          </button>
        ))}
      </div>

      {/* Review list */}
      <div className="mt-6 space-y-6 max-h-[450px] overflow-y-auto pr-4">

        {filteredList.map((r) => (
          <div key={r._id} className="pb-4 border-b">

            <div className="flex items-center gap-3">
              <img
                src={r.user?.avatar?.url}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{r.user?.name}</p>
                {renderStars(r.rating)}
                <p className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <p className="mt-2 text-sm">{r.comment}</p>

            {r.images?.length > 0 && (
              <div className="flex gap-3 mt-2">
                {r.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-20 h-20 rounded object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredList.length === 0 && (
          <p className="text-center text-gray-500">
            Không có đánh giá phù hợp.
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductReviews
