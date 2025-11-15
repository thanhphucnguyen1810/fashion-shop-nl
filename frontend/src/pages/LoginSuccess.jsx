import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('token', token)
      navigate('/') // redirect đến trang dashboard/home
    } else {
      navigate('/login') // nếu không có token
    }
  }, [navigate])

  return <p>Đang đăng nhập, vui lòng chờ...</p>
}

export default LoginSuccess
