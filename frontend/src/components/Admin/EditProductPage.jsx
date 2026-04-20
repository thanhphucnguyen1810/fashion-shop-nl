/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails } from '~/redux/slices/productSlice'
import { updateProduct } from '~/redux/slices/admin/adminProductSlice'
import axios from 'axios'
import VariantManager from './VariantManager'
import { FaArrowLeft } from 'react-icons/fa'

const InputField = ({ label, name, type = 'text', value, onChange, required, inputStyle, readOnly }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputStyle} ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
      required={required}
    />
  </div>
)

const TextAreaField = ({ label, name, value, onChange, required, inputStyle }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputStyle}`}
      rows={4}
      required={required}
    />
  </div>
)

// ===== MAIN COMPONENT =====
const EditProductPage = () => {
  const theme = useTheme()
  const baseBg = theme.palette.background.paper
  const textColor = theme.palette.text.primary
  const inputStyle = 'bg-transparent border-[1px] text-sm border-gray-300 dark:border-gray-600'

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { selectedProduct, loading, error } = useSelector(state => state.products)

  const [productData, setProductData] = useState({
    name: '', description: '', price: 0, sku: '',
    category: '', brand: '', collections: '',
    material: '', gender: '', images: [], variants: []
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id))
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        variants: selectedProduct.variants || [],
        images: selectedProduct.images || []
      })
    }
  }, [selectedProduct])

  // Reload variants sau khi upsert/delete
  const handleVariantsChange = () => {
    dispatch(fetchProductDetails(id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    try {
      setUploading(true)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setProductData(prev => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: '' }]
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { ...rest } = productData
    dispatch(updateProduct({ id, productData: rest }))
    navigate('/admin/products')
  }

  if (loading) return <div className="flex justify-center p-10 font-bold">Đang tải...</div>
  if (error) return <div className="text-red-500 p-10 text-center">Lỗi: {error}</div>

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-8 shadow-xl rounded-xl border border-gray-100 dark:border-gray-800"
      style={{ backgroundColor: baseBg, color: textColor }}
    >
      <div className="mb-8 border-b pb-4 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Chỉnh sửa sản phẩm</h2>
          <p className="text-sm opacity-60">Cập nhật thông tin và quản lý biến thể sản phẩm</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <FaArrowLeft /> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField label="Tên sản phẩm" name="name" value={productData.name} onChange={handleChange} required inputStyle={inputStyle} />
          </div>
          <div className="md:col-span-2">
            <TextAreaField label="Mô tả" name="description" value={productData.description} onChange={handleChange} required inputStyle={inputStyle} />
          </div>
          <InputField label="Giá niêm yết (tự tính từ variants)" name="price" type="number" value={productData.price} onChange={handleChange} inputStyle={inputStyle} readOnly />
          <InputField label="Mã SKU" name="sku" value={productData.sku} onChange={handleChange} inputStyle={inputStyle} />
          <InputField label="Danh mục" name="category" value={productData.category} onChange={handleChange} inputStyle={inputStyle} />
          <InputField label="Thương hiệu" name="brand" value={productData.brand || ''} onChange={handleChange} inputStyle={inputStyle} />
          <InputField label="Bộ sưu tập" name="collections" value={productData.collections || ''} onChange={handleChange} inputStyle={inputStyle} />
          <InputField label="Chất liệu" name="material" value={productData.material || ''} onChange={handleChange} inputStyle={inputStyle} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Giới tính</label>
            <select
              name="gender"
              value={productData.gender || ''}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 ${inputStyle}`}
            >
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Unisex">Unisex</option>
              <option value="Nam (Bé Trai)">Nam (Bé Trai)</option>
              <option value="Nữ (Bé Gái)">Nữ (Bé Gái)</option>
            </select>
          </div>
        </div>

        {/* Ảnh sản phẩm */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300">
          <label className="block font-semibold mb-3 text-sm">Hình ảnh sản phẩm</label>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative overflow-hidden">
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="px-4 py-2 bg-white dark:bg-gray-700 border rounded-md text-sm shadow-sm hover:bg-gray-100 transition-colors">
                {uploading ? 'Đang tải...' : 'Chọn file ảnh'}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {productData.images.map((image, index) => (
                <img key={index} src={image.url} alt={image.altText || ''} className="w-16 h-16 object-cover rounded-lg ring-1 ring-gray-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Quản lý Variants */}
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <VariantManager
            productId={id}
            variants={productData.variants}
            skuBase={productData.sku}
            onVariantsChange={handleVariantsChange}
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText }}
          className="w-full py-3.5 rounded-lg font-bold text-lg shadow-lg hover:brightness-110 transition-all"
        >
          Cập nhật thông tin sản phẩm
        </button>
      </form>

    </div>
  )
}

export default EditProductPage
