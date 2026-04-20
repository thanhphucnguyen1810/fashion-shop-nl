import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { upsertVariant, deleteVariant, deleteSize } from '~/redux/slices/admin/adminProductSlice'

const VariantManager = ({ productId, variants = [], skuBase = '', onVariantsChange }) => {
  const dispatch = useDispatch()

  const [colorInput, setColorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [prices, setPrices] = useState({}) // { 'M': 250000, 'L': 270000 }
  const [showMatrix, setShowMatrix] = useState(false)

  const toCode = (str) => str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .slice(0, 3)
    .toUpperCase()

  const handleGenerateMatrix = () => {
    const colorList = colorInput.split(',').map(c => c.trim()).filter(Boolean)
    const sizeList = sizeInput.split(',').map(s => s.trim()).filter(Boolean)
    if (!colorList.length || !sizeList.length) return

    setColors(colorList)
    setSizes(sizeList)

    // Khởi tạo giá theo size, giữ lại nếu đã có
    const newPrices = {}
    sizeList.forEach(size => {
      newPrices[size] = prices[size] || ''
    })

    setPrices(newPrices)
    setShowMatrix(true)
  }

  const handleSaveMatrix = async () => {
    // Validate giá
    const missingPrice = sizes.find(s => !prices[s])
    if (missingPrice) {
      alert(`Vui lòng điền giá cho size ${missingPrice}!`)
      return
    }

    // Mỗi màu → upsert với sizes dùng chung giá theo size
    for (const color of colors) {
      const sizesData = sizes.map(size => ({
        size,
        price: Number(prices[size]),
        stock: 0,
        sku: `${skuBase}-${toCode(color)}-${size}`.toUpperCase()
      }))

      await dispatch(upsertVariant({
        productId,
        variantData: { color, sizes: sizesData }
      }))
    }

    onVariantsChange()
    // Reset form
    setShowMatrix(false)
    setColorInput('')
    setSizeInput('')
    setColors([])
    setSizes([])
    setPrices({})
  }

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Xóa toàn bộ màu này?')) return
    await dispatch(deleteVariant({ productId, variantId }))
    onVariantsChange()
  }

  const handleDeleteSize = async (variantId, sizeId) => {
    if (!window.confirm('Xóa size này?')) return
    await dispatch(deleteSize({ productId, variantId, sizeId }))
    onVariantsChange()
  }

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-base">Quản lý biến thể</h3>

      {/* ===== VARIANTS HIỆN CÓ ===== */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500">Biến thể hiện có:</p>
          {variants.map(variant => (
            <div key={variant._id} className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800">
                <span className="font-semibold text-sm">🎨 {variant.color}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteVariant(variant._id)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-2 py-1 rounded"
                >
                  Xóa màu
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="text-gray-500 text-xs border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Size</th>
                    <th className="px-4 py-2 text-right">Giá</th>
                    <th className="px-4 py-2 text-right">Tồn kho</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {variant.sizes.map(s => (
                    <tr key={s._id} className="border-t">
                      <td className="px-4 py-2 font-medium">{s.size}</td>
                      <td className="px-4 py-2 text-right">{s.price?.toLocaleString('vi-VN')}đ</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.stock === 0
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {s.stock === 0 ? 'Hết hàng' : s.stock}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-400 text-xs">{s.sku}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteSize(variant._id, s._id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ===== FORM TẠO MATRIX ===== */}
      <div className="border border-dashed rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/40">
        <p className="text-sm font-semibold">+ Thêm biến thể mới</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Màu sắc <span className="text-gray-400">(phân cách bằng dấu phẩy)</span>
            </label>
            <input
              type="text"
              placeholder="VD: Đỏ, Xanh Navy, Đen"
              value={colorInput}
              onChange={e => setColorInput(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Size <span className="text-gray-400">(phân cách bằng dấu phẩy)</span>
            </label>
            <input
              type="text"
              placeholder="VD: S, M, L, XL, XXL"
              value={sizeInput}
              onChange={e => setSizeInput(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateMatrix}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Tạo bảng giá
        </button>

        {/* ===== MATRIX ===== */}
        {showMatrix && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              💡 Giá theo size — tất cả màu dùng chung. Stock sẽ nhập qua phiếu nhập hàng.
            </p>

            {/* Bảng giá theo size */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Giá bán (đ)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-400">SKU mẫu</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map(size => (
                    <tr key={size} className="border-t">
                      <td className="px-4 py-3 font-bold text-blue-600">{size}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="VD: 250000"
                          value={prices[size] || ''}
                          onChange={e => setPrices(prev => ({ ...prev, [size]: e.target.value }))}
                          className="w-40 border rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {colors[0] ? `${skuBase}-${toCode(colors[0])}-${size}`.toUpperCase() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Preview màu sẽ được tạo */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500">Màu sẽ tạo:</span>
              {colors.map(color => (
                <span
                  key={color}
                  className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                >
                  {color}
                </span>
              ))}
            </div>

            {/* Preview kết quả */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p className="font-semibold">Sẽ tạo {colors.length * sizes.length} biến thể:</p>
              {colors.map(color =>
                sizes.map(size => (
                  <p key={`${color}-${size}`}>
                    • {color} / {size} — {prices[size] ? Number(prices[size]).toLocaleString('vi-VN') + 'đ' : '(chưa có giá)'}
                    {' '}— SKU: {`${skuBase}-${toCode(color)}-${size}`.toUpperCase()}
                  </p>
                ))
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowMatrix(false)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveMatrix}
                className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium"
              >
                Lưu {colors.length * sizes.length} biến thể
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gợi ý nhập hàng */}
      {variants.length > 0 && (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <span>💡</span>
          <span>Stock hiện tại = 0. Vào <strong>Quản lý nhập hàng</strong> để cập nhật tồn kho.</span>
        </div>
      )}
    </div>
  )
}

export default VariantManager
