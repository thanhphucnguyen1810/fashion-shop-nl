import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

import SaveIcon from '@mui/icons-material/Save'

import { setUser } from '~/redux/slices/authSlice'

const UpdateProfile = ({ theme }) => {

  const { user, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [avatarFile, setAvatarFile] = useState(null)
  const [name, setName] = useState(user?.name || '')
  const [gender, setGender] = useState(user?.gender || 'other')

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const userToken = token

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    setName(user?.name || '')
    setGender(user?.gender || 'other')
  }, [user, navigate])

  const handleUpdateProfile = async () => {
    if (!user || !userToken) return

    const formData = new FormData()

    formData.append('name', name)
    formData.append('gender', gender)

    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const updatedUser = res.data

      dispatch(setUser({ user: updatedUser, token: userToken }))

      setAvatarFile(null)

      toast.success('Cập nhật profile thành công!', { duration: 1000 })
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật thất bại. Vui lòng kiểm tra console.', { duration: 1000 })
    }
  }

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('Vui lòng nhập đầy đủ thông tin')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp')
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/change-password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success('Đổi mật khẩu thành công!')

      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu')
    }
  }

  if (!user) return null

  return (
    <>
      <div className='p-6'>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-3" style={{ borderColor: theme.palette.divider }}>
            <h2 className="text-xl font-semibold" style={{ color: theme.palette.text.primary }}>Thông tin cá nhân</h2>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showPasswordForm ? 'bg-gray-500 text-white' : 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
              }`}
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Hủy bỏ' : 'Đổi mật khẩu'}
            </button>
          </div>

          {/* Form đổi mật khẩu: Chỉ hiện khi showPasswordForm === true */}
          {showPasswordForm && (
            <div className='mt-4 p-6 border rounded-xl bg-gray-50/50 shadow-inner transition-all'
              style={{ borderColor: theme.palette.divider }}>

              <h2 className='text-lg font-bold mb-6 flex items-center gap-2' style={{ color: theme.palette.text.primary }}>
                <i className="fa-solid fa-shield-halved bg-blue-600"></i> Thiết lập mật khẩu mới
              </h2>

              <div className="space-y-4">
                {/* Mật khẩu cũ */}
                <div>
                  <label className='block text-sm mb-1 font-medium' style={{ color: theme.palette.text.secondary }}>Mật khẩu hiện tại</label>
                  <input
                    type='password'
                    placeholder="Nhập mật khẩu cũ"
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:bg-blue-600 outline-none transition-all'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  />
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className='block text-sm mb-1 font-medium' style={{ color: theme.palette.text.secondary }}>Mật khẩu mới</label>
                  <input
                    type='password'
                    placeholder="Tối thiểu 6 ký tự"
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:bg-blue-600 outline-none transition-all'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  />
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                  <label className='block text-sm mb-1 font-medium' style={{ color: theme.palette.text.secondary }}>Xác nhận mật khẩu mới</label>
                  <input
                    type='password'
                    placeholder="Nhập lại mật khẩu mới"
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:bg-blue-600 outline-none transition-all'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  />
                </div>

                {/* Nút thực thi */}
                <button
                  onClick={handleChangePassword}
                  className='w-full py-3 mt-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex justify-center items-center gap-2'
                >
                  <i className="fa-solid fa-circle-check"></i> Xác nhận cập nhật
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Tên hiển thị</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
            style={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider
            }}
          />
        </div>

        {/* Email Display */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Email (Không thể thay đổi)</label>
          <input
            type='email'
            value={user?.email || ''}
            disabled
            className='w-full p-3 border rounded-lg cursor-not-allowed'
            style={{
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider
            }}
          />
        </div>

        {/* Gender Select */}
        <div className='mb-6'>
          <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Giới tính</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
            style={{
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider
            }}
          >
            <option value='male'>Nam</option>
            <option value='female'>Nữ</option>
            <option value='other'>Khác</option>
          </select>
        </div>

        {/* Thêm đoạn này vào trên phần Name Input */}
        <div className='mb-6 flex flex-col items-center'>
          <label className='block text-sm font-medium mb-2' style={{ color: theme.palette.text.secondary }}>
    Ảnh đại diện
          </label>

          <div className='relative group'>
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : (user?.avatar?.url || 'https://via.placeholder.com/150')}
              alt="Avatar Preview"
              className='w-24 h-24 rounded-full object-cover border-4'
              style={{ borderColor: theme.palette.divider }}
            />
            <label
              htmlFor="avatar-upload"
              className='absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition'
            >
              <i className="fa-solid fa-camera text-white text-xs"></i>
            </label>
            <input
              id="avatar-upload"
              type='file'
              accept='image/*'
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className='hidden'
            />
          </div>
          <p className='text-[10px] mt-2 text-gray-400'>Nhấn vào icon để đổi ảnh</p>
        </div>

        <button
          onClick={handleUpdateProfile}
          className='w-full py-3 px-4 rounded-lg font-bold transition duration-300 flex items-center justify-center space-x-2'
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <SaveIcon />
          <span>Cập nhật Profile</span>
        </button>
      </div>
    </>
  )
}

export default UpdateProfile
