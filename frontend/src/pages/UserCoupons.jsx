import { useEffect, useState, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import { toast } from 'sonner'
import { CircularProgress, Button, Paper, Typography, Box } from '@mui/material'
import axios from 'axios'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const API_URL = '/api/coupons/active' // Endpoint lấy danh sách mã giảm giá

// Hàm tiện ích: Format tiền tệ VNĐ
const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

/**
 * Hiển thị danh sách các mã giảm giá đang hoạt động cho người dùng.
 */
const UserCoupons = () => {
  const theme = useTheme()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. FETCH DATA (Lấy danh sách mã giảm giá)
  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      if (response.data.success) {
        setCoupons(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Không thể tải danh sách mã giảm giá.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  // 2. HANDLE COPY (Xử lý sao chép mã)
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép mã: ${code}`)
  }

  // --- 3. RENDER UI ---

  if (loading) {
    return (
      <Box className='flex justify-center items-center p-10'>
        <CircularProgress size={30} color="primary" />
        <Typography variant="body1" className='ml-3'>Đang tải mã giảm giá...</Typography>
      </Box>
    )
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h2 className='text-3xl font-bold mb-6 text-center' style={{ color: theme.palette.text.primary }}>
        💰 Mã Giảm Giá Đang Hoạt Động
      </h2>

      <p className='text-center mb-6' style={{ color: theme.palette.text.secondary }}>
        Tổng cộng: **{coupons.length}** mã có thể sử dụng.
      </p>

      {/* Danh sách Voucher */}
      <div className='space-y-4'>
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <Paper
              key={coupon.code}
              elevation={2}
              className='p-4 flex flex-col md:flex-row items-stretch border-l-8 border-yellow-500 rounded-lg shadow-md'
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              {/* Cột trái: Thông tin giảm giá */}
              <Box className='flex-shrink-0 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-dashed pr-4 pb-3 md:pb-0 mb-3 md:mb-0'>
                <Typography variant="h5" component="div" className='font-bold text-red-600 mb-1'>
                  {coupon.discountType === 'percentage'
                    ? `Giảm ${coupon.discountValue}%`
                    : `Giảm ${formatCurrency(coupon.discountValue)}`}
                </Typography>
                <Typography variant="body2" style={{ color: theme.palette.text.secondary }}>
                  {coupon.description || 'Áp dụng cho mọi sản phẩm.'}
                </Typography>
              </Box>

              {/* Cột giữa & phải: Điều kiện và nút hành động */}
              <Box className='flex-grow pl-0 md:pl-4 flex items-center justify-between'>
                {/* Điều kiện */}
                <Box className='space-y-1 text-sm'>
                  <Typography variant="body2" style={{ color: theme.palette.text.primary }}>
                    **Đơn tối thiểu:** {formatCurrency(coupon.minimumOrderAmount)}
                  </Typography>
                  <Typography variant="body2" style={{ color: theme.palette.text.secondary }}>
                    **Hết hạn:** {format(new Date(coupon.expiresAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </Typography>
                  <Typography variant="body2" style={{ color: theme.palette.text.secondary }} className='text-xs italic'>
                    Đã dùng: {coupon.usedCount}/{coupon.usageLimit} lần
                  </Typography>
                </Box>

                {/* Nút & Mã */}
                <Box className='flex flex-col items-end space-y-2 ml-4'>
                  <Typography variant="subtitle1" className='font-mono font-bold text-lg p-1 px-3 rounded border border-dashed text-blue-600' style={{ borderColor: theme.palette.divider }}>
                    {coupon.code}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleCopyCode(coupon.code)}
                  >
                    Sao chép mã
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))
        ) : (
          <Paper className='p-8 text-center'>
            <Typography variant="h6" color="textSecondary">
            Hiện tại không có mã giảm giá nào đang hoạt động.
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  )
}

export default UserCoupons
