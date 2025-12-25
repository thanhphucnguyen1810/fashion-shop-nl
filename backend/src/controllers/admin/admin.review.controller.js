import Review from '~/models/review.model.js'

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('productId', 'name thumbnail images')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error('Error getAllReviewsAdmin:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body

    const review = await Review.findById(req.params.id)

    if (!review)
      return res.status(404).json({ message: 'Review không tồn tại' })

    review.status = status
    await review.save()

    res.json({ message: 'Cập nhật trạng thái thành công', review })
  } catch (error) {
    console.error('Error updateReviewStatus:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
