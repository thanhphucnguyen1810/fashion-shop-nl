import axios from 'axios'
import { useEffect, useState } from 'react'
import { Refresh, Download } from '@mui/icons-material'

const AdminLogPage = () => {
  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('userToken')
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/system/security-logs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLogs(Array.isArray(data) ? data : data.logs || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchLogs() }, [])

  const exportToCSV = () => {
    if (logs.length === 0) return alert('Không có dữ liệu!')

    const BOM = '\uFEFF'
    // Thêm cột Chi tiết để file CSV đầy đủ thông tin nhất
    let csvContent = BOM + 'Thời gian,Người thực hiện,Hành động,IP,Thiết bị đầy đủ,Trạng thái,Chi tiết hệ thống\n'

    logs.forEach(log => {
      const time = new Date(log.createdAt).toLocaleString('vi-VN')
      const name = log.userId?.name || 'Ẩn danh'
      // Để thiết bị nguyên bản trong dấu ngoặc kép để tránh lỗi xuống hàng trong CSV
      const device = log.userAgent || 'N/A'
      const details = log.details || ''
      csvContent += `"${time}","${name}","${log.action}","${log.ip}","${device}","${log.status}","${details}"\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `log_file_${new Date().toLocaleDateString()}.csv`
    link.click()
  }

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Nhật ký hệ thống</h1>
        <div className="flex gap-2">
          <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-all font-medium">
            <Refresh sx={{ fontSize: 18 }}/> Làm mới
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white shadow-sm transition-all font-medium">
            <Download sx={{ fontSize: 18 }}/> Xuất CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-700">
              <th className="p-4 font-bold w-[180px]">THỜI GIAN</th>
              <th className="p-4 font-bold w-[200px]">NGƯỜI THỰC HIỆN</th>
              <th className="p-4 font-bold text-center">HÀNH ĐỘNG</th>
              <th className="p-4 font-bold">IP</th>
              <th className="p-4 font-bold">THIẾT BỊ TRUY CẬP</th>
              <th className="p-4 font-bold text-center">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('vi-VN')}
                </td>
                <td className="p-4 font-medium text-gray-800">
                  {log.userId?.name || <span className="text-gray-400 italic">Ẩn danh</span>}
                  <div className="text-[10px] text-gray-400 font-normal">{log.userId?.email || ''}</div>
                </td>
                <td className="p-4 text-center">
                  <span className="font-semibold text-gray-600">{log.action}</span>
                </td>
                <td className="p-4">
                  <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {log.ip}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-600 leading-relaxed max-w-[400px]">
                  {/* Hiển thị nội dung đầy đủ nhưng giới hạn chiều rộng để bảng không quá dài */}
                  <div className="line-clamp-2 hover:line-clamp-none cursor-help" title={log.userAgent}>
                    {log.userAgent || 'Không có dữ liệu thiết bị'}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded text-[10px] font-bold text-white uppercase ${
                    log.status === 'SUCCESS' ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500 border-t pt-4">
        <div>Tổng số bản ghi: <b>{logs.length}</b></div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">&lt;</button>
          <span className="px-4 py-1 bg-gray-100 rounded font-bold text-gray-700">Trang 1</span>
          <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">&gt;</button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogPage
