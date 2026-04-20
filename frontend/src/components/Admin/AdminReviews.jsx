import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReview, fetchAllReviewsAdmin, updateReviewStatus } from '~/redux/slices/admin/adminReviewSlice'
import { toast } from 'sonner'
import { FaBan, FaCheckCircle, FaSearch, FaStar, FaTrash } from 'react-icons/fa'

export default function AdminReviews() {
  const dispatch = useDispatch()
  const { adminReviews, loading, page, pages, total } = useSelector((state) => state.reviews)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchAllReviewsAdmin({ page: currentPage, search: searchTerm }))
  }, [currentPage, dispatch, searchTerm])


  const handleSearch = () => {
    setCurrentPage(1)
    dispatch(fetchAllReviewsAdmin({ page: 1, search: searchTerm }))
  }

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
      <h2 className="text-2xl font-semibold mb-2">Danh sách đánh giá sản phẩm</h2>
      <p className="text-sm text-gray-500 mb-6">Dashboard / Đánh giá sản phẩm</p>

      {/* Search */}
      <div className="mb-5 flex gap-2">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc khách hàng..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full py-2.5 pl-11 pr-4 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
        >
          Tìm
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="p-3 text-left">Sản phẩm</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3 text-left">Nội dung</th>
              <th className="p-3">Đánh giá</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày gửi</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="py-6 text-center text-gray-400">Đang tải...</td></tr>
            ) : adminReviews?.length > 0 ? (
              adminReviews.map(r => (
                <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={r.product?.images?.[0]?.url} className="w-12 h-12 rounded object-cover" />
                      <span className="text-xs font-medium">{r.product?.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{r.user?.name}</p>
                    <p className="text-xs text-gray-500">{r.user?.email}</p>
                  </td>
                  <td className="p-3 text-left max-w-xs">
                    <p className="text-sm truncate">{r.comment}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-xs" />
                      ))}
                      <span className="text-gray-600 text-xs ml-1">{r.rating}.0</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700'
                        : r.status === 'blocked' ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-600'
                    }`}>
                      {r.status === 'approved' ? 'Duyệt' : r.status === 'blocked' ? 'Chặn' : 'Chờ'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      {r.status !== 'approved' && (
                        <button
                          className="p-2 rounded border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition"
                          onClick={() => handleStatusChange(r._id, 'approved')}
                        ><FaCheckCircle /></button>
                      )}
                      {r.status !== 'blocked' && (
                        <button
                          className="p-2 rounded border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                          onClick={() => handleStatusChange(r._id, 'blocked')}
                        ><FaBan /></button>
                      )}
                      <button
                        className="p-2 rounded border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition"
                        onClick={() => handleDelete(r._id)}
                      ><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                  Không có đánh giá phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Tổng: {total} đánh giá</p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
            >‹ Trước</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded text-sm ${
                  p === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, pages))}
              disabled={page >= pages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
            >Sau ›</button>
          </div>
        </div>
      )}
    </div>
  )
}

