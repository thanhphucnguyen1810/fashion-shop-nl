import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReview, fetchAllReviewsAdmin, updateReviewStatus } from '~/redux/slices/reviewSlice'
import { toast } from 'sonner'
import { FaBan, FaCheckCircle, FaSearch, FaStar, FaTrash } from 'react-icons/fa'

export default function AdminReviews() {
  const dispatch = useDispatch()
  const { adminReviews } = useSelector((state) => state.reviews)

  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReviews = async () => {
    try {
      dispatch(fetchAllReviewsAdmin())
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi tải danh sách đánh giá')
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Lọc theo từ khóa
  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = adminReviews?.filter(
      (r) =>
        r.productId?.name?.toLowerCase().includes(term) ||
        r.user?.name?.toLowerCase().includes(term)
    )
    setFilteredReviews(filtered)
  }, [searchTerm, adminReviews])

  const handleStatusChange = async (id, newStatus) => {
    dispatch(updateReviewStatus({ id, status: newStatus }))
      .unwrap()
      .catch ((error) => {
        toast.error('Lỗi khi cập nhật trạng thái')
        console.error(error)
      })
  }

  const handleDelete = (reviewId) => {
    if (window.confirm('Bạn chắc chắn muốn xóa đánh giá này?')) {
      dispatch(deleteReview(reviewId))
        .unwrap()
        .then(() => toast.success('Đã xóa đánh giá!'))
        .catch(() => toast.error('Lỗi khi xóa đánh giá'))
    }
  }

  return (
    <div className="p-6 bg-white text-gray-800">
      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2">Danh sách đánh giá sản phẩm</h2>

      <p className="text-sm text-gray-500 mb-6">
        Dashboard / Đánh giá sản phẩm
      </p>

      {/* Search */}
      <div className="mb-5">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-11 pr-20 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">Sản phẩm</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3 text-left">Nội dung</th>
              <th className="p-3">Mức đánh giá</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày gửi</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews?.length > 0 ? (
              filteredReviews.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={r.productId?.images[0]?.url}
                      className="w-12 h-12 rounded object-cover"
                    />

                  </td>

                  <td className="p-3">
                    <p className="font-medium">{r.user?.name}</p>
                    <p className="text-xs text-gray-500">{r.user?.email}</p>
                  </td>

                  <td className="p-3 text-left max-w-xs">
                    <p className="text-sm truncate">{r.comment}</p>
                  </td>

                  <td className="p-3 flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                    <span className="text-gray-600 text-xs ml-1">
                      {r.rating}.0
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium
                        ${
                r.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : r.status === 'blocked'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-600'
                }
                      `}
                    >
                      {r.status === 'approved'
                        ? 'Duyệt'
                        : r.status === 'blocked'
                          ? 'Chặn'
                          : 'Chờ'}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">
                    {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">

                    {/* Approve */}
                    {r.status !== 'approved' && (
                      <button
                        className="p-2 rounded border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition"
                        onClick={() => handleStatusChange(r._id, 'approved')}
                      >
                        <FaCheckCircle />
                      </button>
                    )}

                    {/* Block */}
                    {r.status !== 'blocked' && (
                      <button
                        className="p-2 rounded border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                        onClick={() => handleStatusChange(r._id, 'blocked')}
                      >
                        <FaBan />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      className="p-2 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                      onClick={() => handleDelete(r._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-gray-500 italic"
                >
                  Không có đánh giá phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

