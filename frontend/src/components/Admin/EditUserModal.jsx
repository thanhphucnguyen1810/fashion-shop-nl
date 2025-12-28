import { FaTimes } from 'react-icons/fa'
import { useTheme, alpha } from '@mui/material/styles'
import { useState, useRef, useEffect } from 'react'

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const theme = useTheme()
  const modalRef = useRef()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    gender: 'other',
    avatar: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        gender: user.gender || 'other',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    setFormData(prev => ({
      ...prev,
      avatarFile: file,
      avatarPreview: previewUrl
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, role, gender, avatarFile } = formData

    // Gửi dữ liệu cập nhật
    onUpdate(user._id, { name, email, role, gender, avatarFile })

    if (formData.avatarPreview) {
      URL.revokeObjectURL(formData.avatarPreview)
    }

    onClose()
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
        style={{ backgroundColor: theme.palette.background.paper }}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>

        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Các input name, email, password, role, gender */}
          <div>
            <label className="block mb-1">Tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`} required />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`} required />
          </div>

          <div>
            <label className="block mb-1">Mật khẩu (để trống nếu không đổi)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`} />
          </div>

          <div>
            <label className="block mb-1">Vai trò</label>
            <select name="role" value={formData.role} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`}>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Giới tính</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Avatar</label>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {uploading && <p className="text-sm text-gray-500 mt-1">Đang tải lên...</p>}

            {/* LOGIC HIỂN THỊ */}
            {/* Ưu tiên: 1. Ảnh preview mới -> 2. Ảnh cũ từ database -> 3. Ảnh mặc định */}

            {(() => {
              const defaultAvatar = 'https://res.cloudinary.com/dgec7q298/image/upload/v1/default_avatar.png'

              // 1. Ảnh Preview
              const displayUrl = formData.avatarPreview
              // 2. Ảnh cũ từ Backend
                ? formData.avatarPreview
                : (formData.avatar?.url || defaultAvatar)

              return (
                displayUrl && (
                  <img
                    src={displayUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-full mt-2 object-cover"
                  />
                )
              )
            })()}
          </div>

          <button type="submit" className="w-full py-2 px-4 rounded hover:opacity-90" style={{ backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText }}>
            Cập nhật người dùng
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
