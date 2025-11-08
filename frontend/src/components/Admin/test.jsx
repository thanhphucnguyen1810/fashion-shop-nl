import React, { useEffect, useState } from 'react'
import { FaStar, FaTrash, FaCheckCircle, FaBan, FaSearch } from 'react-icons/fa'
import { useTheme, alpha } from '@mui/material/styles'

export default function AdminReviews() {
  const theme = useTheme()
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Fake data mẫu
  useEffect(() => {
    const fakeData = [
      {
        _id: '1',
        product: {
          name: 'Áo sơ mi nam trắng',
          images: ['https://picsum.photos/100/100?random=1']
        },
        user: { name: 'Nguyễn Văn A' },
        rating: 5,
        status: 'approved',
        createdAt: new Date('2025-10-12')
      },
      {
        _id: '2',
        product: {
          name: 'Quần jean nữ xanh',
          images: ['https://picsum.photos/100/100?random=2']
        },
        user: { name: 'Trần Thị B' },
        rating: 3,
        status: 'pending',
        createdAt: new Date('2025-11-01')
      },
      {
        _id: '3',
        product: {
          name: 'Giày sneaker thể thao',
          images: ['https://picsum.photos/100/100?random=3']
        },
        user: { name: 'Lê Văn C' },
        rating: 4,
        status: 'blocked',
        createdAt: new Date('2025-10-30')
      }
    ]
    setReviews(fakeData)
    setFilteredReviews(fakeData)
  }, [])

  // Lọc danh sách khi người dùng gõ vào ô tìm kiếm
  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = reviews.filter(
      (r) =>
        r.product?.name?.toLowerCase().includes(term) ||
        r.user?.name?.toLowerCase().includes(term)
    )
    setFilteredReviews(filtered)
  }, [searchTerm, reviews])

  // Đổi trạng thái (fake)
  const handleStatusChange = (id, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    )
  }

  // Xóa đánh giá (fake)
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này không?')) {
      setReviews((prev) => prev.filter((r) => r._id !== id))
    }
  }

  return (
    <div className="p-6" style={{ color: theme.palette.text.primary }}>
      <h2 className="text-2xl font-bold mb-4">Danh sách đánh giá sản phẩm</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm hoặc khách hàng ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-11 pr-24 text-sm rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border border-gray-300"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <button
            onClick={() => console.log('Tìm:', searchTerm)}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Bảng hiển thị đánh giá */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table
          className="w-full text-sm text-left"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          <thead
            className="uppercase"
            style={{ backgroundColor: alpha(theme.palette.grey[500], 0.2) }}
          >
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Mức đánh giá</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Ngày gửi</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={r.product?.images?.[0]}
                      alt={r.product?.name}
                      className="w-10 h-10 rounded object-cover border"
                    />
                    <span>{r.product?.name}</span>
                  </td>
                  <td className="p-3">{r.user?.name}</td>
                  <td className="p-3 flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        r.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : r.status === 'blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.status === 'approved'
                        ? 'Đã duyệt'
                        : r.status === 'blocked'
                          ? 'Chặn hiển thị'
                          : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    {r.status !== 'approved' && (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleStatusChange(r._id, 'approved')}
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    {r.status !== 'blocked' && (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleStatusChange(r._id, 'blocked')}
                      >
                        <FaBan />
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
                  className="text-center py-6 text-gray-500 italic"
                >
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
