import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@mui/material/styles'
import { Typography } from '@mui/material'

import AddressManager from '~/components/Profile/AddressManager'
import OrdersStatusTabs from '~/components/OrdersStatusTabs'
import TabPanel from '~/components/Profile/TabPanel'
import UpdateProfile from '~/components/Profile/UpdateProfile'
import NavigationMenu from '~/components/Profile/NavigationMenu'
import FavoriteTab from '~/components/Profile/FavoriteTab'

const Profile = () => {
  const theme = useTheme()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (user === null) navigate('/login')
  }, [user, navigate])

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
                  src={`${user?.avatar?.url}?v=${Date.now()}`}
                  alt="Avatar"
                  className="rounded-full w-20 h-20 object-cover border-4"
                  style={{ borderColor: theme.palette.primary.light }}
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
            <NavigationMenu
              tabValue={tabValue}
              setTabValue={setTabValue}
              theme={theme}
            />
          </div>

          {/* Right Section: Content (3/4 width) */}
          <div className='w-full md:w-3/4 shadow-xl rounded-xl' style={{ backgroundColor: theme.palette.background.paper }}>

            {/* Tab 1: Cập nhật Profile */}
            <TabPanel value={tabValue} index={0}>
              <UpdateProfile theme={theme} />
            </TabPanel>

            {/* Tab 3: Quản lý địa chỉ giao hàng */}
            <TabPanel value={tabValue} index={3}>
              <AddressManager />
            </TabPanel>

            {/* Tab 3: Đơn hàng */}
            <TabPanel value={tabValue} index={1}>
              <OrdersStatusTabs theme={theme} />
            </TabPanel>

            {/* Tab 4: Sản phẩm yêu thích */}
            <TabPanel value={tabValue} index={2}>
              <FavoriteTab theme={theme} />
            </TabPanel>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
