/* eslint-disable no-console */
import subscriberModel from '~/models/subscribe.model.js'

// @desc Handle newsletter subscription
// @route POST /api/subscribe
// @access Public
export const handleSubscription = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  try {
    // Kiểm tra email đã tồn tại chưa
    let subscriber = await subscriberModel.findOne({ email })

    if (subscriber) {
      return res.status(400).json({ message: 'Email is already subscribed' })
    }

    // Tạo mới subscriber
    subscriber = new subscriberModel({ email })
    await subscriber.save()

    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}
