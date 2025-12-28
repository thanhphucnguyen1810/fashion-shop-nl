import { Link } from 'react-router-dom'
import { useTheme, MenuItem, Select, FormControl, InputLabel, Button, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState, useRef } from 'react'
import { fetchAdminProducts } from '~/redux/slices/admin/adminProductSlice'
import { fetchAllOrders } from '~/redux/slices/admin/adminOrderSlice'
import {
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell
} from 'recharts'
import { ReportTemplate } from '~/components/Admin/ReportTemplate'
import { useReactToPrint } from 'react-to-print'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { FaPrint, FaFileExcel } from 'react-icons/fa'

const formatCurrency = (value) => `${value?.toLocaleString('vi-VN')}đ`

const AdminHomePage = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const dispatch = useDispatch()
  const [timeFrame, setTimeFrame] = useState('day')

  const reportRef = useRef(null)
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Bao-cao-doanh-thu-${timeFrame}`
  })

  const { products } = useSelector((state) => state.adminProducts)
  const { orders, totalSales, totalOrders, loading } = useSelector((state) => state.adminOrders)

  useEffect(() => {
    dispatch(fetchAdminProducts())
    dispatch(fetchAllOrders())
  }, [dispatch])


  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Báo cáo doanh thu')

    worksheet.columns = [
      { header: 'MÃ ĐƠN HÀNG', key: 'id', width: 20 },
      { header: 'NGÀY ĐẶT', key: 'date', width: 15 },
      { header: 'KHÁCH HÀNG', key: 'user', width: 20 },
      { header: 'SỐ ĐIỆN THOẠI', key: 'phone', width: 15 },
      { header: 'SỐ LƯỢNG', key: 'items', width: 12 },
      { header: 'THANH TOÁN', key: 'payment', width: 18 },
      { header: 'TỔNG TIỀN (VNĐ)', key: 'total', width: 20 },
      { header: 'TRẠNG THÁI', key: 'status', width: 20 }
    ]

    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }

    orders.forEach(o => {
      const row = worksheet.addRow({
        id: o._id.toUpperCase(),
        date: new Date(o.createdAt).toLocaleDateString('vi-VN'),
        user: o.user?.name || 'Khách vãng lai',
        phone: o.shippingAddress?.phone || o.user?.phone || 'N/A',
        items: o.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
        payment: o.paymentMethod || 'Thẻ/Tiền mặt',
        total: o.totalPrice,
        status: o.status === 'Delivered' ? 'Đã giao hàng' :
          o.status === 'Cancelled' ? 'Đã hủy' :
            o.status === 'InTransit' ? 'Đang giao' : 'Chờ xác nhận'
      })

      row.getCell('date').alignment = { horizontal: 'center' }
      row.getCell('items').alignment = { horizontal: 'center' }
      row.getCell('status').alignment = { horizontal: 'center' }
      row.getCell('total').numFmt = '#,##0"đ"'
    })

    const totalRowNumber = worksheet.rowCount + 1
    const totalRow = worksheet.getRow(totalRowNumber)
    totalRow.getCell('id').value = 'TỔNG CỘNG DOANH THU'
    totalRow.getCell('total').value = totalSales
    totalRow.font = { bold: true, size: 12 }

    worksheet.mergeCells(`A${totalRowNumber}:F${totalRowNumber}`)
    totalRow.getCell('id').alignment = { horizontal: 'right' }

    const buffer = await workbook.xlsx.writeBuffer()
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, `TheAurora_Revenue_${timeFrame}.xlsx`)
  }

  // Xử lý dữ liệu biểu đồ
  const processedData = useMemo(() => {
    if (!orders || orders.length === 0) return { revenueData: [], statusData: [] }

    const revenueMap = {}
    const statusMap = { 'AwaitingConfirmation': 0, 'InTransit': 0, 'Delivered': 0, 'Cancelled': 0 }
    const now = new Date()

    orders.forEach(order => {
      if (statusMap[order.status] !== undefined) statusMap[order.status]++
      if (order.status !== 'Delivered') return

      const date = new Date(order.createdAt)
      let label = ''
      let sortValue = 0 // Dùng để sắp xếp chính xác

      if (timeFrame === 'day') {
        label = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        // sortValue là YYYYMMDD (ví dụ 20241225)
        sortValue = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
      }
      else if (timeFrame === 'month' && date.getFullYear() === now.getFullYear()) {
        label = `Tháng ${date.getMonth() + 1}`
        sortValue = date.getMonth() // 0 - 11
      }
      else if (timeFrame === 'quarter') {
        const quarter = Math.floor(date.getMonth() / 3) + 1
        label = `Quý ${quarter}/${date.getFullYear()}`
        sortValue = date.getFullYear() * 10 + quarter // ví dụ 20241, 20242
      }
      else if (timeFrame === 'year') {
        label = `${date.getFullYear()}`
        sortValue = date.getFullYear()
      }

      if (label) {
        if (!revenueMap[label]) {
          revenueMap[label] = { name: label, revenue: 0, sortValue: sortValue }
        }
        revenueMap[label].revenue += order.totalPrice
      }
    })

    return {
      revenueData: Object.values(revenueMap),
      statusData: [
        { name: 'Chờ xác nhận', value: statusMap['AwaitingConfirmation'], color: '#f59e0b' },
        { name: 'Đang giao', value: statusMap['InTransit'], color: '#3b82f6' },
        { name: 'Đã giao', value: statusMap['Delivered'], color: '#10b981' },
        { name: 'Đã hủy', value: statusMap['Cancelled'], color: '#ef4444' }
      ]
    }
  }, [orders, timeFrame])

  const revenueDataSorted = useMemo(() => {
    const data = [...processedData.revenueData]

    if (timeFrame === 'day') {
      return data.sort((a, b) => a.sortValue - b.sortValue)
    }


    if (timeFrame === 'month') {
      return data.sort((a, b) => {
        const monthA = Number(a.name.replace('Tháng ', ''))
        const monthB = Number(b.name.replace('Tháng ', ''))
        return monthA - monthB
      })
    }

    if (timeFrame === 'quarter') {
      return data.sort((a, b) => {
        const [qA, yA] = a.name.replace('Quý ', '').split('/').map(Number)
        const [qB, yB] = b.name.replace('Quý ', '').split('/').map(Number)
        return yA !== yB ? yA - yB : qA - qB
      })
    }

    if (timeFrame === 'year') {
      return data.sort((a, b) => Number(a.name) - Number(b.name))
    }

    return data.sort((a, b) => a.sortValue - b.sortValue)
  }, [processedData.revenueData, timeFrame])


  if (loading) return <div className="p-10 text-center font-bold">Đang tải dữ liệu...</div>

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng Quan Doanh Thu</h1>
          <p className="text-gray-500 italic text-sm">Quản lý và xuất báo cáo kinh doanh hệ thống</p>
        </div>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Nút In & Excel */}
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<FaFileExcel />}
            onClick={exportToExcel}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Xuất Excel
          </Button>

          <Button
            variant="contained"
            color="inherit"
            size="small"
            startIcon={<FaPrint />}
            onClick={handlePrint}
            sx={{ borderRadius: '8px', textTransform: 'none', bgcolor: isDark ? '#374151' : '#f3f4f6', color: isDark ? '#fff' : '#000' }}
          >
            In phiếu
          </Button>

          {/* Bộ lọc thời gian */}
          <FormControl variant="outlined" size="small" className="w-36">
            <InputLabel>Xem theo</InputLabel>
            <Select
              value={timeFrame}
              label="Xem theo"
              onChange={(e) => setTimeFrame(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="day">Theo Ngày</MenuItem>
              <MenuItem value="month">Theo Tháng</MenuItem>
              <MenuItem value="quarter">Theo Quý</MenuItem>
              <MenuItem value="year">Theo Năm</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </div>

      {/* Grid Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className="text-lg font-bold mb-6 text-blue-500">Biểu đồ doanh thu</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueDataSorted}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v/1000000}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className="text-lg font-bold mb-6 text-purple-500">Đơn hàng</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processedData.statusData}>
              <Bar dataKey="value">
                {processedData.statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Bar>
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="mt-4 space-y-1">
            {processedData.statusData.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs font-medium">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <p className="text-xs font-bold opacity-60 uppercase">Tổng đơn</p>
          <p className="text-2xl font-black">{totalOrders}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800' : 'bg-purple-50'}`}>
          <p className="text-xs font-bold opacity-60 uppercase">Sản phẩm</p>
          <p className="text-2xl font-black">{products.length}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800' : 'bg-green-50'}`}>
          <p className="text-xs font-bold opacity-60 uppercase">Doanh thu</p>
          <p className="text-2xl font-black text-green-600">{formatCurrency(totalSales)}</p>
        </div>
      </div>

      {/* Bảng các đơn hàng gần đây */}
      <div className={`mt-8 p-6 rounded-xl shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>
          <Link to="/admin/orders" className="text-blue-500 text-sm hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <th className="p-3 text-gray-500 font-medium">Mã đơn</th>
                <th className="p-3 text-gray-500 font-medium">Khách hàng</th>
                <th className="p-3 text-gray-500 font-medium">Ngày đặt</th>
                <th className="p-3 text-gray-500 font-medium">Tổng tiền</th>
                <th className="p-3 text-gray-500 font-medium">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order._id} className={`border-b last:border-0 ${isDark ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="p-3 font-mono text-xs text-blue-500">#{order._id.slice(-8)}</td>
                  <td className="p-3">{order.user?.name || 'Guest'}</td>
                  <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="p-3 font-semibold">{formatCurrency(order.totalPrice)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Template ẩn để in */}
      <div style={{ display: 'none' }}>
        <ReportTemplate
          ref={reportRef}
          data={orders}
          timeFrame={timeFrame}
          totalSales={totalSales}
        />
      </div>
    </div>
  )
}

export default AdminHomePage
