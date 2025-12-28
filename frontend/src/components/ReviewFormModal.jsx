import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitReview, resetSubmitStatus } from '~/redux/slices/reviewSlice'
import {
  Modal, Box, Typography, TextField, Button, Rating, IconButton,
  CircularProgress, Paper, Grid
} from '@mui/material'
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material'
import { toast } from 'sonner'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 600 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
}

const ReviewFormModal = ({ open, handleClose, productId, productName, productImage }) => {
  const dispatch = useDispatch()
  const { submitStatus } = useSelector((state) => state.reviews)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  const normalizedProductId = productId?.$oid || productId?._id || productId || null

  useEffect(() => {
    if (open) {
      setRating(5)
      setComment('')
      setMediaFiles([])
      setPreviewImages([])
      dispatch(resetSubmitStatus())
    }
  }, [open, dispatch])

  useEffect(() => {
    if (submitStatus === 'succeeded') {
      toast.success('Gửi đánh giá thành công! Đánh giá sẽ được hiển thị sau khi được kiểm duyệt.', { duration: 4000 })
      handleClose()
    } else if (submitStatus === 'failed') {
      // Lỗi đã được toast.error xử lý trong reviewSlice
    }
  }, [submitStatus, handleClose])

  // Xử lý chọn ảnh
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)

    // Cập nhật File objects
    setMediaFiles(files)

    // Tạo URL preview
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(newPreviews)
  }

  const handleRemoveFile = (indexToRemove) => {
    // Xóa File object
    setMediaFiles(prev => prev.filter((_, index) => index !== indexToRemove))

    // Xóa Preview URL và thu hồi bộ nhớ
    setPreviewImages(prev => {
      URL.revokeObjectURL(prev[indexToRemove])
      return prev.filter((_, index) => index !== indexToRemove)
    })
  }

  // Xử lý Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0 || comment.trim().length < 10) {
      toast.error('Vui lòng chọn Rating và nhập bình luận tối thiểu 10 ký tự.', { duration: 3000 })
      return
    }

    dispatch(submitReview({
      productId: normalizedProductId,
      rating,
      comment,
      mediaFiles
    }))
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Viết đánh giá sản phẩm
        </Typography>

        {/* Thông tin sản phẩm */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
          <img src={productImage} alt={productName} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px', marginRight: 15 }} />
          <Typography variant="subtitle1" fontWeight="medium">{productName}</Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography component="legend" sx={{ fontWeight: 'medium', mb: 1 }}>Chất lượng sản phẩm:</Typography>
            <Rating
              name="product-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue)
              }}
              precision={1}
              size="large"
              required
            />
          </Box>

          <TextField
            label="Bình luận chi tiết (Tối thiểu 10 ký tự)"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            required
          />

          {/* Chọn Ảnh */}
          <Box sx={{ mt: 2, mb: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-media"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-media">
              <Button variant="outlined" component="span" startIcon={<ImageIcon />}>
                                Chọn ảnh (Tối đa 5)
              </Button>
            </label>

            {/* Preview Ảnh */}
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {previewImages.map((src, index) => (
                <Grid item key={index}>
                  <Box sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img src={src} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFile(index)}
                      sx={{
                        position: 'absolute', top: -10, right: -10,
                        bgcolor: 'error.main', color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitStatus === 'loading'}
            sx={{ mt: 2, py: 1.5 }}
          >
            {submitStatus === 'loading' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Gửi Đánh Giá'
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}

export default ReviewFormModal
