import {
  getAllReviewsAdmin as getAllReviewsService,
  updateReviewStatus as updateReviewStatusService
} from '~/services/admin/admin.review.service'

// ================= GET ALL =================
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await getAllReviewsService()
    res.json(reviews)
  } catch (error) {
    console.error('Error getAllReviewsAdmin:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ================= UPDATE STATUS =================
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body

    const review = await updateReviewStatusService(req.params.id, status)

    if (!review) {
      return res.status(404).json({ message: 'Review không tồn tại' })
    }

    res.json({
      message: 'Cập nhật trạng thái thành công',
      review
    })
  } catch (error) {
    console.error('Error updateReviewStatus:', error)
    res.status(500).json({ message: 'Server error' })
  }
}