import React, { useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import MyOrdersList from '~/pages/MyOrdersPage'
import { FaWallet, FaBox, FaTruckFast, FaStar, FaLayerGroup, FaBan, FaArrowRotateLeft } from 'react-icons/fa6'

// Component con hỗ trợ TabPanel (Optional)
function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

// Map các trạng thái từ tên hiển thị sang giá trị filter thực tế
const ORDERS_STATUS_TABS = [
  { label: 'Tất cả', icon: <FaLayerGroup />, status: 'all' },
  { label: 'Chờ xác nhận', icon: <FaWallet />, status: 'awaiting_confirmation' },
  { label: 'Chờ lấy hàng', icon: <FaBox />, status: 'processing' },
  { label: 'Chờ giao hàng', icon: <FaTruckFast />, status: 'shipped' },
  { label: 'Đã giao/Đánh giá', icon: <FaStar />, status: 'delivered' },
  { label: 'Đã hủy', icon: <FaBan />, status: 'cancelled' },
  { label: 'Trả hàng/Hoàn tiền', icon: <FaArrowRotateLeft />, status: 'returned' }
]

const OrdersStatusTabs = () => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className='flex justify-between items-center mb-6'>
        <Typography
          variant="h4"
          component="h1"
          className="font-bold"
          sx={{ color: theme.palette.text.primary }}
        >
                    Đơn Hàng Của Tôi
        </Typography>
        {/* Nút Xem lịch sử mua hàng, dùng Link điều hướng đến chính trang này (hoặc trang account nếu cần) */}
        <Link to="/my-orders" className='text-sm font-semibold' style={{ color: theme.palette.primary.main }}>
                    Xem lịch sử mua hàng <i className="fa-solid fa-chevron-right ml-1"></i>
        </Link>
      </div>


      {/* Thanh Tabs - Bắt chước giao diện Shopee */}
      <Box sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px 8px 0 0',
        boxShadow: theme.shadows[1]
      }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="scrollable" // Cho phép cuộn nếu nhiều tab
          scrollButtons="auto"
          aria-label="order status tabs"
          sx={{
            // Custom style để giống Shopee
            '& .MuiTab-root': {
              minWidth: 100, // Chiều rộng tối thiểu cho mỗi tab
              padding: '12px 8px',
              textTransform: 'none',
              fontWeight: 600
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          {ORDERS_STATUS_TABS.map((tab, index) => (
            <Tab
              key={index}
              label={
                <div className='flex flex-col items-center justify-center'>
                  <div className='text-xl mb-1' style={{ color: tabValue === index ? theme.palette.primary.main : theme.palette.text.secondary }}>
                    {tab.icon}
                  </div>
                  <span className='text-xs'>{tab.label}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Nội dung Tabs */}
      <Box sx={{ marginTop: '1px', backgroundColor: theme.palette.background.paper, boxShadow: theme.shadows[1], borderRadius: '0 0 8px 8px' }}>
        {ORDERS_STATUS_TABS.map((tab, index) => (
          <TabPanel value={tabValue} index={index} key={index}>
            <MyOrdersList currentStatusFilter={tab.status} />
          </TabPanel>
        ))}
      </Box>

    </div>
  )
}

export default OrdersStatusTabs
