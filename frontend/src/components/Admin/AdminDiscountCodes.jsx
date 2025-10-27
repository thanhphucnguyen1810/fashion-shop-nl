import React, { useState } from 'react'
import { FaTrash, FaPlus } from 'react-icons/fa'
import { useTheme } from '@mui/material/styles'

const AdminDiscountCodes = () => {
  const theme = useTheme()

  const [codes, setCodes] = useState([
    {
      id: 1,
      code: 'SAVE10',
      type: 'percent',
      discount: 10,
      minOrder: 0,
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      useForAll: true,
      allowedUsers: [],
      description: 'Giảm 10% cho đơn hàng'
    },
    {
      id: 2,
      code: 'FREESHIP',
      type: 'amount',
      discount: 0,
      minOrder: 100,
      startDate: '2025-06-05',
      endDate: '2025-07-05',
      useForAll: true,
      allowedUsers: [],
      description: 'Miễn phí vận chuyển cho đơn hàng trên 100'
    }
  ])

  const [newCode, setNewCode] = useState('')
  const [newType, setNewType] = useState('percent')
  const [newDiscount, setNewDiscount] = useState('')
  const [newMinOrder, setNewMinOrder] = useState('')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [useForAll, setUseForAll] = useState(true)
  const [allowedUsers, setAllowedUsers] = useState('')
  const [newDesc, setNewDesc] = useState('')

  // TODO: useEffect gọi API backend để load danh sách mã giảm giá khi component mount
  // useEffect(() => {
  //   fetch('/api/discount-codes')
  //     .then(res => res.json())
  //     .then(data => setCodes(data))
  //     .catch(err => console.error('Failed to load discount codes', err))
  // }, [])

  const addCode = () => {
    if (!newCode.trim()) return alert('Vui lòng nhập mã giảm giá')
    if (newDiscount === '' || isNaN(newDiscount)) return alert('Vui lòng nhập giá trị giảm hợp lệ')
    if (!newStartDate || !newEndDate) return alert('Vui lòng chọn ngày bắt đầu và kết thúc')
    if (newEndDate < newStartDate) return alert('Ngày kết thúc phải sau ngày bắt đầu')
    if (!useForAll && !allowedUsers.trim()) return alert('Vui lòng nhập email người dùng hoặc chọn "Tất cả người dùng"')

    // TODO: Gọi API backend để tạo mới mã giảm giá
    /*
    fetch('/api/discount-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCode.toUpperCase(),
        type: newType,
        discount: Number(newDiscount),
        minOrder: Number(newMinOrder) || 0,
        startDate: newStartDate,
        endDate: newEndDate,
        useForAll,
        allowedUsers: allowedUsers
          .split(',')
          .map(email => email.trim())
          .filter(email => email.length > 0),
        description: newDesc
      })
    })
      .then(res => res.json())
      .then(newCodeFromServer => {
        setCodes([...codes, newCodeFromServer]) // Thêm mã mới do server trả về
      })
      .catch(err => alert('Không thể thêm mã giảm giá'))
    */

    const id = codes.length ? codes[codes.length - 1].id + 1 : 1
    setCodes([
      ...codes,
      {
        id,
        code: newCode.toUpperCase(),
        type: newType,
        discount: Number(newDiscount),
        minOrder: Number(newMinOrder) || 0,
        startDate: newStartDate,
        endDate: newEndDate,
        useForAll,
        allowedUsers: allowedUsers
          .split(',')
          .map(email => email.trim())
          .filter(email => email.length > 0),
        description: newDesc
      }
    ])

    setNewCode('')
    setNewType('percent')
    setNewDiscount('')
    setNewMinOrder('')
    setNewStartDate('')
    setNewEndDate('')
    setUseForAll(true)
    setAllowedUsers('')
    setNewDesc('')
  }

  const deleteCode = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá mã giảm giá này không?')) {
      // TODO: Gọi API backend để xoá mã giảm giá
      // fetch(/api/discount-codes/${id}, { method: 'DELETE' })
      //   .then(res => {
      //     if (res.ok) setCodes(codes.filter(c => c.id !== id))
      //     else alert('Không thể xoá mã giảm giá')
      //   })
      //   .catch(() => alert('Không thể xoá mã giảm giá'))
      setCodes(codes.filter(c => c.id !== id))
    }
  }

  const inputStyle = {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`
  }

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ color: theme.palette.text.primary }}>
      <h2 className="text-3xl font-bold mb-6 text-center">Quản lý mã giảm giá</h2>

      <div
        className="rounded p-6 mb-10 shadow-md"
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <h3 className="text-xl font-semibold mb-4">Tạo mã giảm giá mới</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Mã giảm giá *</label>
            <input
              type="text"
              value={newCode}
              onChange={e => setNewCode(e.target.value.toUpperCase())}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Loại giảm giá *</label>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            >
              <option value="percent">Theo phần trăm (%)</option>
              <option value="amount">Số tiền cố định</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Giá trị giảm *</label>
            <input
              type="number"
              value={newDiscount}
              onChange={e => setNewDiscount(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Đơn hàng tối thiểu</label>
            <input
              type="number"
              value={newMinOrder}
              onChange={e => setNewMinOrder(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Ngày bắt đầu *</label>
            <input
              type="date"
              value={newStartDate}
              onChange={e => setNewStartDate(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Ngày kết thúc *</label>
            <input
              type="date"
              value={newEndDate}
              onChange={e => setNewEndDate(e.target.value)}
              className="w-full rounded px-3 py-2"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Ai có thể sử dụng mã này? *</label>
          <div className="flex items-center space-x-6 mb-2">
            <label className="inline-flex items-center">
              <input type="radio" checked={useForAll} onChange={() => setUseForAll(true)} className="mr-2" />
              Tất cả người dùng
            </label>
            <label className="inline-flex items-center">
              <input type="radio" checked={!useForAll} onChange={() => setUseForAll(false)} className="mr-2" />
              Người dùng cụ thể
            </label>
          </div>
          {!useForAll && (
            <textarea
              value={allowedUsers}
              onChange={e => setAllowedUsers(e.target.value)}
              className="w-full rounded px-3 py-2"
              rows={3}
              style={inputStyle}
            />
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Mô tả</label>
          <textarea
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full rounded px-3 py-2"
            rows={2}
            style={inputStyle}
          />
        </div>

        <button
          onClick={addCode}
          className="w-full text-white font-semibold py-3 rounded transition-colors"
          style={{ backgroundColor: theme.palette.success.main }}
        >
          <FaPlus className="inline mr-2" /> Thêm mã giảm giá
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full border-collapse shadow-sm text-sm" style={{ color: theme.palette.text.primary }}>
          <thead style={{ backgroundColor: theme.palette.background.neutral }}>
            <tr>
              {['ID', 'Mã', 'Loại', 'Giảm', 'Đơn hàng tối thiểu', 'Ngày bắt đầu', 'Ngày kết thúc', 'Người dùng được phép', 'Mô tả', 'Hành động'].map((header) => (
                <th key={header} className="border p-3 text-center" style={{ borderColor: theme.palette.divider }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center" style={{ color: theme.palette.text.secondary }}>
                  Chưa có mã giảm giá nào
                </td>
              </tr>
            ) : (
              codes.map(({ id, code, type, discount, minOrder, startDate, endDate, useForAll, allowedUsers, description }) => (
                <tr key={id} style={{ backgroundColor: theme.palette.background.paper }}>
                  {[id, code, type === 'percent' ? 'Theo phần trăm (%)' : 'Số tiền cố định', discount, minOrder, startDate, endDate, useForAll ? 'Tất cả người dùng' : allowedUsers.join(', '), description].map((val, i) => (
                    <td key={i} className="border p-2 text-center" style={{ borderColor: theme.palette.divider }}>
                      {val}
                    </td>
                  ))}
                  <td className="border p-2 text-center" style={{ borderColor: theme.palette.divider }}>
                    <button
                      onClick={() => deleteCode(id)}
                      style={{ color: theme.palette.error.main }}
                      title="Xoá mã giảm giá này"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDiscountCodes
