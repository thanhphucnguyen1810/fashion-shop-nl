import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaPlus, FaTrash, FaSearch } from 'react-icons/fa'
import { useTheme } from '@mui/material/styles'
import StockInDetail from './StockInDetail'

const ITEMS_PER_PAGE = 5

const StockInList = () => {
  const theme = useTheme()
  const [stockIns, setStockIns] = useState([])
  const [filteredStockIns, setFilteredStockIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedStockIn, setSelectedStockIn] = useState(null)
  const [form, setForm] = useState({
    title: '',
    supplier: '',
    employee: '',
    warehouse: '',
    items: [{ product: '', version: '', size: '', quantity: '', price: '' }]
  })

  // ====== API ======
  const fetchStockIns = async () => {
    try {
      const res = await axios.get('/api/admin/stock-in')
      const data = Array.isArray(res.data) ? res.data : []
      setStockIns(data)
      setFilteredStockIns(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockIns()
  }, [])

  // ====== Form xử lý ======
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, e) => {
    const { name, value } = e.target
    const updated = [...form.items]
    updated[index][name] = value
    setForm((prev) => ({ ...prev, items: updated }))
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { product: '', version: '', size: '', quantity: '', price: '' }]
    }))
  }

  const removeItem = (i) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== i)
    }))
  }

  const handleAdd = async () => {
    if (!form.title || !form.supplier) return alert('Vui lòng nhập đủ thông tin')
    try {
      await axios.post('/api/admin/stock-in', form)
      setForm({
        title: '',
        supplier: '',
        employee: '',
        warehouse: '',
        items: [{ product: '', version: '', size: '', quantity: '', price: '' }]
      })
      setShowForm(false)
      fetchStockIns()
    } catch {
      alert('Thêm phiếu nhập thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa phiếu nhập này?')) return
    try {
      await axios.delete(`/api/admin/stock-in/${id}`)
      fetchStockIns()
    } catch {
      alert('Xóa thất bại')
    }
  }

  // ====== Tìm kiếm & phân trang ======
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    const filtered = Array.isArray(stockIns)
      ? stockIns.filter(si => si.product?.name?.toLowerCase().includes(term.toLowerCase()))
      : []
    setFilteredStockIns(filtered)

    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredStockIns.length / ITEMS_PER_PAGE)
  const displayedStockIns = Array.isArray(filteredStockIns)
    ? filteredStockIns.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : []

  // ====== Modal ======
  const openDetailModal = (stockIn) => {
    setSelectedStockIn(stockIn)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setSelectedStockIn(null)
    setShowDetailModal(false)
  }

  // ====== Render ======
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Danh sách phiếu nhập hàng</h2>

      {/* Thanh công cụ */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-180">
          <input
            type="text"
            placeholder="Tìm kiếm phiếu nhập..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full py-2.5 pl-11 pr-4 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
            onClick={() => handleSearch({ target: { value: searchTerm } })}
          >
          Tìm
          </button>
        </div>

        <button
          onClick={() => setShowForm((p) => !p)}
          className="px-4 py-2 rounded flex items-center gap-2"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <FaPlus /> {showForm ? 'Đóng' : 'Thêm phiếu nhập'}
        </button>
      </div>

      {/* Form thêm phiếu nhập */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
        &times;
            </button>

            <h3 className="font-semibold mb-4 text-xl">Thêm phiếu nhập hàng</h3>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input name="title" value={form.title} onChange={handleFormChange} placeholder="Tiêu đề phiếu nhập" className="p-2 border rounded" />
              <input name="supplier" value={form.supplier} onChange={handleFormChange} placeholder="Nhà cung cấp" className="p-2 border rounded" />
              <input name="employee" value={form.employee} onChange={handleFormChange} placeholder="Nhân viên nhập" className="p-2 border rounded" />
              <input name="warehouse" value={form.warehouse} onChange={handleFormChange} placeholder="Kho nhập" className="p-2 border rounded" />
            </div>

            <h4 className="font-medium mb-2">Danh sách sản phẩm</h4>
            {form.items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2 items-center">
                <input name="product" value={item.product} onChange={(e) => handleItemChange(i, e)} placeholder="Tên sản phẩm" className="p-2 border rounded" />
                <input name="version" value={item.version} onChange={(e) => handleItemChange(i, e)} placeholder="Phiên bản" className="p-2 border rounded" />
                <input name="size" value={item.size} onChange={(e) => handleItemChange(i, e)} placeholder="Size" className="p-2 border rounded" />
                <input name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(i, e)} placeholder="Số lượng" className="p-2 border rounded" />
                <input name="price" type="number" value={item.price} onChange={(e) => handleItemChange(i, e)} placeholder="Giá/1SP" className="p-2 border rounded" />
                <button onClick={() => removeItem(i)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
              </div>
            ))}
            <button
              onClick={addItem}
              className="px-3 py-1 mb-3 rounded bg-green-600 text-white flex items-center gap-2"
            >
              <FaPlus /> Thêm sản phẩm
            </button>

            <div className="text-right">
              <button onClick={handleAdd} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Lưu phiếu nhập</button>
            </div>
          </div>
        </div>
      )}


      {/* Bảng danh sách */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-sm uppercase">
            <tr>
              <th className="p-3">Tiêu đề</th>
              <th className="p-3">Nhà cung cấp</th>
              <th className="p-3">Nhân viên</th>
              <th className="p-3">Kho nhập</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Đang tải...</td></tr>
            ) : displayedStockIns.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center">Không có phiếu nhập nào</td></tr>
            ) : (
              displayedStockIns.map((si) => (
                <tr key={si._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-blue-600 cursor-pointer hover:underline" onClick={() => openDetailModal(si)}>{si.title}</td>
                  <td className="p-3">{si.supplier}</td>
                  <td className="p-3">{si.employee}</td>
                  <td className="p-3">{si.warehouse}</td>
                  <td className="p-3">{new Date(si.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button onClick={() => handleDelete(si._id)} className="p-2 bg-red-600 text-white rounded hover:opacity-80"><FaTrash /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Trước</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Sau</button>
        </div>
      )}

      {/* Modal chi tiết phiếu nhập */}
      {showDetailModal && selectedStockIn && (
        <StockInDetail stockIn={selectedStockIn} onClose={closeDetailModal} />
      )}
    </div>
  )
}

export default StockInList
