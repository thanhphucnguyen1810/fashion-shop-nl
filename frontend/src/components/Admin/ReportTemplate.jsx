import React from 'react'

export const ReportTemplate = React.forwardRef(({ data, timeFrame, totalSales }, ref) => {
  const deliveredOrders = data.filter(o => o.status === 'Delivered')

  return (
    <div ref={ref} className="p-16 bg-white text-black font-sans print:p-10" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase">The Aurora Fashion Shop</h1>
          <p className="text-xs">Mã số thuế: 0123456789</p>
          <p className="text-xs">Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="text-xs font-bold underline">Độc lập - Tự do - Hạnh phúc</p>
          <p className="text-[10px] mt-1 text-gray-500">{new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>

      {/* Tiêu đề */}
      <div className="text-center my-10">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Báo Cáo Thống Kê Doanh Thu</h2>
        <p className="text-sm italic mt-1">
          (Kỳ báo cáo: {timeFrame === 'day' ? 'Ngày' : timeFrame === 'month' ? 'Tháng' : timeFrame === 'quarter' ? 'Quý' : 'Năm'})
        </p>
      </div>

      {/* Chỉ số tổng hợp */}
      <div className="grid grid-cols-2 gap-0 border border-black mb-8">
        <div className="border-r border-b border-black p-3">
          <p className="text-[10px] uppercase font-bold">Tổng số đơn hàng:</p>
          <p className="text-lg font-mono">{data.length} đơn</p>
        </div>
        <div className="border-b border-black p-3 bg-gray-50">
          <p className="text-[10px] uppercase font-bold text-blue-800">Doanh thu thực thu (Đã giao):</p>
          <p className="text-lg font-bold text-blue-800">{totalSales?.toLocaleString()} VNĐ</p>
        </div>
        <div className="border-r border-black p-3">
          <p className="text-[10px] uppercase font-bold">Đơn hàng hoàn thành:</p>
          <p className="text-sm font-mono">{deliveredOrders.length} / {data.length} đơn</p>
        </div>
        <div className="p-3">
          <p className="text-[10px] uppercase font-bold">Tỷ lệ hủy đơn:</p>
          <p className="text-sm font-mono">
            {Math.round((data.filter(o => o.status === 'Cancelled').length / data.length) * 100) || 0}%
          </p>
        </div>
      </div>

      {/* Bảng kê chi tiết */}
      <div className="mt-4">
        <p className="text-[11px] font-bold mb-2 uppercase">* Danh sách chi tiết các giao dịch:</p>
        <table className="w-full border-collapse border border-black text-[11px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2 w-10">STT</th>
              <th className="border border-black p-2">Mã đơn hàng</th>
              <th className="border border-black p-2">Khách hàng</th>
              <th className="border border-black p-2 text-center">PT Thanh toán</th>
              <th className="border border-black p-2 text-center">Trạng thái</th>
              <th className="border border-black p-2 text-right">Giá trị đơn</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={order._id} className="break-inside-avoid">
                <td className="border border-black p-2 text-center">{index + 1}</td>
                <td className="border border-black p-2 font-mono">{order._id.slice(-10).toUpperCase()}</td>
                <td className="border border-black p-2">{order.user?.name || 'Khách vãng lai'}</td>
                <td className="border border-black p-2 text-center capitalize">{order.paymentMethod || 'COD'}</td>
                <td className="border border-black p-2 text-center text-[9px] uppercase">{order.status}</td>
                <td className="border border-black p-2 text-right font-bold">{order.totalPrice?.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td colSpan="5" className="border border-black p-2 text-right uppercase">Tổng giá trị đơn hàng trong kỳ:</td>
              <td className="border border-black p-2 text-right text-blue-800">{totalSales?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/*  ký tên */}
      <div className="mt-12 grid grid-cols-2 gap-10 text-center">
        <div></div>
        <div className="flex flex-col items-center">
          <p className="text-sm italic mb-20">Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
          <p className="text-sm font-bold uppercase">Người lập báo cáo</p>
          <p className="text-[10px] text-gray-400 mt-1">(Ký và ghi rõ họ tên)</p>
        </div>
      </div>

      {/* Footer trang */}
      <div className="absolute bottom-10 left-0 right-0 text-center text-[9px] text-gray-400">
        Trang 1/1 - Tài liệu lưu trữ nội bộ The Aurora Fashion Shop
      </div>
    </div>
  )
})
