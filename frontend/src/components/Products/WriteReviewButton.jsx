import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitReview } from '~/redux/slices/reviewSlice'
import { toast } from 'sonner'
import { FaStar } from 'react-icons/fa'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'

const WriteReviewButton = ({ productId }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpen = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm.', { duration: 2000 })
      return
    }
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleRatingChange = (newRating) => setRating(newRating)

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error('Vui lòng chọn số sao và nhập nội dung đánh giá.', { duration: 2000 })
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(submitReview({ productId, rating, comment, media: false })).unwrap()
      toast.success('Đánh giá của bạn đã được gửi thành công!', { duration: 1500 })
      handleClose()
      setRating(0)
      setComment('')
    } catch (err) {
      toast.error(`Gửi đánh giá thất bại: ${err}`, { duration: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        className="mt-6 w-full md:w-auto"
      >
        Viết Đánh Giá Của Bạn
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Viết Đánh Giá Sản Phẩm</DialogTitle>
        <DialogContent>
          {/* Rating input */}
          <div className="flex justify-center my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="text-3xl cursor-pointer transition-all"
                style={{ color: star <= rating ? '#ffc300' : '#E0E0E0' }}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>
          <p className="text-center text-sm mb-4">Bạn chọn {rating} sao</p>

          {/* Comment input */}
          <TextField
            autoFocus
            margin="dense"
            label="Nội dung đánh giá"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default WriteReviewButton
