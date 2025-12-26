import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { toast } from 'sonner'
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  clearAddressStatus
} from '~/redux/slices/addressSlice'

const AddressManager = () => {
  const dispatch = useDispatch()

  const { list: addresses, loading, error, success } = useSelector((state) => state.address)

  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: ''
  })


  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      dispatch(clearAddressStatus())
    }
    if (error) {
      toast.error(error)
      dispatch(clearAddressStatus())
    }
  }, [success, error, dispatch])


  // --- Mở Form Thêm/Sửa ---
  const handleOpenForm = (addr = null) => {
    setEditing(addr)
    setForm(
      addr || {
        name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: ''
      }
    )
    setOpenForm(true)
  }

  // --- Submit Form (Thay thế handleSubmit local) ---
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editing) {
        await dispatch(updateAddress({ id: editing._id, updatedData: form })).unwrap()
        toast.success('Cập nhật địa chỉ thành công!')
      } else {
        await dispatch(addAddress(form)).unwrap()
        toast.success('Thêm địa chỉ mới thành công!')
      }

      setOpenForm(false)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Lỗi khi lưu địa chỉ!')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa địa chỉ này?')) return
    try {
      await dispatch(deleteAddress(id)).unwrap()
      toast.success('Đã xóa địa chỉ')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Không thể xóa')
    }
  }

  // --- Đặt làm địa chỉ mặc định (Thay thế handleSetDefault local) ---
  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap()
      toast.success('Đã đặt làm địa chỉ mặc định!')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Không thể đặt mặc định')
    }
  }

  if (loading && addresses.length === 0) {
    return <Box className="p-6">Đang tải danh sách địa chỉ...</Box>
  }

  return (
    <Box className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Số địa chỉ</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => handleOpenForm(null)}
        >
          {loading ? 'Đang xử lý...' : '+ Thêm địa chỉ mới'}
        </button>
      </div>

      {/* Danh sách địa chỉ */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          // ... (Phần hiển thị list address giữ nguyên)
          <div
            key={addr._id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{addr.name}</p>
              <p>{addr.phone}</p>
              <p>
                {addr.street}, {addr.ward}, {addr.district}, {addr.province}
              </p>

              {addr.isDefault && (
                <span className="text-xs px-2 py-1 bg-green-200 rounded">
                  Mặc định
                </span>
              )}
            </div>

            <div className="space-x-3">
              {!addr.isDefault && (
                <button
                  className="text-blue-600 font-semibold"
                  onClick={() => handleSetDefault(addr._id)}
                >
                  Chọn làm mặc định
                </button>
              )}

              <button
                className="text-yellow-600"
                onClick={() => handleOpenForm(addr)}
              >
                Chỉnh sửa
              </button>

              <button
                className="text-red-600"
                onClick={() => handleDelete(addr._id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {openForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/30 backdrop-blur-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl w-[450px] space-y-4 shadow-2xl border border-white/50"
          >
            <div className="border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Vui lòng nhập chính xác thông tin để nhận hàng nhanh nhất.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tên người nhận"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tỉnh/Thành phố"
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Quận/Huyện"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                />
                <input
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Xã/Phường"
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                />
              </div>

              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Số nhà, tên đường"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                onClick={() => setOpenForm(false)}
              >
        Hủy
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-blue-300 transition-all"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : (editing ? 'Lưu thay đổi' : 'Thêm mới')}
              </button>
            </div>
          </form>
        </div>
      )}
    </Box>
  )
}

export default AddressManager
