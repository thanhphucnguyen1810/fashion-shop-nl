import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { useTheme } from '@mui/material/styles'
import { CircularProgress, Button, Paper, Typography, Box, Modal, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { applyCoupon } from '~/redux/slices/cartSlices'

const API_URL = import.meta.env.VITE_API_URL


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 700 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2
}

const formatCurrency = (amount) => amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const CouponModal = ({ open, handleClose, currentCouponCode, authId, isGuest }) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [applyingCode, setApplyingCode] = useState(null)

  // --- 1. Fetch Coupons ---
  const fetchCoupons = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/coupons/active`)
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
    if (open) {
      fetchCoupons()
    }
  }, [open, fetchCoupons])

  // --- 2. Xử lý Áp dụng Mã (Bằng nút "Chọn") ---
  const handleApplyCoupon = async (code) => {
    setApplyingCode(code)
    try {
      await dispatch(applyCoupon({
        code: code,
        userId: isGuest ? undefined : authId,
        guestId: isGuest ? authId : undefined
      })).unwrap()

      toast.success(`Mã ${code} đã được áp dụng thành công!`)
      handleClose()
    } catch (err) {
      const errorMessage = err?.message || 'Không thể áp dụng mã này. Vui lòng kiểm tra đơn hàng tối thiểu.'
      toast.error(errorMessage)
    } finally {
      setApplyingCode(null)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className='flex justify-between items-center border-b pb-3 mb-4'>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Chọn Mã Giảm Giá
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {loading ? (
          <Box className='flex justify-center items-center py-10'>
            <CircularProgress size={30} color="primary" />
          </Box>
        ) : coupons.length === 0 ? (
          <Paper className='p-8 text-center'>
            <Typography variant="h6" color="textSecondary">
              Hiện tại không có mã giảm giá nào.
            </Typography>
          </Paper>
        ) : (
          <div className='space-y-4'>
            {coupons.map((coupon) => {
              const isCurrentlyApplied = coupon.code === currentCouponCode
              const isDisabled = isCurrentlyApplied || applyingCode === coupon.code

              return (
                <Paper
                  key={coupon.code}
                  elevation={1}
                  className={`p-3 flex items-center justify-between border ${isCurrentlyApplied ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                >
                  {/* Thông tin Mã */}
                  <Box className='flex-grow pr-4'>
                    <Typography variant="subtitle1" fontWeight="bold" className='text-red-600'>
                      {coupon.discountType === 'percentage'
                        ? `Giảm ${coupon.discountValue}%`
                        : `Giảm ${formatCurrency(coupon.discountValue)}`}
                    </Typography>
                    <Typography variant="caption" className='block' style={{ color: theme.palette.text.secondary }}>
                       Đơn tối thiểu: {formatCurrency(coupon.minimumOrderAmount)}
                    </Typography>
                    <Typography variant="caption" className='block text-xs italic'>
                       Hết hạn: {format(new Date(coupon.expiresAt), 'dd/MM/yyyy', { locale: vi })}
                    </Typography>
                  </Box>

                  {/* Mã & Nút */}
                  <Box className='flex flex-col items-center justify-center space-y-1'>
                    <Typography variant="subtitle2" className='font-mono font-semibold'>
                      {coupon.code}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color={isCurrentlyApplied ? 'success' : 'primary'}
                      onClick={() => handleApplyCoupon(coupon.code)}
                      disabled={isDisabled}
                    >
                      {isCurrentlyApplied ? 'Đang dùng' : applyingCode === coupon.code ? <CircularProgress size={16} color="inherit" /> : 'Chọn'}
                    </Button>
                  </Box>
                </Paper>
              )
            })}
          </div>
        )}
      </Box>
    </Modal>
  )
}

export default CouponModal
