import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStockImports, createStockImport, deleteStockImport, clearMessage } from '~/redux/slices/admin/stockImportSlice'
import { fetchAdminProducts } from '~/redux/slices/admin/adminProductSlice'

const AdminStockImportPage = () => {
  const dispatch = useDispatch()
  const { imports, loading, successMessage, error } = useSelector(s => s.stockImport)
  const { products } = useSelector(s => s.adminProducts)

  // Form state
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)

  // Item đang thêm
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [selectedSizeId, setSelectedSizeId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [costPrice, setCostPrice] = useState(0)

  useEffect(() => {
    dispatch(fetchStockImports())
    dispatch(fetchAdminProducts())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) setTimeout(() => dispatch(clearMessage()), 3000)
  }, [successMessage])

  // Lấy variants của product đang chọn
  const currentProduct = products.find(p => p._id === selectedProduct)
  const currentVariant = currentProduct?.variants?.find(v => v._id === selectedVariantId)

  const handleAddItem = () => {
    if (!selectedProduct || !selectedVariantId || !selectedSizeId || quantity < 1) return

    const product = products.find(p => p._id === selectedProduct)
    const variant = product?.variants?.find(v => v._id === selectedVariantId)
    const size = variant?.sizes?.find(s => s._id === selectedSizeId)

    setItems(prev => [...prev, {
      product: selectedProduct,
      variantId: selectedVariantId,
      sizeId: selectedSizeId,
      color: variant?.color,
      size: size?.size,
      quantity,
      costPrice,
      _productName: product?.name
    }])

    // Reset item form
    setSelectedSizeId('')
    setQuantity(1)
    setCostPrice(0)
  }

  const handleRemoveItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!supplier || items.length === 0) return
    dispatch(createStockImport({ supplier, note, items }))
    setShowForm(false)
    setSupplier('')
    setNote('')
    setItems([])
  }

  const handleDelete = (id) => {
    if (window.confirm('Xóa phiếu này sẽ hoàn lại stock. Tiếp tục?')) {
      dispatch(deleteStockImport(id))
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý nhập hàng</h1>
          <p className="text-gray-500 text-sm">Tạo phiếu nhập & cập nhật tồn kho variant</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tạo phiếu nhập
        </button>
      </div>

      {/* Thông báo */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">{successMessage}</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{error}</div>
      )}

      {/* Form tạo phiếu */}
      {showForm && (
        <div className="border rounded-xl p-6 space-y-4 bg-white shadow">
          <h2 className="font-bold text-lg">Tạo phiếu nhập mới</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nhà cung cấp *</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="Tên nhà cung cấp"
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <input
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="Ghi chú (tuỳ chọn)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Thêm sản phẩm vào phiếu */}
          <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <p className="font-medium text-sm">Thêm sản phẩm</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Chọn sản phẩm */}
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={selectedProduct}
                onChange={e => { setSelectedProduct(e.target.value); setSelectedVariantId(''); setSelectedSizeId('') }}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>

              {/* Chọn màu */}
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={selectedVariantId}
                onChange={e => { setSelectedVariantId(e.target.value); setSelectedSizeId('') }}
                disabled={!currentProduct}
              >
                <option value="">-- Chọn màu --</option>
                {currentProduct?.variants?.map(v => (
                  <option key={v._id} value={v._id}>{v.color}</option>
                ))}
              </select>

              {/* Chọn size */}
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={selectedSizeId}
                onChange={e => setSelectedSizeId(e.target.value)}
                disabled={!currentVariant}
              >
                <option value="">-- Chọn size --</option>
                {currentVariant?.sizes?.map(s => (
                  <option key={s._id} value={s._id}>{s.size} (stock: {s.stock})</option>
                ))}
              </select>

              {/* Số lượng */}
              <div>
                <label className="text-xs text-gray-500">Số lượng nhập</label>
                <input
                  type="number" min={1}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>

              {/* Giá vốn */}
              <div>
                <label className="text-xs text-gray-500">Giá nhập (đ)</label>
                <input
                  type="number" min={0}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={costPrice}
                  onChange={e => setCostPrice(Number(e.target.value))}
                />
              </div>

              <button
                onClick={handleAddItem}
                className="self-end bg-green-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700"
              >
                + Thêm
              </button>
            </div>
          </div>

          {/* Danh sách items đã thêm */}
          {items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Sản phẩm</th>
                    <th className="p-3 text-left">Màu</th>
                    <th className="p-3 text-left">Size</th>
                    <th className="p-3 text-right">SL</th>
                    <th className="p-3 text-right">Giá nhập</th>
                    <th className="p-3 text-right">Thành tiền</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{item._productName}</td>
                      <td className="p-3">{item.color}</td>
                      <td className="p-3">{item.size}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{item.costPrice.toLocaleString('vi-VN')}đ</td>
                      <td className="p-3 text-right font-medium">
                        {(item.quantity * item.costPrice).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">✕</button>
                      </td>
                    </tr>
                  ))}
                  {/* Tổng */}
                  <tr className="border-t bg-gray-50 font-bold">
                    <td colSpan={5} className="p-3 text-right">Tổng cộng:</td>
                    <td className="p-3 text-right text-blue-600">
                      {items.reduce((s, i) => s + i.quantity * i.costPrice, 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!supplier || items.length === 0 || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Đang lưu...' : 'Tạo phiếu nhập'}
            </button>
          </div>
        </div>
      )}

      {/* Danh sách phiếu nhập */}
      <div className="border rounded-xl overflow-hidden bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Mã phiếu</th>
              <th className="p-4 text-left">Nhà cung cấp</th>
              <th className="p-4 text-left">Người tạo</th>
              <th className="p-4 text-right">Số dòng</th>
              <th className="p-4 text-right">Tổng tiền</th>
              <th className="p-4 text-left">Ngày tạo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Đang tải...</td></tr>
            )}
            {!loading && imports.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">Chưa có phiếu nhập nào</td></tr>
            )}
            {imports.map(imp => (
              <tr key={imp._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-mono text-blue-600">{imp.code}</td>
                <td className="p-4">{imp.supplier}</td>
                <td className="p-4">{imp.createdBy?.name || '—'}</td>
                <td className="p-4 text-right">{imp.items?.length} dòng</td>
                <td className="p-4 text-right font-semibold">
                  {imp.totalCost?.toLocaleString('vi-VN')}đ
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(imp.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDelete(imp._id)}
                    className="text-red-500 hover:text-red-700 text-xs border border-red-200 px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminStockImportPage
