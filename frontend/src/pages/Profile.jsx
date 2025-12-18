import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { logout, setUser, removeFavorite } from '~/redux/slices/authSlice'
import MyOrdersPage from './MyOrdersPage'
import { clearCart } from '~/redux/slices/cartSlices'
import { Box, Typography } from '@mui/material'
import { toast } from 'sonner'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import SaveIcon from '@mui/icons-material/Save'
import AddressManager from '~/components/AddressManager'
import OrdersStatusTabs from '~/components/OrdersStatusTabs'


const FavoriteCard = ({ product, theme, onRemoveFavorite }) => (
  <div
    className='relative overflow-hidden transition-all duration-300 group'
    style={{
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px'
    }}
  >
    {/* Product Image */}
    <div className='w-full aspect-square overflow-hidden'>
      <img
        src={product?.images?.[0]?.url || 'placeholder_url'}
        alt={product?.name || 'Sản phẩm'}
        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
      />
    </div>

    {/* Product Info */}
    <div className='p-2 md:p-3'>
      <h3 className='text-sm font-medium line-clamp-2' style={{ color: theme.palette.text.primary, minHeight: '40px' }}>
        {product?.name || 'Tên Sản Phẩm (Thiếu dữ liệu)'}
      </h3>
      {/* Giá tiền nổi bật */}
      <p className='text-md mt-1 font-bold' style={{ color: theme.palette.error.main }}>
        {product?.price ? `${product.price.toLocaleString('vi-VN')}₫` : 'N/A'}
      </p>
    </div>

    {/* Nút Xóa (Unfavorite) - Giống Shopee/Lazada */}
    <button
      onClick={(e) => {
        e.stopPropagation()
        onRemoveFavorite(product._id)
      }}
      className='absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100'
      title='Xóa khỏi Yêu thích'
    >
      <span className='material-icons' style={{ fontSize: '18px' }}>
            clear
      </span>
    </button>
  </div>
)


// --- TabPanel Component (Giữ nguyên) ---
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  )
}

