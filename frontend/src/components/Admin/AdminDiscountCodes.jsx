import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCoupons,
  createCouponThunk,
  updateCouponThunk,
  deleteCouponThunk,
  clearAdminError
} from '~/redux/slices/admin/adminCouponSlice'
import { toast } from 'sonner'

// Simple Modal (no external lib) using portal
const Modal = ({ open, title, onClose, children }) => {
  const theme = useTheme()
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl mx-4 rounded-lg shadow-lg p-6 bg-white dark:bg-gray-800"
        style={{ border: `1px solid ${theme.palette.divider}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={onClose}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  )
}

const AdminDiscountCodes = () => {
  const theme = useTheme()
  const dispatch = useDispatch()

  // safe selector in case reducer name changes
  const adminCouponsState = useSelector((state) => state.adminCoupons || state.coupons || {})
  const { coupons = [], loading = false, globalError = null, formSuccess = null } = adminCouponsState

  // filters / ui
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all') // all | percentage | fixed_amount
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  // form fields
  const emptyForm = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '',
    expiresAt: '',
    useForSpecificUsers: false,
    allowedUsers: '',
    description: ''
  }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    dispatch(fetchCoupons())
  }, [dispatch])

  useEffect(() => {
    if (globalError) {
      toast.error(globalError)
      dispatch(clearAdminError())
    }
    if (formSuccess) {
      toast.success(formSuccess)
      dispatch(clearAdminError())
      // refresh list after success
      dispatch(fetchCoupons())
      setIsModalOpen(false)
      setIsEditMode(false)
      setEditingCoupon(null)
      setForm(emptyForm)
    }
  }, [globalError, formSuccess, dispatch])

  // Helpers
  const openCreateModal = () => {
    setForm(emptyForm)
    setIsEditMode(false)
    setEditingCoupon(null)
    setIsModalOpen(true)
  }

  const openEditModal = (coupon) => {
    setForm({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue ?? '',
      minimumOrderAmount: coupon.minimumOrderAmount ?? '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : '',
      useForSpecificUsers: coupon.useForSpecificUsers || false,
      allowedUsers: (coupon.allowedUsers || []).join(', '),
      description: coupon.description || ''
    })
    setIsEditMode(true)
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
  // Basic validation
    if (!form.code.trim()) return toast.error('Vui lòng nhập mã')

    const discountValueNum = Number(form.discountValue)
    if (isNaN(discountValueNum) || discountValueNum <= 0) return toast.error('Giá trị giảm không hợp lệ')

    const minimumOrderNum = Number(form.minimumOrderAmount) || 0
    if (minimumOrderNum < 0) return toast.error('Đơn tối thiểu không hợp lệ')

    if (!form.expiresAt) return toast.error('Vui lòng chọn ngày hết hạn')

    const expiresDate = new Date(form.expiresAt)
    const now = new Date()
    if (expiresDate < now) return toast.error('Ngày hết hạn phải ở trong tương lai')

    //Chuẩn bị payload
    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType === 'fixed_amount' ? 'fixed' : form.discountType,
      discountValue: discountValueNum,
      minimumOrderAmount: minimumOrderNum,
      expiresAt: form.expiresAt,
      isActive: true,
      usageLimit: Number(form.usageLimit) || 0,
      useForSpecificUsers: form.useForSpecificUsers,
      allowedUsers: form.useForSpecificUsers
        ? form.allowedUsers.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      description: form.description || ''
    }

    //Dispatch action
    if (isEditMode && editingCoupon) {
      dispatch(updateCouponThunk({ ...payload, _id: editingCoupon._id }))
    } else {
      dispatch(createCouponThunk(payload))
    }
  }


  const handleDelete = (id) => {
    toast.error('Bạn có chắc muốn xoá mã giảm giá này?', {
      action: {
        label: 'Xác nhận xóa',
        onClick: () => dispatch(deleteCouponThunk(id))
      },
      duration: 8000
    })
  }

  const filtered = coupons
    .filter(c => {
      if (!c) return false
      if (filterType !== 'all' && c.discountType !== filterType) return false
      if (!search) return true
      const s = search.toLowerCase()
      return (c.code || '').toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s)
    })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản Lý Mã Giảm Giá</h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border px-4 py-2 pr-28 shadow-sm"
              placeholder="Tìm theo mã hoặc mô tả..."
              style={{ borderColor: theme.palette.divider }}
            />
            <button
              onClick={() => dispatch(fetchCoupons())}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full"
            >
        Tìm
            </button>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded px-3 py-2 border"
            style={{ borderColor: theme.palette.divider }}
          >
            <option value="all">Tất cả loại</option>
            <option value="percentage">Theo phần trăm (%)</option>
            <option value="fixed">Số tiền cố định</option>
          </select>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
      + Thêm mã giảm giá
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="rounded-lg overflow-hidden shadow">
        <table className="w-full bg-white dark:bg-gray-800">
          <thead className="text-sm uppercase bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Mã</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Giảm</th>
              <th className="p-3">Đơn tối thiểu</th>
              <th className="p-3">Hết hạn</th>
              <th className="p-3">Người dùng</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-6 text-center">Đang tải...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-center text-gray-500">Không có mã giảm giá</td></tr>
            ) : (
              filtered.map(coupon => (
                <tr key={coupon._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">{coupon.code}</td>
                  <td className="p-3 text-center">{coupon.discountType === 'percentage' ? '%': '₫'}</td>
                  <td className="p-3 text-center">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : 'đ'}</td>
                  <td className="p-3 text-center">{coupon.minimumOrderAmount ?? 0}đ</td>
                  <td className="p-3 text-center">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="p-3 text-center">{coupon.useForSpecificUsers ? (coupon.allowedUsers || []).join(', ') : 'Tất cả'}</td>
                  <td className="p-3">{coupon.description}</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => openEditModal(coupon)} className="px-3 py-1 rounded bg-yellow-500 text-white">Sửa</button>
                    <button onClick={() => handleDelete(coupon._id)} className="px-3 py-1 rounded bg-red-500 text-white">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Hiển thị <strong>{filtered.length}</strong> kết quả</div>
        <div>Trang 1 / 1</div>
      </div>

      {/* Modal form */}
      <Modal open={isModalOpen} title={isEditMode ? 'Cập nhật mã giảm giá' : 'Tạo mã giảm giá'} onClose={() => setIsModalOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Mã</label>
            <input value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))} className="w-full rounded px-3 py-2 border" style={{ borderColor: theme.palette.divider }} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Loại</label>
            <select value={form.discountType} onChange={(e) => setForm(prev => ({ ...prev, discountType: e.target.value }))} className="w-full rounded px-3 py-2 border" style={{ borderColor: theme.palette.divider }}>
              <option value="percentage">Theo phần trăm</option>
              <option value="fixed_amount">Số tiền cố định</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Giá trị</label>
            <input value={form.discountValue} onChange={(e) => setForm(prev => ({ ...prev, discountValue: e.target.value }))} type="number" className="w-full rounded px-3 py-2 border" style={{ borderColor: theme.palette.divider }} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Đơn hàng tối thiểu</label>
            <input value={form.minimumOrderAmount} onChange={(e) => setForm(prev => ({ ...prev, minimumOrderAmount: e.target.value }))} type="number" className="w-full rounded px-3 py-2 border" style={{ borderColor: theme.palette.divider }} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Ngày hết hạn</label>
            <input value={form.expiresAt} onChange={(e) => setForm(prev => ({ ...prev, expiresAt: e.target.value }))} type="date" className="w-full rounded px-3 py-2 border" style={{ borderColor: theme.palette.divider }} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Áp dụng cho</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center"><input type="radio" checked={!form.useForSpecificUsers} onChange={() => setForm(prev => ({ ...prev, useForSpecificUsers: false, allowedUsers: '' }))} className="mr-2" />Tất cả</label>
              <label className="inline-flex items-center"><input type="radio" checked={form.useForSpecificUsers} onChange={() => setForm(prev => ({ ...prev, useForSpecificUsers: true }))} className="mr-2" />Người dùng cụ thể</label>
            </div>
            {form.useForSpecificUsers && (
              <textarea value={form.allowedUsers} onChange={(e) => setForm(prev => ({ ...prev, allowedUsers: e.target.value }))} className="w-full mt-2 rounded px-3 py-2 border" placeholder="email1, email2" style={{ borderColor: theme.palette.divider }} rows={2}></textarea>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full rounded px-3 py-2 border" rows={3} style={{ borderColor: theme.palette.divider }} />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">Huỷ</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded bg-green-600 text-white">{isEditMode ? 'Cập nhật' : 'Tạo mới'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDiscountCodes
