import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoryError,
  clearOperationLoading // Import action mới
} from '~/redux/slices/categorySlice'
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaSearch } from 'react-icons/fa'
import { HiOutlineInformationCircle } from 'react-icons/hi'

// Component Modal tùy chỉnh để thay thế window.confirm/alert
const CustomModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Xác nhận' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm transform transition-all scale-100 ease-out duration-300 border-t-4 border-indigo-500">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <HiOutlineInformationCircle className="w-6 h-6 mr-2 text-indigo-500" /> {title}
        </h3>
        <p className="text-gray-600 mb-6 text-sm">{message}</p>
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
            >
              Hủy
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition duration-200"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


const AdminCategoryManager = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const {
    items: categories,
    loading,
    error,
    operationLoading, // Loading cho CRUD
    operationError // Lỗi cho CRUD
  } = useSelector((state) => state.categories)

  // --------------------- Trạng thái UI ---------------------
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingSlug, setEditingSlug] = useState('')
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null, message: '' })
  const [statusMessage, setStatusMessage] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')

  const [newCategoryImage, setNewCategoryImage] = useState(null)

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Xử lý khi có lỗi từ thao tác CRUD
  useEffect(() => {
    if (operationError) {
      setConfirmModal({ // Sử dụng modal để hiển thị lỗi CRUD
        isOpen: true,
        title: 'Lỗi Thao Tác',
        message: operationError,
        onConfirm: () => {
          dispatch(clearCategoryError())
          setConfirmModal({ isOpen: false, data: null, message: '' })
        },
        onCancel: null,
        confirmText: 'Đóng'
      })
    }
  }, [operationError, dispatch])


  // Xử lý khi Submit form thêm danh mục mới từ modal
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault()

    if (!newCategoryName.trim()) {
      return setConfirmModal({
        isOpen: true,
        title: 'Lỗi Nhập Liệu',
        message: 'Tên danh mục không được để trống!',
        onConfirm: () => setConfirmModal({ isOpen: false }),
        confirmText: 'OK'
      })
    }

    if (!newCategoryImage) {
      return setConfirmModal({
        isOpen: true,
        title: 'Thiếu Hình Ảnh',
        message: 'Vui lòng chọn ảnh đại diện cho danh mục.',
        onConfirm: () => setConfirmModal({ isOpen: false }),
        confirmText: 'OK'
      })
    }

    const formData = new FormData()
    formData.append('name', newCategoryName)
    formData.append('image', newCategoryImage)

    dispatch(createCategory(formData))
      .unwrap()
      .then(() => {
        setNewCategoryName('')
        setNewCategoryImage(null)
        setIsAddModalOpen(false)
        setStatusMessage({
          type: 'success',
          text: `Đã tạo danh mục "${newCategoryName}" thành công!`
        })
      })
  }


  // Xử lý Bắt đầu chỉnh sửa (khi click nút edit trên bảng)
  const handleEditStart = (category) => {
    setEditingId(category._id)
    setEditingName(category.name)
    setEditingSlug(category.slug)
  }

  // Xử lý Cập nhật danh mục (khi click "Lưu" sau chỉnh sửa)
  const handleUpdate = () => {
    if (!editingName.trim()) {
      setConfirmModal({
        isOpen: true,
        title: 'Lỗi Nhập Liệu',
        message: 'Tên danh mục không được để trống!',
        onConfirm: () => setConfirmModal({ isOpen: false }),
        onCancel: null,
        confirmText: 'OK'
      })
      return
    }

    dispatch(updateCategory({ id: editingId, name: editingName }))
      .unwrap()
      .then(() => {
        setEditingId(null)
        setStatusMessage({ type: 'success', text: 'Đã cập nhật danh mục thành công!' })
      })
      .catch(() => {
        // Lỗi đã được xử lý trong useEffect operationError
      })
  }

  // Xử lý Bắt đầu Xóa danh mục
  const handleDeleteStart = (category) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xác Nhận Xóa',
      message: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" này? Hành động này không thể hoàn tác.`,
      data: category._id,
      // Thay đổi: Gán hàm xác nhận đã được bao bọc (curried) với ID của danh mục.
      onConfirm: () => handleConfirmDelete(category._id), // TRUYỀN ID VÀO HÀM XÁC NHẬN
      onCancel: () => setConfirmModal({ isOpen: false })
    })
  }

  // Xử lý Xác nhận Xóa danh mục
  // TRONG CÁC KHAI BÁO FUNCTION
  const handleConfirmDelete = useCallback((idToDelete) => { // NHẬN ID TẠI ĐÂY
    setConfirmModal({ isOpen: false }) // Vẫn đóng modal

    // console.log("ID được xác nhận xóa:", idToDelete); // Dùng để kiểm tra

    dispatch(deleteCategory(idToDelete))
      .unwrap()
      .then(() => {
        setStatusMessage({ type: 'success', text: 'Đã xóa danh mục thành công!' })
      })
      .catch(() => {
        setStatusMessage({
          type: 'error',
          text: 'Xóa danh mục thất bại! Vui lòng kiểm tra lại Backend.'
        })
      })
  }, [dispatch]) // Xóa confirmModal.data khỏi dependency array


  // Hàm tạo slug tự động
  const generateSlug = (name) => {
    if (!name) return ''
    return name.toLowerCase()
      .normalize('NFD') // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/[^a-z0-9]+/g, '-') // Thay thế ký tự không phải chữ/số bằng dấu gạch ngang
      .replace(/^-+|-+$/g, '') // Loại bỏ gạch ngang ở đầu và cuối
  }


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản Lý Danh Mục</h2>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search input + search button */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-11 pr-24 text-sm rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border border-gray-300"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <button
            onClick={() => console.log('Tìm sản phẩm:', searchTerm)}
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
                 Tìm
          </button>
        </div>

        <button
          onClick={() => {
            setIsAddModalOpen(true)
            dispatch(clearCategoryError())
          }}
          disabled={operationLoading}
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
          className="px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus className="mr-2"/> {operationLoading ? 'Đang Xử Lý...' : 'Thêm Danh Mục'}
        </button>
      </div>

      {/* Trạng thái Loading/Error chung (Fetch) */}
      {loading && <div className="text-center text-indigo-500 py-4 text-lg flex items-center justify-center"><FaSpinner className="animate-spin mr-2" /> Đang tải dữ liệu...</div>}
      {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4 text-sm flex items-center"><FaExclamationTriangle className="mr-2" /> Lỗi tải danh mục: {error}</div>}

      {/* Thông báo thành công */}
      {statusMessage && (
        <div className={`p-3 rounded-lg mb-4 text-sm flex items-center justify-between shadow-md ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
          <div className='flex items-center'>
            {statusMessage.type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
            {statusMessage.text}
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-gray-500 hover:text-gray-700"><FaTimes /></button>
        </div>
      )}

      {/* Bảng Danh Mục */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Ảnh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Tên Danh Mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Chuỗi Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id} className="hover:bg-indigo-50/50 transition duration-150">
                  {/* Cột hình ảnh */}
                  <td className="px-6 py-4">
                    <img
                      src={category.image?.url || 'https://placehold.co/50x50?text=No+Image'}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200"
                    />
                  </td>

                  {/* Cột tên */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {editingId === category._id ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="p-2 border border-blue-300 rounded-md flex-grow focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                          placeholder="Tên danh mục"
                        />
                      </div>
                    ) : (
                      category.name
                    )}
                  </td>

                  {/* Cột slug */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {editingId === category._id ? (
                      <input
                        type="text"
                        value={generateSlug(editingName)}
                        readOnly
                        className="p-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 text-xs w-full"
                      />
                    ) : (
                      <span className="text-xs font-mono bg-gray-100 p-1 rounded">{category.slug}</span>
                    )}
                  </td>

                  {/* Cột thao tác */}
                  <td className="px-6 py-4 text-right text-lg font-medium whitespace-nowrap">
                    {editingId === category._id ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleUpdate}
                          disabled={operationLoading}
                          className="text-white bg-green-600 hover:bg-green-700 text-xs px-3 py-1 rounded-md flex items-center disabled:opacity-50 transition"
                        >
                          {operationLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                          <span className='ml-1 hidden md:inline'>Lưu</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-white bg-gray-500 hover:bg-gray-600 text-xs px-3 py-1 rounded-md flex items-center transition"
                        >
                          <FaTimes />
                          <span className='ml-1 hidden md:inline'>Hủy</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(category)}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150 mr-3 p-1 rounded-md hover:bg-indigo-100"
                          title="Chỉnh sửa danh mục"
                        >
                          <FaEdit className='w-4 h-4'/>
                        </button>
                        <button
                          onClick={() => handleDeleteStart(category)}
                          className="text-red-600 hover:text-red-900 transition duration-150 p-1 rounded-md hover:bg-red-100"
                          title="Xóa danh mục"
                        >
                          <FaTrash className='w-4 h-4'/>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500 text-lg">
                  {loading ? 'Đang tải...' : 'Chưa có danh mục nào được tạo.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* MODAL THÊM DANH MỤC MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 ease-out duration-300">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-2">
        Thêm Danh Mục Mới
            </h3>

            <form onSubmit={handleAddCategorySubmit}>

              {/* Tên danh mục */}
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-gray-700 text-sm font-medium mb-2">
            Tên danh mục
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              {/* Upload hình ảnh */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
            Ảnh danh mục
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCategoryImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />

                {/* Preview ảnh */}
                {newCategoryImage && (
                  <img
                    src={URL.createObjectURL(newCategoryImage)}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg mt-3 shadow"
                  />
                )}
              </div>

              {/* Slug */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
            Chuỗi Slug (Tự động)
                </label>
                <input
                  type="text"
                  value={generateSlug(newCategoryName)}
                  readOnly
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setNewCategoryName('')
                    setNewCategoryImage(null)
                  }}
                  className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                >
            Hủy
                </button>

                <button
                  type="submit"
                  disabled={operationLoading}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
                >
                  {operationLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
            Thêm Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN / LỖI CHUNG */}
      <CustomModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        confirmText={confirmModal.confirmText}
      />

    </div>
  )
}

export default AdminCategoryManager
