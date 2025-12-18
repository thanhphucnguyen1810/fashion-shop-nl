import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'

// Import MUI Icons thay thế cho lucide-react
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PersonOutline from '@mui/icons-material/PersonOutline'
import LoginIcon from '@mui/icons-material/Login' // Đổi tên để tránh trùng với thẻ <Login> nếu có

import register from '~/assets/register.webp'
import { registerUser } from '~/redux/slices/authSlice'
import { mergeCart } from '~/redux/slices/cartSlices'

const Register = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { loading, success, error, redirectEmail, user, guestId } = useSelector((state) => state.auth)
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
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(registerUser(formData))
  }

  // ------------------------------------------------------------------------
  // RENDER: Component JSX
  // ------------------------------------------------------------------------
  return (
    <div
      className='flex min-h-screen'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* CỘT FORM - Hiển thị 100% trên mobile, 50% trên desktop */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12'>

        {/* ======================== LOGIC HIỂN THỊ THÔNG BÁO THÀNH CÔNG (SUCCESS) ======================== */}
        {success ? (
          <div
            className='w-full max-w-md p-8 rounded-xl border-2 animate-fadeIn' // Thêm bo góc lớn hơn, border dày hơn, animation
            style={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.success.main + '40', // Màu border nhạt của success
              boxShadow: `0 10px 20px -5px ${theme.palette.success.main}30` // Thêm box shadow
            }}
          >
            <div className='flex justify-center mb-6'>
              {/* Sử dụng icon CheckCircleOutline từ MUI nếu bạn muốn thay thế SVG */}
              <svg className="w-16 h-16" style={{ color: theme.palette.success.main }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className='text-3xl font-extrabold text-center mb-4' style={{ color: theme.palette.text.primary }}>
              Đăng ký Thành công!
            </h2>
            <p className='text-center mb-6 text-sm' style={{ color: theme.palette.text.secondary }}>
              Chúng tôi đã gửi một email xác minh đến: <span className='font-semibold' style={{ color: theme.palette.primary.main }}>{redirectEmail}</span>.
              Vui lòng kiểm tra hộp thư đến (cả mục Spam/Junk) để kích hoạt tài khoản của bạn.
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
        ) : (
          /* ======================== FORM ĐĂNG KÝ (HIỂN THỊ KHI CHƯA THÀNH CÔNG) ======================== */
          <form
            onSubmit={handleSubmit}
            className='w-full max-w-md p-8 rounded-xl border shadow-2xl animate-fadeIn' // shadow-2xl, bo góc đẹp hơn
            style={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              boxShadow: theme.palette.mode === 'dark' ? '0 15px 30px -5px rgba(0,0,0,0.5)' : '0 15px 30px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div className='flex justify-center mb-2'>
              <h2
                className='text-3xl font-extrabold tracking-tight'
                style={{ color: theme.palette.primary.main }}
              >
                TheAurora
              </h2>
            </div>
            <p className='text-center mb-6 text-lg font-semibold' style={{ color: theme.palette.text.secondary }}>
              Tạo tài khoản mới
            </p>
            {error && (
              <p className="text-sm font-medium p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-center mb-4 border border-red-300 dark:border-red-700">
                {error}
              </p>
            )}

            {/* Name Input */}
            <InputField
              id="name"
              label="Tên của bạn"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên đầy đủ"
              Icon={PersonOutline} // Đã thay thế
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
              Icon={EmailOutlined} // Đã thay thế
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
              Icon={LockOutlined} // Đã thay thế
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
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* CỘT ẢNH - Ẩn trên mobile, hiển thị 50% trên desktop */}
      <div
        className='hidden md:block w-1/2 overflow-hidden relative'
        style={{
          backgroundColor: theme.palette.background.neutral // Màu nền trung tính cho cột ảnh
        }}
      >
        {/* Overlay mờ để ảnh đẹp hơn */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <img
          src={register}
          alt='register illustration'
          className='h-full w-full object-cover object-center transform transition duration-500 hover:scale-105'
          // Đảm bảo hình ảnh chất lượng và chiếm hết chiều cao
        />
        <div className='absolute bottom-0 left-0 p-8'>
          <h3 className='text-3xl font-extrabold text-white mb-2 tracking-wide'>
            Khám phá Thế giới của TheAurora
          </h3>
          <p className='text-lg font-medium text-gray-200'>
            Đăng ký để nhận những ưu đãi độc quyền và trải nghiệm mua sắm tuyệt vời.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

// =============================================================================================
// Helper Component for Input Field
// =============================================================================================

// Sử dụng <Icon component /> từ MUI
const InputField = ({ id, label, type, name, value, onChange, placeholder, Icon, theme }) => {
  return (
    <div className='mb-5'>
      <label htmlFor={id} className='block text-sm font-semibold mb-2' style={{ color: theme.palette.text.secondary }}>
        {label}
      </label>
      <div className='relative'>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className='w-full p-3 pl-10 border-2 rounded-xl transition duration-300 focus:border-opacity-100'
          placeholder={placeholder}
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            borderOpacity: 0.5 // Làm border mờ đi khi không focus
          }}
          onFocus={(e) => {
            e.target.style.borderColor = theme.palette.primary.main
            e.target.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}30`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.palette.divider
            e.target.style.boxShadow = 'none'
          }}
        />
        {/* Sử dụng Icon component của MUI */}
        <Icon sx={{ fontSize: 20 }} className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: theme.palette.text.secondary }} />
      </div>
    </div>
  )
}
