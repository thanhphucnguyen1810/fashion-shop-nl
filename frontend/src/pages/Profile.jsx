import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { logout, setUser } from '~/redux/slices/authSlide'
import MyOrdersPage from './MyOrdersPage'

// Component hiển thị 1 sản phẩm yêu thích
const FavoriteCard = ({ product }) => (
  <div className='border rounded-lg overflow-hidden shadow-sm'>
    <img src={product.image} alt={product.name} className='w-full h-40 object-cover' />
    <div className='p-2'>
      <h3 className='text-sm font-semibold'>{product.name}</h3>
      <p className='text-sm text-gray-500'>{product.price}₫</p>
    </div>
  </div>
)

const Profile = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [avatarFile, setAvatarFile] = useState(null)
  const [gender, setGender] = useState(user?.gender || 'other')
  const [favorites, setFavorites] = useState([])

  // Redirect nếu user null (đã logout)
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch danh sách sản phẩm yêu thích
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setFavorites(res.data.favorites || [])
      } catch (err) {
        console.error(err)
      }
    }
    if (user) fetchFavorites()
  }, [user])

  const handleLogout = () => { dispatch(logout()) }
  const handleAvatarChange = (e) => {
    if (e.target.files[0]) setAvatarFile(e.target.files[0])
  }

  const handleUpdateProfile = async () => {
    if (!user) return
    try {
      const formData = new FormData()
      formData.append('gender', gender)
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Update redux store
      dispatch(setUser({ user: res.data, token: user.token }))
      alert('Cập nhật profile thành công!')
    } catch (err) {
      console.error(err)
      alert('Cập nhật thất bại')
    }
  }

  if (!user) return null

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow container mx-auto p-4 md:p-6'>
        <div className='flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0'>
          {/* Left Section: Profile Info */}
          <div
            className='w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg px-6'
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            {/* Avatar */}
            <div className='flex flex-col items-center mb-4'>
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || '/default-avatar.png'}
                alt='Avatar'
                className='rounded-full w-24 h-24 object-cover mb-2'
              />
              <input type='file' onChange={handleAvatarChange} />
            </div>
            <h1 className='text-2xl md:text-3xl font-bold mb-4'> {user.name}</h1>
            <p
              className='text-lg mb-4'
              style={{ color: theme.palette.text.secondary }}
            >
              {user.email}
            </p>
            {/* Gender */}
            <div className='mb-4'>
              <label className='block text-sm font-semibold mb-1'>Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className='w-full p-2 border rounded'
              >
                <option value='male'>Nam</option>
                <option value='female'>Nữ</option>
                <option value='other'>Khác</option>
              </select>
            </div>
            <button
              onClick={handleUpdateProfile}
              className='w-full py-2 px-4 mb-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition'
            >
              Cập nhật Profile
            </button>
            <button
              onClick={handleLogout}
              className='w-full py-2 px-4 rounded'
              style={{
                backgroundColor: theme.palette.error.main,
                color: theme.palette.getContrastText(theme.palette.error.main)
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  theme.palette.error.dark)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  theme.palette.error.main)
              }
            >
              Đăng xuất
            </button>
          </div>

          {/* Right Section: Orders + Favorites */}
          <div className='w-full md:w-2/3 lg:w-3/4 flex flex-col space-y-6'>
            {/* Orders */}
            <div className='shadow-md rounded-lg p-4' style={{ backgroundColor: theme.palette.background.paper }}>
              <h2 className='text-xl font-semibold mb-4'>Đơn hàng của tôi</h2>
              <MyOrdersPage />
            </div>

            {/* Favorites */}
            <div className='shadow-md rounded-lg p-4' style={{ backgroundColor: theme.palette.background.paper }}>
              <h2 className='text-xl font-semibold mb-4'>Sản phẩm yêu thích</h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {favorites.length > 0 ? (
                  favorites.map((product) => <FavoriteCard key={product._id} product={product} />)
                ) : (
                  <p>Chưa có sản phẩm yêu thích nào.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile