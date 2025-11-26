/* eslint-disable no-console */
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails } from '~/redux/slices/productSlice'
import axios from 'axios'
import { updateProduct } from '~/redux/slices/admin/adminProductSlice'

// Input Field Component
const InputField = ({ label, name, type = 'text', value, onChange, required, inputStyle }) => (
  <div className="mb-6">
    <label className="block font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border px-3 py-2 ${inputStyle}`}
      required={required}
    />
  </div>
)

// TextArea Field Component
const TextAreaField = ({ label, name, value, onChange, required, inputStyle }) => (
  <div className="mb-6">
    <label className="block font-semibold mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border px-3 py-2 ${inputStyle}`}
      rows={4}
      required={required}
    />
  </div>
)

const EditProductPage = () => {
  const theme = useTheme()

  // sử dụng màu từ palette
  const baseBg = theme.palette.background.paper
  const textColor = theme.palette.text.primary
  const borderColor = theme.palette.grey[300]
  const inputStyle = `bg-transparent border-[1px] text-sm text-[${textColor}] border-[${borderColor}] placeholder-gray-500`

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
    const formData = new FormData()
    formData.append('image', file)
    try {
      setUploading(true)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div
      className="max-w-5xl mx-auto p-6 shadow-md rounded-md"
      style={{ backgroundColor: baseBg, color: textColor }}
    >
      <h2 className="text-3xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Tên sản phẩm"
          name="name"
          value={productData.name}
          onChange={handleChange}
          required
          inputStyle={inputStyle}
        />

        <TextAreaField
          label="Mô tả"
          name="description"
          value={productData.description}
          onChange={handleChange}
          required
          inputStyle={inputStyle}
        />

        <InputField
          label="Giá"
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
          label="Kích cỡ (phân tách bằng dấu phẩy)"
          name="sizes"
          value={productData.sizes.join(', ')}
          onChange={handleSizesChange}
          inputStyle={inputStyle}
        />

        <InputField
          label="Màu sắc (phân tách bằng dấu phẩy)"
          name="colors"
          value={productData.colors.join(', ')}
          onChange={handleColorsChange}
          inputStyle={inputStyle}
        />

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Tải ảnh sản phẩm</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || 'Ảnh sản phẩm'}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText
          }}
          className="w-full py-3 rounded-md transition-opacity hover:opacity-90"
        >
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  )
}

export default EditProductPage
