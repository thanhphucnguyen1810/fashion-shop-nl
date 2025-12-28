import React, { useRef } from 'react'
import { FaTimes, FaPrint } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'

export default function OrderDetailModal({ selectedOrder, showDetailModal, closeOrderDetail }) {
  const invoiceRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `HoaDon_TheAurora_${selectedOrder?._id.slice(-6)}`
  })

  if (!selectedOrder || !showDetailModal) return null

  const orderId = selectedOrder._id?.toString() || ''

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 no-print">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">

        {/* Header Modal */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-700">Chi tiết hóa đơn</h2>
          <div className="flex gap-2">
            <button onClick={() => handlePrint()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
              <FaPrint /> In hóa đơn
            </button>
            <button onClick={closeOrderDetail} className="text-gray-400 hover:text-red-500 text-2xl"> <FaTimes /> </button>
          </div>
        </div>

        {/* VÙNG IN HÓA ĐƠN */}
        <div className="overflow-y-auto flex-1 p-10 bg-white text-black" ref={invoiceRef}>
          <style>{`
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
      @page { size: A4; margin: 10mm; }
      .print-shadow { box-shadow: none !important; }
    }
  `}</style>

          {/* Header: Logo & QR Code */}
          <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900">THE AURORA</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Premium Fashion Store</p>
              <div className="mt-2 text-[11px] leading-relaxed">
                <p>Đ/C: 123 Xuân Khánh, Ninh Kiều, Cần Thơ</p>
                <p>Hotline: 1900 6789 - Website: theaurora.vn</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex flex-col items-end">
                <QRCodeSVG
                  value={`http://localhost:5173/${selectedOrder._id}`}
                  size={60}
                  level={'H'}
                />
                <p className="text-[9px] mt-1 font-mono">Quét để kiểm tra</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest">Hóa Đơn Giá Trị Gia Tăng</h2>
            <p className="text-sm font-mono italic">Số: {orderId.toUpperCase()}</p>
          </div>

          {/* Thông tin khách hàng & vận chuyển */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-xs border p-4 rounded-lg bg-gray-50">
            <div>
              <h3 className="font-bold border-b mb-2 pb-1 text-gray-600">THÔNG TIN KHÁCH HÀNG</h3>
              <p className="text-sm font-bold">{selectedOrder.shippingAddress?.lastName} {selectedOrder.shippingAddress?.firstName}</p>
              <p>SĐT: {selectedOrder.shippingAddress?.phone}</p>
              <p>Địa chỉ: {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold border-b mb-2 pb-1 text-gray-600">VẬN CHUYỂN & THANH TOÁN</h3>
              <p>Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
              <p>Phương thức: <span className="font-bold">{selectedOrder.paymentMethod}</span></p>
              <p>Đơn vị vận chuyển: <span className="font-bold underline">Aurora Express</span></p>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <table className="w-full text-xs mb-8">
            <thead>
              <tr className="bg-black text-white uppercase">
                <th className="py-2 px-2 text-left">STT</th>
                <th className="py-2 px-2 text-left">Sản phẩm</th>
                <th className="py-2 px-2 text-center">SL</th>
                <th className="py-2 px-2 text-right">Đơn giá</th>
                <th className="py-2 px-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="border-b-2 border-black">
              {selectedOrder.orderItems?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">
                    {index+1}
                  </td>
                  <td className="py-2">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-[10px] text-gray-500">
                      Phân loại: {item.color || 'N/A'} - {item.size || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {item.price?.toLocaleString()}đ
                  </td>
                  <td className="py-2 text-right font-bold">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tổng kết tiền */}
          <div className="flex justify-end pr-2 mt-4">
            <div className="w-1/2 space-y-2">
              {/* Tổng sản phẩm trước giảm giá */}
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Tạm tính (Tiền hàng):</span>
                <span className="font-medium">
                  {selectedOrder.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}đ
                </span>
              </div>

              {/* Phí ship*/}
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>{selectedOrder.shippingPrice?.toLocaleString() || '0'}đ</span>
              </div>

              {/* Giảm giá */}
              {selectedOrder.coupon?.discountAmount > 0 && (
                <div className="flex justify-between text-[11px] text-red-600 font-medium italic">
                  <span>Voucher giảm giá ({selectedOrder.coupon.code}):</span>
                  <span>-{selectedOrder.coupon.discountAmount.toLocaleString()}đ</span>
                </div>
              )}

              {/* Thành tiền */}
              <div className="flex justify-between border-t-2 border-black pt-2 text-lg font-black bg-gray-100 p-2">
                <div className="flex flex-col">
                  <span>THÀNH TIỀN:</span>
                  <span className="text-[9px] font-normal italic text-gray-500">(Đã bao gồm VAT)</span>
                </div>
                <span className="text-blue-700">{selectedOrder.totalPrice?.toLocaleString()}đ</span>
              </div>

              {/* hiển thị phương thức thanh toán */}
              <div className="text-right text-[10px] mt-2 italic font-bold uppercase">
       Hình thức: {selectedOrder.paymentMethod}
                {selectedOrder.isPaid ? ' (Đã thanh toán)' : ' (Thu hộ COD)'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 grid grid-cols-2 text-center text-[11px] font-bold">
            <div>
              <p className="uppercase mb-16">Xác nhận người mua</p>
              <p className="text-gray-400 font-normal italic">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="uppercase mb-16">Đại diện cửa hàng</p>
              <p className="text-lg font-black text-gray-800">THE AURORA</p>
            </div>
          </div>

          <div className="mt-16 text-center border-t pt-4">
            <p className="text-[10px] text-gray-500 italic">Cảm ơn bạn đã tin tưởng The Aurora. Vui lòng quay video lúc mở gói hàng để được hỗ trợ tốt nhất!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
