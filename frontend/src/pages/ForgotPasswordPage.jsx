import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { forgotPassword, clearForgotStatus } from '~/redux/slices/authSlice'
import login from '~/assets/login.webp'
import AuthLayout from '~/components/Layouts/AuthLayout'
import AuthHeader from '~/components/Common/AuthHeader'


const ForgotPasswordPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
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

  return (
    <AuthLayout
      image={login}
      imageAlt="Quên mật khẩu"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit}>
        <AuthHeader
          title="Quên Mật Khẩu"
          subtitle="Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu."
        />
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
              {forgotLoading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lại'}
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
