import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { resetPassword, clearResetStatus } from '~/redux/slices/authSlice'
import login from '~/assets/login.webp'

const ResetPasswordPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useParams()

  const { resetLoading, resetSuccess, error, user } = useSelector((state) => state.auth)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState(null)

  // Clear trạng thái (Đã sửa: Bỏ logic chuyển hướng dựa trên 'user')
  useEffect(() => {
    return () => {
      dispatch(clearResetStatus())
    }
  }, [dispatch])


  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError(null)

    if (!password || !confirmPassword) {
      return setLocalError('Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.')
    }
    if (password.length < 8) {
      return setLocalError('Mật khẩu phải có ít nhất 8 ký tự.')
    }
    if (password !== confirmPassword) {
      return setLocalError('Xác nhận mật khẩu không khớp.')
    }

    // Dispatch action đặt lại mật khẩu
    dispatch(resetPassword({ token, password }))
  }

  // Xử lý thành công
  useEffect(() => {
    if (resetSuccess) {
      // Chuyển hướng về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }
  }, [resetSuccess, navigate])

  // BỎ HẲN HÀM AuthLayout NỘI BỘ VÀ TRẢ VỀ CẤU TRÚC LAYOUT TRỰC TIẾP
  return (
    <div
      className='flex min-h-screen'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* Cột 1: Form */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md p-8 rounded-lg border shadow-sm'
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider
          }}
        >
          <h2 className='text-2xl font-bold text-center mb-6'>Đặt lại Mật Khẩu</h2>

          {/* Hiển thị thông báo thành công */}
          {resetSuccess ? (
            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'>
              <strong className='font-bold'>Thành công!</strong>
              <span className='block sm:inline'> Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang Đăng nhập sau giây lát.</span>
            </div>
          ) : (
            <>
              {/* Hiển thị lỗi từ backend hoặc lỗi local */}
              {(error || localError) && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm'>
                  {error || localError}
                  {error && (
                    <p className='mt-2'>
                      <Link to='/forgot-password' className='font-semibold hover:underline' style={{ color: theme.palette.secondary.main }}>
                        Thử gửi lại yêu cầu đặt lại mật khẩu.
                      </Link>
                    </p>
                  )}
                </div>
              )}

              {/* Mật khẩu mới */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-2'>Mật khẩu mới</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full p-2 border rounded focus:ring-2 focus:outline-none'
                  placeholder='Nhập mật khẩu mới'
                  style={{
                    backgroundColor: theme.palette.background.default,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary
                  }}
                />
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>Xác nhận Mật khẩu mới</label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full p-2 border rounded focus:ring-2 focus:outline-none'
                  placeholder='Xác nhận mật khẩu mới'
                  style={{
                    backgroundColor: theme.palette.background.default,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={resetLoading}
                className='w-full p-2 rounded-lg font-semibold transition hover:opacity-90'
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                {resetLoading ? 'Đang đặt lại...' : 'Cập nhật Mật khẩu'}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Cột 2: Hình ảnh */}
      <div
        className='hidden md:block w-1/2'
        style={{ backgroundColor: theme.palette.background.neutral }}
      >
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt='Đặt lại mật khẩu'
            className='h-[750px] w-full object-cover rounded-l-2xl shadow-lg'
          />
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
