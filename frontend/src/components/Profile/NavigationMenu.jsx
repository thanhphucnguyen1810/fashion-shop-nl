import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

import { logout } from '~/redux/slices/authSlice'
import { clearCart } from '~/redux/slices/cartSlices'
const NavigationMenu = ({ theme, tabValue, setTabValue }) => {

  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
    toast.success('Đăng xuất thành công!', { duration: 1000 })
  }

  const profileMenu = [
    { index: 0, label: 'Thông tin cá nhân', icon: <PersonOutlineIcon /> },
    { index: 1, label: 'Đơn hàng của tôi', icon: <ShoppingBagOutlinedIcon /> },
    { index: 2, label: 'Sản phẩm yêu thích', icon: <FavoriteBorderOutlinedIcon /> },
    { index: 3, label: 'Địa chỉ nhận hàng', icon: <LocationOnOutlinedIcon /> }
  ]

  if (!user) return null

  return (
    <>
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
    </>
  )
}

export default NavigationMenu
