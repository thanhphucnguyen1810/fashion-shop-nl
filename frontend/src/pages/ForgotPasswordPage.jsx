import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { forgotPassword, clearForgotStatus } from '~/redux/slices/authSlice'
import login from '~/assets/login.webp'
import { IoIosArrowBack } from 'react-icons/io'

const ForgotPasswordPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { forgotLoading, forgotSuccess, error } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')

  // Clear trạng thái khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearForgotStatus())
    }
  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return alert('Vui lòng nhập email!')
    dispatch(forgotPassword(email))
  }

  // Xử lý quay lại trang trước
  const handleGoBack = () => {
    navigate(-1)
  }

  // **LOẠI BỎ HÀM AuthLayout VÀ TRẢ VỀ LAYOUT TRỰC TIẾP**
  return (
    <div
      className='flex min-h-screen relative' // Giữ lại 'relative' để nút "Quay lại" hoạt động
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* ===================== NÚT QUAY LẠI TRANG TRƯỚC ===================== */}
      <button
        onClick={handleGoBack}
        className='absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-1 text-sm font-semibold p-2 rounded hover:opacity-80 transition'
        style={{ color: theme.palette.text.secondary }}
      >
        <IoIosArrowBack className='text-lg' />
       Quay lại
      </button>
      {/* ==================================================================== */}

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
          <h2 className='text-2xl font-bold text-center mb-6'>Quên Mật Khẩu</h2>

          {/* Hiển thị thông báo thành công */}
          {forgotSuccess ? (
            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'>
              <strong className='font-bold'>Thành công!</strong>
              <span className='block sm:inline'> Vui lòng kiểm tra email của bạn để nhận liên kết đặt lại.</span>
              <p className='mt-2 text-sm'>
                <Link to='/login' className='font-semibold hover:underline' style={{ color: theme.palette.secondary.main }}>
                Quay lại trang Đăng nhập
                </Link>
              </p>
            </div>
          ) : (
            <>
              <p className='text-center text-sm mb-4 opacity-80'>
               Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
              </p>

              {error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm'>
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>Email</label>
                <input
                  key="email-input-forgot-key"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full p-2 border rounded focus:ring-2 focus:outline-none'
                  placeholder='Nhập địa chỉ email của bạn'
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
                disabled={forgotLoading}
                className='w-full p-2 rounded-lg font-semibold transition hover:opacity-90'
                style={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }}
              >
                {forgotLoading ? 'Đang gửi...' : 'Gửi Yêu cầu Đặt lại'}
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


export default ForgotPasswordPage
