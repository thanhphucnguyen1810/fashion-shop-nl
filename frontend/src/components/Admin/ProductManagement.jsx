/* eslint-disable no-console */
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'

const ProductManagement = () => {
  const theme = useTheme()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    countInStock: '',
    sku: '',
    category: '',
    sizes: '',
    colors: '',
    collections: '',
    user: '' // ID người tạo sản phẩm
  })

  // ===== GET PRODUCTS =====
  const fetchProducts = async (search = '') => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/admin/products?search=${search}`)
      // console.log('Dữ liệu API trả về:', res.data)
      setProducts(res.data.products || [])
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error)
    } finally {
      setLoading(false)
    }
  }

  // ===== Debounced fetch =====
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(searchTerm)
    }, 500) // đợi 500ms sau khi gõ xong

    return () => clearTimeout(delayDebounce) // hủy timeout nếu gõ tiếp
  }, [searchTerm])

  // ===== HANDLE FORM =====
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ===== ADD PRODUCT =====
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        sizes: formData.sizes ? formData.sizes.split(',').map((s) => s.trim()) : [],
        colors: formData.colors ? formData.colors.split(',').map((c) => c.trim()) : [],
        user: formData.user || '6732d0cfb7b9cd001fa923a1' // ví dụ ID admin
      }

      const res = await axios.post('/api/admin/products', payload)
      console.log('Thêm sản phẩm thành công:', res.data)
      setFormData({
        name: '',
        description: '',
        price: '',
        countInStock: '',
        sku: '',
        category: '',
        sizes: '',
        colors: '',
        collections: '',
        user: ''
      })
      fetchProducts()
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message)
      alert(error.response?.data?.message || 'Thêm sản phẩm thất bại')
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')
    if (confirmDelete) {
      try {
        await axios.delete(`/api/admin/products/${id}`)
        fetchProducts()
        console.log('Deleting product with ID:', id)
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error)
        alert('Xóa sản phẩm thất bại!')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h2>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm ..."
          className="w-full md:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add New Product Form */}
      <div
        className="border p-6 mb-8 rounded-lg shadow-sm"
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Giá</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mã SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="block mb-1 font-medium">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số lượng trong kho</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Danh mục</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bộ sưu tập</label>
            <input
              type="text"
              name="collections"
              value={formData.collections}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Kích cỡ</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Màu sắc</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="px-4 py-2 mt-2 rounded hover:opacity-90"
              style={{
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText
              }}
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>

      {/* Product Table */}
      <div
        className="overflow-x-auto shadow-md sm:rounded-lg"
        style={{ backgroundColor: theme.palette.background.paper }}
      >
        {loading ? (
          <p className="p-4 text-center">Đang tải dữ liệu...</p>
        ) : (
          <table className="min-w-full text-left" style={{ color: theme.palette.text.primary }}>
            <thead style={{ backgroundColor: theme.palette.grey[200] }} className="text-xs uppercase">
              <tr>
                <th className="py-3 px-4">Tên sản phẩm</th>
                <th className="py-3 px-4">Giá</th>
                <th className="py-3 px-4">Tồn kho</th>
                <th className="py-3 px-4">Mã SKU</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.countInStock}</td>
                    <td className="p-4">{product.sku}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 flex gap-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="px-3 py-2 rounded hover:opacity-90 flex items-center justify-center"
                        style={{
                          backgroundColor: theme.palette.warning.main,
                          color: theme.palette.warning.contrastText
                        }}
                        title="Sửa sản phẩm"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-2 rounded hover:opacity-90 flex items-center justify-center"
                        style={{
                          backgroundColor: theme.palette.error.main,
                          color: theme.palette.error.contrastText
                        }}
                        title="Xóa sản phẩm"
                      >
                        <FaTrash />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ProductManagement
