// src/pages/StockInDetail.jsx
import { FaTimes } from 'react-icons/fa'

const StockInDetail = ({ stockIn, onClose }) => {
  const total = stockIn.items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  )

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[85vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">
          <FaTimes />
        </button>

        <h3 className="text-xl font-bold mb-2">{stockIn.title}</h3>
        <p><b>Nhà cung cấp:</b> {stockIn.supplier}</p>
        <p><b>Nhân viên nhập:</b> {stockIn.employee}</p>
        <p><b>Kho nhập:</b> {stockIn.warehouse}</p>
        <p><b>Ngày nhập:</b> {new Date(stockIn.createdAt).toLocaleDateString()}</p>

        <h4 className="font-semibold mt-4 mb-2">Chi tiết sản phẩm</h4>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Sản phẩm</th>
              <th className="p-2 border">Phiên bản</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Số lượng</th>
              <th className="p-2 border">Đơn giá</th>
              <th className="p-2 border">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {stockIn.items.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{item.product}</td>
                <td className="border p-2">{item.version}</td>
                <td className="border p-2">{item.size}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">{Number(item.price).toLocaleString()} đ</td>
                <td className="border p-2">{(item.quantity * item.price).toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right font-semibold text-blue-600 mt-3">
          Tổng cộng: {total.toLocaleString()} đ
        </div>
      </div>
    </div>
  )
}

export default StockInDetail
