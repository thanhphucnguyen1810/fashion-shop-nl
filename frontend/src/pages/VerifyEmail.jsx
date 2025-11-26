import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
  const { token } = useParams()
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async() => {
      try {
        const res = await axios.get(`/api/users/verify-email/${token}`)
        setMessage(res.data.message)
        // Lưu JWT nếu muốn auto login
        localStorage.setItem('userToken', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.user))
        setTimeout(() => navigate('/'), 2000)
      } catch (err) {
        setMessage(err.response?.data?.message || 'Lỗi server')
      }
    }
    verify()
  }, [token])

  return <div>{message}</div>
}

export default VerifyEmail

