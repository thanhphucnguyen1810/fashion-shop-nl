import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { useTheme } from '@mui/material/styles'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'

import InputField from '~/components/InputField'
import AuthLayout from '~/components/Layouts/AuthLayout'
import AuthHeader from '~/components/Common/AuthHeader'

import { mergeCart } from '~/redux/slices/cartSlices'
import { loginUser, socialLogin, setUser } from '~/redux/slices/authSlice'
import login from '~/assets/login.webp'

const Login = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, guestId, loading, error } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get('redirect') || '/'
  const isCheckoutRedirect = redirect.includes('checkout')

  useEffect(() => {
    if (!user) return

    // ADMIN / STAFF → ADMIN DASHBOARD
    if (user.role === 'admin' || user.role === 'staff') {
      navigate('/admin')
      return
    }

    // USER THƯỜNG
    const target = isCheckoutRedirect ? '/checkout' : '/'

    if (cart?.products.length > 0 && guestId) {
      dispatch(mergeCart({ guestId, user })).then(() => {
        navigate(target)
      })
    } else {
      navigate(target)
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch])


  // ===== Parse token từ OAuth redirect =====
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    // Đảm bảo parse an toàn cho user data
    const userData = params.get('user') ? JSON.parse(decodeURIComponent(params.get('user'))) : null

    if (token && userData) {
      dispatch(setUser({ user: userData, token }))
      // Giữ lại logic redirect sau khi social login thành công
      navigate(isCheckoutRedirect ? '/checkout' : '/')
    }
  }, [location.search, dispatch, navigate, isCheckoutRedirect])

  // LOGIN FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return alert('Vui lòng nhập email và mật khẩu!')
    dispatch(loginUser({ email, password }))
  }

  // GOOGLE LOGIN
  const handleGoogleLogin = () => dispatch(socialLogin('google'))

  // FACEBOOK LOGIN
  const handleFacebookLogin = () => dispatch(socialLogin('facebook'))

  return (
    <AuthLayout image={login} imageAlt="Đăng nhập tài khoản">
      <form
        onSubmit={handleSubmit}
      >
        {/* Logo */}
        <AuthHeader title="Chào mừng bạn quay lại" />

        {/* Error Alert */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm'>
            <p className='font-medium'>{error}</p>
          </div>
        )}

        {/* Email Input */}
        <InputField
          id="email"
          label="Địa chỉ Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập địa chỉ email của bạn"
          Icon={EmailOutlined}
          theme={theme}
        />

        <div className='mb-2'>
          {/* Password Input */}
          <InputField
            id="password"
            label="Mật khẩu"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
            Icon={LockOutlined}
            theme={theme}
          />

          <div className='flex justify-end mt-2'>
            <Link
              to='/forgot-password'
              className='text-xs font-medium hover:underline'
              style={{ color: theme.palette.secondary.main }}
            >
          Quên mật khẩu?
            </Link>
          </div>
        </div>

        {/* Nút đăng nhập */}
        <button
          type='submit'
          disabled={loading}
          className='w-full mt-4 p-3 rounded-lg font-bold text-base transition duration-200 transform hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md'
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        {/* Divider */}
        <div className='flex items-center justify-center my-6'>
          <span className='w-full border-t border-gray-200 dark:border-gray-700'></span>
          <span className='px-4 text-xs text-gray-400 whitespace-nowrap uppercase'>Hoặc</span>
          <span className='w-full border-t border-gray-200 dark:border-gray-700'></span>
        </div>

        {/* Social Login  */}
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={handleFacebookLogin}
            className='flex-1 flex items-center justify-center gap-2 border rounded-lg p-2.5 text-sm font-semibold hover:bg-gray-50 transition duration-150'
            style={{
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary
            }}
          >
            <FaFacebook className='text-blue-600 text-lg' />
            <span>Facebook</span>
          </button>

          <button
            type='button'
            onClick={handleGoogleLogin}
            className='flex-1 flex items-center justify-center gap-2 border rounded-lg p-2.5 text-sm font-semibold hover:bg-gray-50 transition duration-150'
            style={{
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary
            }}
          >
            <FaGoogle className='text-red-500 text-lg' />
            <span>Google</span>
          </button>
        </div>

        {/* Link đăng ký */}
        <p className='mt-8 text-center text-sm text-gray-500'>
      Bạn mới biết đến TheAurora?{' '}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            style={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}
            className='hover:underline transition'
          >
        Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>

  )
}

export default Login

