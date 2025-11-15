import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import register from '~/assets/register.webp'
import { registerUser } from '~/redux/slices/authSlide'

const Register = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, error, success } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Gửi request đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(registerUser(formData))
  }

  // Điều hướng khi đăng ký thành công
  useEffect(() => {
    if (success) navigate('/login')
  }, [success, navigate])

  return (
    <div
      className='flex'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md p-8 rounded-lg border shadow-sm'
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider
          }}
        >
          <div className='flex justify-center mb-6'>
            <h2
              className='text-xl font-medium'
              style={{ color: theme.palette.primary.main }}
            >
              TheAurora
            </h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-6'>Chào mừng bạn!</h2>
          {error && (
            <p className="text-red-500 text-center font-semibold mb-4">
              {error}
            </p>
          )}

          {/* Name */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='Enter your name'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='Enter your email address'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          {/* Password */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='Enter your password'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full p-2 rounded-lg font-semibold transition'
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký' }
          </button>

          <p className='mt-6 text-center text-sm'>
            Bạn đã có tài khoản?{' '}
            <Link to='/login' style={{ color: theme.palette.secondary.main }}>
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>

      <div
        className='hidden md:block w-1/2'
        style={{
          backgroundColor: theme.palette.background.neutral
        }}
      >
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={register}
            alt='register'
            className='h-[750px] w-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default Register

