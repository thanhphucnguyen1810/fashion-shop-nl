import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import login from '~/assets/login.webp'

const Login = () => {
  const theme = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Đăng nhập người dùng: ', { email, password })
    // TODO: Xử lý đăng nhập
  }

  return (
    <div
      className='flex min-h-screen'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* Bên trái: Form đăng nhập */}
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
            <h2 className='text-xl font-medium' style={{ color: theme.palette.primary.main }}>
              TheAurora
            </h2>
          </div>

          <h2 className='text-2xl font-bold text-center mb-6'>Chào mừng bạn!</h2>
          <p className='text-center mb-6'>
            Nhập email và mật khẩu để đăng nhập
          </p>

          {/* Email */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Nhập địa chỉ email của bạn'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          {/* Mật khẩu */}
          <div className='mb-4'>
            <label className='block text-sm font-semibold mb-2'>Mật khẩu</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Nhập mật khẩu của bạn'
              style={{
                backgroundColor: theme.palette.background.default,
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary
              }}
            />
          </div>

          <button
            type='submit'
            className='w-full p-2 rounded-lg font-semibold transition'
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}
          >
            Đăng nhập
          </button>

          <p className='mt-6 text-center text-sm'>
            Chưa có tài khoản?{' '}
            <Link
              to='/register'
              style={{ color: theme.palette.secondary.main }}
            >
              Đăng ký
            </Link>
          </p>
        </form>
      </div>

      {/* Bên phải: Hình ảnh */}
      <div
        className='hidden md:block w-1/2'
        style={{ backgroundColor: theme.palette.background.neutral }}
      >
        <div className='h-full flex flex-col justify-center items-center'>
          <img
            src={login}
            alt='Đăng nhập tài khoản'
            className='h-[750px] w-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default Login
