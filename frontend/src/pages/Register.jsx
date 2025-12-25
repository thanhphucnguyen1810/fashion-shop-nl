import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'

import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PersonOutline from '@mui/icons-material/PersonOutline'
import LoginIcon from '@mui/icons-material/Login'

import register from '~/assets/register.webp'
import { registerUser } from '~/redux/slices/authSlice'
import { mergeCart } from '~/redux/slices/cartSlices'
import InputField from '~/components/InputField'
import AuthLayout from '~/components/Layouts/AuthLayout'
import AuthHeader from '~/components/Common/AuthHeader'

const Register = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { loading, success, redirectEmail, user, guestId } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()

  // ------------------------------------------------------------------------
  // EFFECT: Handle successful registration toast
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (success && redirectEmail) {
      toast.success(
        `Đăng ký thành công! Vui lòng kiểm tra email của bạn tại ${redirectEmail} để xác minh tài khoản.`,
        {
          duration: 5000,
          position: 'top-center'
        }
      )
    }
  }, [success, redirectEmail, navigate, dispatch])

  // ------------------------------------------------------------------------
  // EFFECT: Handle redirection after successful registration/login
  // ------------------------------------------------------------------------
  const { cart } = useSelector((state) => state.cart)
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  const isCheckoutRedirect = redirect.includes('checkout')

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? '/checkout' : '/')
        })
      } else {
        navigate(isCheckoutRedirect ? '/checkout' : '/')
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

  // ------------------------------------------------------------------------
  // STATE & HANDLERS for Form
  // ------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Kiểm tra khớp mật khẩu trước khi Dispatch
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp!', {
        position: 'top-right'
      })
      return
    }

    const { name, email, password } = formData
    dispatch(registerUser({ name, email, password }))
  }

  return (
    <AuthLayout image={register} imageAlt="Đăng ký tài khoản">
      {success ? (
        <div className="text-center">
          <div
            className='w-full max-w-md p-8 rounded-xl border-2 animate-fadeIn'
            style={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.success.main + '40',
              boxShadow: `0 10px 20px -5px ${theme.palette.success.main}30`
            }}
          >
            <div className='flex justify-center mb-6'>
              <svg className="w-16 h-16" style={{ color: theme.palette.success.main }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className='text-3xl font-extrabold text-center mb-4' style={{ color: theme.palette.text.primary }}>
              Đăng ký Thành công!
            </h2>
            <p className='text-center mb-6 text-sm' style={{ color: theme.palette.text.secondary }}>
              Chúng tôi đã gửi một email xác minh đến: <span className='font-semibold' style={{ color: theme.palette.primary.main }}>{redirectEmail}</span>.
              Vui lòng kiểm tra hộp thư đến (cả mục Spam) để kích hoạt tài khoản của bạn.
            </p>
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className='block w-full text-center p-3 rounded-xl font-bold transition duration-300 ease-in-out transform hover:scale-[1.02]'
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: `0 4px 15px -5px ${theme.palette.primary.main}80`
              }}
            >
              <div className='flex items-center justify-center space-x-2'>
                <LoginIcon sx={{ fontSize: 18 }} />
                <span>Đi đến trang Đăng nhập</span>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <AuthHeader title="Tạo tài khoản mới" />
          {/* Name Input */}
          <InputField
            id="name"
            label="Tên của bạn"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên đầy đủ"
            Icon={PersonOutline}
            theme={theme}
          />

          {/* Email Input */}
          <InputField
            id="email"
            label="Địa chỉ Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            Icon={EmailOutlined}
            theme={theme}
          />

          {/* Password Input */}
          <InputField
            id="password"
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tối thiểu 6 ký tự"
            Icon={LockOutlined}
            theme={theme}
          />

          {/* Confirm Password Input */}
          <InputField
            id="confirmPassword"
            label="Nhập lại mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu của bạn"
            Icon={LockOutlined}
            theme={theme}
          />

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full p-3 mt-4 rounded-xl font-bold transition duration-300 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: `0 4px 15px -5px ${theme.palette.primary.main}80`
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <span>Đăng ký</span>
            )}
          </button>

          {/* Link to Login */}
          <p className='mt-6 text-center text-sm' style={{ color: theme.palette.text.secondary }}>
              Bạn đã có tài khoản?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className='font-bold hover:underline transition duration-200'
              style={{ color: theme.palette.secondary.main }}
            >
                Đăng nhập
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}

export default Register