// --- Main Profile Component ---
const Profile = () => {
  const theme = useTheme()
  const { user, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [avatarFile, setAvatarFile] = useState(null)
  const [name, setName] = useState(user?.name || '')
  const [gender, setGender] = useState(user?.gender || 'other')
  const favorites = user?.favorites || []
  const [tabValue, setTabValue] = useState(0)

  const userToken = token

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    setName(user?.name || '')
    setGender(user?.gender || 'other')
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
    toast.success('Đăng xuất thành công!', { duration: 1000 })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) setAvatarFile(e.target.files[0])
  }

  const handleUpdateProfile = async () => {
    if (!user || !userToken) return

    const formData = new FormData()

    formData.append('name', name)
    formData.append('gender', gender)

    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const updatedUser = res.data

      dispatch(setUser({ user: updatedUser, token: userToken }))

      setAvatarFile(null)

      toast.success('Cập nhật profile thành công!', { duration: 1000 })
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật thất bại. Vui lòng kiểm tra console.', { duration: 1000 })
    }
  }


  const handleRemoveFavorite = (productId) => {
  // Gọi action Redux để xóa sản phẩm yêu thích (giả định bạn đã có action này)
    dispatch(removeFavorite(productId))
    toast.info('Đã xóa sản phẩm khỏi danh sách yêu thích.', { duration: 1000 })
  }
  // Cấu hình Menu
  const profileMenu = [
    { index: 0, label: 'Thông tin cá nhân', icon: <PersonOutlineIcon /> },
    { index: 1, label: 'Đơn hàng của tôi', icon: <ShoppingBagOutlinedIcon /> },
    { index: 2, label: 'Sản phẩm yêu thích', icon: <FavoriteBorderOutlinedIcon /> },
    { index: 3, label: 'Địa chỉ nhận hàng', icon: <LocationOnOutlinedIcon /> }
  ]

  if (!user) return null

  return (
    <div className='min-h-screen' style={{ backgroundColor: theme.palette.background.default }}>
      <div className='w-full font-Poppins p-4 md:px-12 lg:px-20'>
        <Typography
          variant='h4'
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            marginBottom: theme.spacing(4)
          }}
        >
          Tài khoản của tôi
        </Typography>

        <div className='flex flex-col md:flex-row md:space-x-6'>
          {/* Left Section: User Summary + Menu Navigation (1/4 width) */}
          <div className='w-full md:w-1/4 mb-6 md:mb-0'>
            <div
              className='shadow-md rounded-xl p-6 mb-4 flex flex-col items-center'
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              {/* Avatar */}
              <div className='relative group'>
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar?.url }
                  alt='Avatar'
                  className='rounded-full w-20 h-20 object-cover border-4'
                  style={{ borderColor: theme.palette.primary.light }}
                />
                <label
                  htmlFor="avatar-upload"
                  className='absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer'
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <span className='text-white text-xs font-semibold'>Sửa ảnh</span>
                </label>
                <input
                  id="avatar-upload"
                  type='file'
                  onChange={handleAvatarChange}
                  className='hidden'
                  accept="image/*"
                />
              </div>
              <Typography
                variant='h6'
                className='mt-3 font-semibold'
                style={{ color: theme.palette.text.primary }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant='body2'
                style={{ color: theme.palette.text.secondary }}
              >
                {user?.email}
              </Typography>
            </div>

            {/* 2. Navigation Menu */}
            <div
              className='shadow-md rounded-xl p-3 sticky top-4 self-start'
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              {profileMenu.map((item) => (
                <div
                  key={item.index}
                  onClick={() => setTabValue(item.index)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    tabValue === item.index
                      ? 'font-bold'
                      : 'hover:bg-opacity-70'
                  }`}
                  style={{
                    backgroundColor: tabValue === item.index ? theme.palette.primary.light : 'transparent',
                    color: tabValue === item.index ? theme.palette.primary.contrastText : theme.palette.text.primary
                  }}
                >
                  {item.icon}
                  <Typography variant='body1'>{item.label}</Typography>
                </div>
              ))}

              {/* Logout Button in Menu Style */}
              <div
                onClick={handleLogout}
                className='flex items-center space-x-3 p-3 mt-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-opacity-70'
                style={{
                  color: theme.palette.error.main,
                  borderTop: `1px solid ${theme.palette.divider}`
                }}
              >
                <LogoutIcon />
                <Typography variant='body1'>Đăng xuất</Typography>
              </div>
            </div>
          </div>

          {/* Right Section: Content (3/4 width) */}
          <div className='w-full md:w-3/4 shadow-xl rounded-xl' style={{ backgroundColor: theme.palette.background.paper }}>

            {/* Tab 1: Cập nhật Profile */}
            <TabPanel value={tabValue} index={0}>
              <div className='p-6'>
                <h2 className='text-2xl font-semibold mb-6 border-b pb-3' style={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}>Thông tin cá nhân</h2>

                {/* Name Input */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Tên hiển thị</label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    style={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  />
                </div>

                {/* Email Display */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Email (Không thể thay đổi)</label>
                  <input
                    type='email'
                    value={user?.email || ''}
                    disabled
                    className='w-full p-3 border rounded-lg cursor-not-allowed'
                    style={{
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.text.secondary,
                      borderColor: theme.palette.divider
                    }}
                  />
                </div>

                {/* Gender Select */}
                <div className='mb-6'>
                  <label className='block text-sm font-medium mb-1' style={{ color: theme.palette.text.secondary }}>Giới tính</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    style={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}
                  >
                    <option value='male'>Nam</option>
                    <option value='female'>Nữ</option>
                    <option value='other'>Khác</option>
                  </select>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className='w-full py-3 px-4 rounded-lg font-bold transition duration-300 flex items-center justify-center space-x-2'
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                  }}
                >
                  <SaveIcon />
                  <span>Cập nhật Profile</span>
                </button>
              </div>
            </TabPanel>

            {/* Tab 3: Quản lý địa chỉ giao hàng */}
            <TabPanel value={tabValue} index={3}>
              <AddressManager />
            </TabPanel>

            {/* Tab 3: Đơn hàng */}
            <TabPanel value={tabValue} index={1}>
              <OrdersStatusTabs />
            </TabPanel>

            {/* Tab 4: Sản phẩm yêu thích */}
            <TabPanel value={tabValue} index={2}>
              <div className='p-6'>
                <h2 className='text-2xl font-semibold mb-4 border-b pb-3' style={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}>Sản phẩm yêu thích</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                  {favorites.length > 0 ? (
                    favorites.map((product) => <FavoriteCard key={product._id} product={product} theme={theme} onRemoveFavorite={handleRemoveFavorite} />)
                  ) : (
                    <p style={{ color: theme.palette.text.secondary }}>Bạn chưa có sản phẩm yêu thích nào. Hãy đi khám phá!</p>
                  )}
                </div>
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
