import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { applyCoupon, removeCoupon } from '~/redux/slices/cartSlices'
import { toast } from 'sonner'
import { useTheme } from '@mui/material/styles'
import { Button, CircularProgress, Box, Typography } from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CouponModal from './CouponModal'

const formatCurrency = (amount) =>
  amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

const CartCouponSection = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { cart, loading: cartLoading } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const isGuest = !user?._id
  const authId = user?._id || localStorage.getItem('guestId')

  const currentCoupon = cart?.coupon
  const discountAmount = cart?.coupon?.discountAmount || 0

  const [openModal, setOpenModal] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)

  const bgMain = theme.palette.mode === 'dark' ? 'bg-slate-800' : 'bg-white'
  const borderColor = theme.palette.mode === 'dark' ? 'border-slate-700' : 'border-gray-200'

  const handleApplyManual = async () => {
    if (!manualCode.trim()) return
    setApplyLoading(true)
    try {
      await dispatch(
        applyCoupon({
          code: manualCode,
          userId: isGuest ? null : authId,
          guestId: isGuest ? authId : null
        })
      ).unwrap()
      toast.success('Áp dụng mã giảm giá thành công!')
      setManualCode('')
    } catch (err) {
      toast.error(err?.message || 'Áp dụng mã giảm giá thất bại.')
    } finally {
      setApplyLoading(false)
    }
  }

  const handleRemoveCoupon = async () => {
    setApplyLoading(true)
    try {
      await dispatch(
        removeCoupon({
          userId: isGuest ? null : authId,
          guestId: isGuest ? authId : null
        })
      ).unwrap()
      toast.success('Đã gỡ bỏ mã giảm giá.')
    } catch (err) {
      toast.error(err?.message || 'Gỡ bỏ mã giảm giá thất bại.')
    } finally {
      setApplyLoading(false)
    }
  }

  if (!cart || cart.products.length === 0) return null

  return (
    <Box className={'mb-4'}>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <LocalOfferIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight="bold">Mã giảm giá</Typography>
        </div>
        <Button variant="text" size="small" onClick={() => setOpenModal(true)} disabled={applyLoading || cartLoading}>
          Chọn mã
        </Button>
      </div>

      {currentCoupon ? (
        <Box className='flex justify-between items-center p-3 rounded-lg border border-green-500'
          style={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(21,128,61,0.1)' : '#f0fff4' }}>
          <div className='flex flex-col'>
            <Typography variant="body2" className='font-semibold text-green-700'>
              Đã áp dụng: {currentCoupon.code}
            </Typography>
            <Typography variant="caption" className='font-medium text-green-700'>
              Giảm: {formatCurrency(discountAmount)}
            </Typography>
          </div>
          <Button size="small" onClick={handleRemoveCoupon} disabled={applyLoading} variant="outlined" color="secondary" className="ml-4">
            {applyLoading ? <CircularProgress size={16} color="inherit" /> : 'Gỡ bỏ'}
          </Button>
        </Box>
      ) : (
        <div className='flex gap-2 p-1 border rounded-md' style={{ borderColor }}>
          <input
            type="text"
            placeholder="Nhập mã giảm giá"
            className={`grow border-none focus:ring-0 focus:outline-none ${bgMain} placeholder-gray-500`}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            disabled={applyLoading}
          />
          <Button variant="contained" size="small" onClick={handleApplyManual} disabled={!manualCode || applyLoading}>
            {applyLoading ? <CircularProgress size={16} color="inherit" /> : 'Áp dụng'}
          </Button>
        </div>
      )}

      <CouponModal open={openModal} handleClose={() => setOpenModal(false)} currentCouponCode={currentCoupon?.code} authId={authId} isGuest={isGuest} />
    </Box>
  )
}

export default CartCouponSection

