import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import login from '~/assets/login.webp'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, socialLogin, setUser } from '~/redux/slices/authSlide'

const Login = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, user } = useSelector((state) => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Redirect khi login thành công (email/password)
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  // ===== Parse token từ OAuth redirect =====
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userData = params.get('user') ? JSON.parse(params.get('user')) : null

    if (token && userData) {
      dispatch(setUser({ user: userData, token }))
      navigate('/') // Redirect sau khi login thành công
    }
  }, [location.search, dispatch, navigate])

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
    <div
      className='flex min-h-screen'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* Left side: Form đăng nhập */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md p-8 rounded-lg border shadow-sm'
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider
          }}
        >
          {/* Logo / Tiêu đề */}
          <div className='flex justify-center mb-6'>
            <h2
              className='text-2xl font-semibold tracking-wide'
              style={{ color: theme.palette.primary.main }}
            >
              TheAurora
            </h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-3'>Chào mừng bạ quay lại!</h2>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
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

          {/* Mật khẩu */}
          <div className='mb-6'>
            <label className='block text-sm font-semibold mb-2'>Mật khẩu</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:outline-none'
              placeholder='Nhập mật khẩu của bạn'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          {/* Nút đăng nhập */}
          <button
            type='submit'
            disabled={loading}
            className='w-full p-2 rounded-lg font-semibold transition hover:opacity-90'
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* --- OR divider --- */}
          <div className='flex items-center justify-center my-6'>
            <span className='w-1/4 border-t' style={{ borderColor: theme.palette.divider }}></span>
            <span className='px-3 text-sm opacity-70'>hoặc</span>
            <span className='w-1/4 border-t' style={{ borderColor: theme.palette.divider }}></span>
          </div>

          <div className='flex flex-col gap-3'>
            {/* Google Login */}
            <button
              type='button'
              onClick={handleGoogleLogin}
              className='flex items-center justify-center gap-2 border rounded-lg p-2 hover:bg-opacity-10 transition'
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default
              }}
            >
              <FaGoogle className='text-red-500 text-lg' />
              <span>Đăng nhập với Google</span>
            </button>

            {/* Facebook Login */}
            <button
              type='button'
              onClick={handleFacebookLogin}
              className='flex items-center justify-center gap-2 border rounded-lg p-2 hover:bg-opacity-10 transition'
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default
              }}
            >
              <FaFacebook className='text-blue-600 text-lg' />
              <span>Đăng nhập với Facebook</span>
            </button>
          </div>

          {/* Link đăng ký */}
          <p className='mt-8 text-center text-sm'>
            Chưa có tài khoản?{' '}
            <Link
              to='/register'
              style={{ color: theme.palette.secondary.main }}
            >
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>

      {/* Right side: Hình ảnh minh hoạ */}
      <div
        className='hidden md:block w-1/2'
        style={{ backgroundColor: theme.palette.background.neutral }}
      >
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt='Đăng nhập tài khoản'
            className='h-[750px] w-full object-cover rounded-l-2xl shadow-lg'
          />
        </div>
      </div>
    </div>
  )
}

export default Login
