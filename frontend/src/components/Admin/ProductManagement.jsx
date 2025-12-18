/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, createProduct, deleteProduct } from '~/redux/slices/admin/adminProductSlice'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Loading from '../Common/Loading'

const ProductManagement = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.adminProducts)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Lọc danh sách sản phẩm theo searchTerm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    images: [],
    user: ''
  })

  useEffect(() => {
    dispatch(fetchAdminProducts())
  }, [dispatch])

  // ===== HANDLE FORM =====
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ===== ADD PRODUCT =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formPayload = new FormData()
    formPayload.append('name', formData.name)
    formPayload.append('description', formData.description)
    formPayload.append('price', formData.price)
    formPayload.append('countInStock', formData.countInStock)
    formPayload.append('sku', formData.sku)
    formPayload.append('category', formData.category)
    formPayload.append('collections', formData.collections)

    formPayload.append('sizes', JSON.stringify(formData.sizes))
    formPayload.append('colors', JSON.stringify(formData.colors))

    formData.images.forEach(file => {
      formPayload.append('images', file)
    })

    try {
      await dispatch(createProduct(formPayload)).unwrap()
      // Đóng modal sau khi lưu thành công
      setShowForm(false)
      // reset form
      setShowForm(false)
      setFormData({
        name:'', description:'', price:'', countInStock:'', sku:'', category:'', sizes: [], colors: [], collections:'', images:[]
      })
    } catch (error) {
      console.error(error)
    }
  }


  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này không?'))
      dispatch(deleteProduct(id))
  }
  if (loading) return <Loading />
  if (error) return <p>Error: {error}</p>


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản Lý Sản Phẩm</h2>
      {/* Search Bar */}
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

        {/* Thêm sản phẩm button */}
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded flex items-center gap-2"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      {/* Modal Add New Product */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-3xl relative"
            style={{ backgroundColor: theme.palette.background.paper }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
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
                <label className="block mb-1 font-medium">Hình ảnh</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      images: Array.from(e.target.files)
                    }))
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>


              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="px-4 py-2 mt-2 rounded hover:opacity-90 w-full"
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
        </div>
      )}


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
                <th className="py-3 px-4">Ảnh</th>
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
                    <td className="p-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={
                            product.images[0] && product.images[0].url
                              ? product.images[0].url
                              : product.images[0]
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                      )}
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">{product.price}đ</td>
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
