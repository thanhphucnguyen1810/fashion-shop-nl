import React, { useRef } from 'react'
import { FaTimes, FaReceipt, FaUser, FaHome, FaMoneyBillWave, FaTruck } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'

export default function OrderDetailModal({ selectedOrder, showDetailModal, closeOrderDetail }) {
  const invoiceRef = useRef() // đây mới là ref chính

  // Xử lý in
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: selectedOrder ? `HoaDon_${selectedOrder._id}` : 'HoaDon',
    onAfterPrint: () => alert('Đã in hóa đơn!'),
    removeAfterPrint: true,
    pageStyle: `
    @page { size: auto; margin: 20mm; }
    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  `
  })


  if (!selectedOrder) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 ${!showDetailModal ? 'hidden' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 relative">
        {/* Nút đóng */}
        <button
          onClick={closeOrderDetail}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Đóng chi tiết"
        >
          <FaTimes />
        </button>

        {/* Nội dung hóa đơn để in */}
        <div ref={invoiceRef}>
          {/* Header */}
          <div className="mb-4 border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaReceipt /> Đơn hàng #{selectedOrder._id}
            </h3>
            <p className="text-sm text-gray-500">
              Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Thông tin khách hàng & đơn hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
              <p className="flex items-center gap-2">
                <FaUser className="text-gray-500" /> <span className="font-medium">Khách hàng:</span> {selectedOrder.user.name}
              </p>
              <p className="flex items-center gap-2 mt-2">
                <FaHome className="text-blue-500" /> <span className="font-medium">Địa chỉ:</span> {selectedOrder.address}
              </p>
            </div>
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" /> <span className="font-medium">Thanh toán:</span> {selectedOrder.paymentMethod}
              </p>
              <p className="flex items-center gap-2 mt-2">
                <FaTruck className="text-yellow-600" /> <span className="font-medium">Trạng thái:</span> {selectedOrder.status}
              </p>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Sản phẩm</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm">Sản phẩm</th>
                    <th className="py-2 px-4 text-left text-sm">Số lượng</th>
                    <th className="py-2 px-4 text-left text-sm">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4 font-medium">{item.price.toLocaleString()} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="mt-4 text-right p-4 border-t">
            <p className="text-xl font-bold text-gray-900 flex items-center justify-end gap-2">
              <FaMoneyBillWave className="text-green-600" /> Tổng cộng: {selectedOrder.totalPrice.toLocaleString()} đ
            </p>
          </div>
        </div>

        {/* Nút in hóa đơn */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            In hóa đơn / Xuất PDF
          </button>
        </div>
      </div>
    </div>
  )
}
