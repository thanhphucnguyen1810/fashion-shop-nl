/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails } from '~/redux/slices/productSlice'
import axios from 'axios'
import { updateProduct } from '~/redux/slices/admin/adminProductSlice'

const InputField = ({ label, name, type = 'text', value, onChange, required, inputStyle }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputStyle}`}
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

const EditProductPage = () => {
  const theme = useTheme()

  const baseBg = theme.palette.background.paper
  const textColor = theme.palette.text.primary
  const inputStyle = `bg-transparent border-[1px] text-sm text-[${textColor}] border-gray-300 dark:border-gray-600 placeholder-gray-400`

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { selectedProduct, loading, error } = useSelector((state) => state.products)

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    sku: '',
    category: '',
    brand: '',
    sizes: [],
    colors: [],
    collections: '',
    material: '',
    gender: '',
    images: []
  })

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct)
    }
  }, [selectedProduct])

  const updateProductField = (name, value) => {
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    updateProductField(name, value)
  }

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(',').map(s => s.trim())
    updateProductField('sizes', sizes)
  }

  const handleColorsChange = (e) => {
    const colors = e.target.value.split(',').map(c => c.trim())
    updateProductField('colors', colors)
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
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: '' }]
      }))
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProduct({ id, productData }))
    navigate('/admin/products')
  }

  if (loading) return <div className="flex justify-center p-10 font-bold">Đang tải...</div>
  if (error) return <div className="text-red-500 p-10 text-center">Lỗi: {error}</div>

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-8 shadow-xl rounded-xl border border-gray-100 dark:border-gray-800"
      style={{ backgroundColor: baseBg, color: textColor }}
    >
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Chỉnh sửa sản phẩm</h2>
        <p className="text-sm opacity-60">Cập nhật thông tin chi tiết và hình ảnh sản phẩm</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid layout cho các trường thông tin ngắn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              label="Tên sản phẩm"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              inputStyle={inputStyle}
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              label="Mô tả"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
              inputStyle={inputStyle}
            />
          </div>

          <InputField
            label="Giá niêm yết"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleChange}
            inputStyle={inputStyle}
          />

          <InputField
            label="Số lượng trong kho"
            name="countInStock"
            type="number"
            value={productData.countInStock}
            onChange={handleChange}
            inputStyle={inputStyle}
          />

          <InputField
            label="Mã sản phẩm (SKU)"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            inputStyle={inputStyle}
          />

          <InputField
            label="Kích cỡ (S, M, L...)"
            name="sizes"
            value={productData.sizes.join(', ')}
            onChange={handleSizesChange}
            inputStyle={inputStyle}
          />

          <div className="md:col-span-2">
            <InputField
              label="Màu sắc (phân tách bằng dấu phẩy)"
              name="colors"
              value={productData.colors.join(', ')}
              onChange={handleColorsChange}
              inputStyle={inputStyle}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300">
          <label className="block font-semibold mb-3 text-sm">Hình ảnh sản phẩm</label>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative overflow-hidden">
              <input
                type="file"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="px-4 py-2 bg-white dark:bg-gray-700 border rounded-md text-sm shadow-sm hover:bg-gray-100 transition-colors">
                {uploading ? 'Đang tải...' : 'Chọn file ảnh'}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {productData.images.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={image.url}
                    alt={image.altText || 'Ảnh sản phẩm'}
                    className="w-16 h-16 object-cover rounded-lg ring-1 ring-gray-200 shadow-sm transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            style={{
              backgroundColor: theme.palette.success.main,
              color: theme.palette.success.contrastText
            }}
            className="w-full py-3.5 rounded-lg font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
          >
            Cập nhật sản phẩm
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProductPage
