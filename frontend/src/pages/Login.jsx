import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import login from '~/assets/login.webp'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, socialLogin, setUser } from '~/redux/slices/authSlice'
import { mergeCart } from '~/redux/slices/cartSlices'

const Login = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, guestId, loading, error } = useSelector((state) => state.auth)
  const { cart } = useSelector((state) => state.cart)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Get redirect parameter and check if it's checkout or something
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

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div
      className='flex min-h-screen'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* Left side: Form đăng nhập */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-12'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md p-6 md:p-8 rounded-xl border shadow-lg'
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider
          }}
        >
          {/* Logo / Tiêu đề */}
          <div className='flex justify-center mb-6'>
            <h2
              className='text-3xl font-extrabold tracking-wider'
              style={{ color: theme.palette.primary.main }}
            >
              TheAurora
            </h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-5'>Chào mừng bạn quay lại!</h2>

          {/* Error Alert */}
          {error && (
            <div className='bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm'>
              <p className='font-medium'>{error}</p>
              {error.includes('xác minh') && (
                <p className='mt-2 text-xs'>
                  Tài khoản chưa được kích hoạt. Vui lòng kiểm tra hộp thư của bạn để xác minh.
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium mb-1'>Email</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-150'
              placeholder='Nhập địa chỉ email của bạn'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '--tw-ring-color': theme.palette.primary.main
              }}
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className='mb-2'>
            <label htmlFor='password' className='block text-sm font-medium mb-1'>Mật khẩu</label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-150 pr-10' // Thêm padding bên phải cho icon
                placeholder='Nhập mật khẩu của bạn'
                style={{
                  backgroundColor: theme.palette.background.default,
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  '--tw-ring-color': theme.palette.primary.main
                }}
                required
              />

              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition'
              >
                {showPassword ? (
                  <FaEyeSlash className='h-5 w-5' />
                ) : (
                  <FaEye className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Quên mật khẩu */}
            <div className='flex justify-end mt-2'>
              <Link
                to='/forgot-password'
                className='text-sm font-medium hover:underline transition'
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
            className='w-full mt-6 p-3 rounded-lg font-bold text-lg transition duration-200 ease-in-out transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý...</span>
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>

          {/* --- OR divider --- */}
          <div className='flex items-center justify-center my-6'>
            <span className='w-full border-t border-gray-300 dark:border-gray-700'></span>
            <span className='px-4 text-sm opacity-70 whitespace-nowrap' style={{ color: theme.palette.text.secondary }}>hoặc đăng nhập bằng</span>
            <span className='w-full border-t border-gray-300 dark:border-gray-700'></span>
          </div>

          <div className='flex flex-col gap-3'>
            {/* Google Login */}
            <button
              type='button'
              onClick={handleGoogleLogin}
              className='flex items-center justify-center gap-2 border rounded-lg p-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150'
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
              }}
            >
              <FaGoogle className='text-red-500 text-xl' />
              <span>Google</span>
            </button>

            {/* Facebook Login */}
            <button
              type='button'
              onClick={handleFacebookLogin}
              className='flex items-center justify-center gap-2 border rounded-lg p-3 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150'
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
              }}
            >
              <FaFacebook className='text-blue-600 text-xl' />
              <span>Facebook</span>
            </button>
          </div>

          {/* Link đăng ký */}
          <p className='mt-8 text-center text-sm'>
            Chưa có tài khoản?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              style={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}
              className='hover:underline transition'
            >
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>

      {/* Right side: Hình ảnh minh hoạ */}
      <div
        className='hidden md:block w-1/2 overflow-hidden relative'
        style={{
          backgroundColor: theme.palette.background.neutral
        }}
      >
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt='Đăng nhập tài khoản'
            className='h-full w-full object-cover object-center transform transition duration-500 hover:scale-105'
          />
        </div>
      </div>
    </div>
  )
}

export default Login
