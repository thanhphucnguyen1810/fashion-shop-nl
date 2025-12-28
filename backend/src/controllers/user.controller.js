
import jwt from 'jsonwebtoken'
import User from '~/models/user.model'
import { env } from '~/config/environment'
import crypto from 'crypto'
import { sendPasswordResetEmail, sendVerificationEmail } from '~/utils/sendEmail'
import streamifier from 'streamifier'
import cloudinary from '~/config/cloudinary.config'

// Helper: tạo token JWT
const generateToken = (user) => {
  // create JWT payload
  const payload = { user: { id: user._id, role: user.role } }
  // Sign and return the token along with user data
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '40h' })
}

// ======================= REGISTER =======================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    let user = await User.findOne({ email })
    // 1. Kiểm tra user đã tồn tại (Chấp nhận tạo lại token nếu user đã tồn tại nhưng chưa verified)
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' })
    }

    if (user && !user.isVerified) {
      // Nếu user tồn tại nhưng chưa xác minh, ta cập nhật lại token và gửi lại email. Giúp người dùng không phải xóa tài khoản cũ để đăng ký lại
      user.name = name
      user.password = password // Mật khẩu sẽ được hash lại qua pre('save')
    }

    if (!user) user = new User({ name, email, password })

    // 2. Tạo token xác minh
    const verificationToken = user.createEmailVerificationToken()

    // 3. Lưu user (token xác minh và mật khẩu mới/cũ đã hash)
    await user.save()
    // ghi log
    res.locals.userId = user._id
    try {
      console.log('>>> SENDING EMAIL TO:', email)
      await sendVerificationEmail({
        to: user.email,
        from: env.SENDGRID_SENDER,
        subject: 'Xác minh Email',
        name: user.name,
        token: verificationToken
      })

      // 5. Trả về phản hồi cho Frontend (KHÔNG CÓ JWT TOKEN)
      res.status(201).json({
        status: 'success',
        message: 'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác minh tài khoản.',
        redirectEmail: user.email
      })
    } catch (err) {
      // Nếu gửi email thất bại, xóa token và báo lỗi
      user.emailVerificationToken = undefined
      user.emailVerificationExpires = undefined
      await user.save({ validateBeforeSave: false })

      console.error('Lỗi khi gửi email xác minh:', err)
      res.status(500).json({ message: 'Đăng ký thành công nhưng lỗi gửi email xác minh. Vui lòng thử lại sau.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// ======================= VERIFY EMAIL =======================
export const verifyEmail = async (req, res) => {
  // 1. Lấy token (chưa hash) từ params
  const token = req.params.token

  // 2. Hash token (để so sánh với token đã lưu trong DB)
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  try {
    // 3. Tìm user bằng token đã hash VÀ đảm bảo token chưa hết hạn
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() } // $gt: greater than (lớn hơn thời gian hiện tại)
    })

    if (!user) return res.status(400).json({ message:'Token không hợp lệ hoặc hết hạn' })


    // 5. Cập nhật trạng thái người dùng
    user.isVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    // lưu log
    res.locals.userId = user._id

    // 6. Lưu user
    await user.save({ validateBeforeSave: false })

    // liên quan lưu log
    res.locals.userId = user._id

    // 7. Tạo token JWT và redirect về trang thành công (Tùy chọn: Tự động đăng nhập)
    const newToken = generateToken(user)

    const redirectURL = `${env.FRONTEND_URL}/login?status=verified&token=${newToken}&user=${encodeURIComponent(
      JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: true })
    )}`

    return res.redirect(redirectURL)
  } catch (error) {
    console.error('Lỗi khi xác minh email:', error)
    const errorRedirectURL = `${env.FRONTEND_URL}/verify-status?status=error&message=${encodeURIComponent('Lỗi server khi xác minh tài khoản.')}`
    return res.redirect(errorRedirectURL)
  }
}

// ======================= LOGIN USER =======================
export const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    // Find the user by email
    const user = await User.findOne({ email }).populate({
      path: 'favorites',
      select: 'name price images slug'
    })
    if (!user || !(await user.matchPassword(password))) {

      return res.status(400).json({ message: 'Invalid Credentials' })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Tài khoản chưa được xác minh. Vui lòng kiểm tra email của bạn để kích hoạt tài khoản.',
        isVerified: false // Thêm flag để FE xử lý
      })
    }

    res.locals.userId = user._id

    const token = generateToken(user)

    // Send the user and token in response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        gender: user.gender,
        favorites: user.favorites
      },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// ============= SOCIAL LOGIN CALLBACK =============
export const socialLogin = async (req, res) => {
  const user = req.user
  const populatedUser = await User.findById(user._id).populate({
    path: 'favorites',
    select: 'name price images slug'
  })
  if (!populatedUser) return res.redirect(`${env.FRONTEND_URL}/login`)

  // ghi log
  res.locals.userId = populatedUser._id

  const token = generateToken(populatedUser)

  const redirectURL = `${env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(
    JSON.stringify({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      avatar: populatedUser.avatar,
      gender: populatedUser.gender,
      favorites: populatedUser.favorites
    })
  )}`

  return res.redirect(redirectURL)
}

// ======================= FORGOT PASSWORD =======================
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email' })

  try {
    const user = await User.findOne({ email })

    // Nếu không tìm thấy user
    if (!user) {
      return res.status(200).json({
        message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.'
      })
    }

    // ghi log
    res.locals.userId = user._id

    // Tạo token đặt lại
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // Tạo URL đặt lại mật khẩu cho Frontend
    const resetURL = `${env.FRONTEND_URL}/reset-password/${resetToken}`

    try {
      console.log('>>> SENDING EMAIL TO:', email)
      await sendPasswordResetEmail({
        to: user.email,
        from: env.SENDGRID_SENDER,
        subject: 'Đặt lại mật khẩu của bạn (Hết hạn sau 10 phút)',
        name: user.name,
        resetURL: resetURL
      })

      res.status(200).json({
        status: 'success',
        message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.'
      })
    } catch (err) {
      await user.save({ validateBeforeSave: false })
      return res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại.' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// ======================= RESET PASSWORD =======================
export const resetPassword = async (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu mới.' })
  }
  // 1. Lấy token (chưa hash) từ params
  const token = req.params.token

  // 2. Hash token (để so sánh với token đã lưu trong DB)
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  console.log('Token từ URL:', token)
  console.log('Hashed Token (dùng để tìm kiếm):', hashedToken)

  try {
    // 3. Tìm user bằng token đã hash VÀ đảm bảo token chưa hết hạn
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    // 4. Xử lý lỗi
    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
    }

    // 5. Cập nhật mật khẩu mới (Mongoose pre('save') middleware sẽ tự động hash)
    user.password = req.body.password

    // 6. Xóa token và thời gian hết hạn sau khi đặt lại thành công
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    // ghi log
    res.locals.userId = user._id

    // 7. Lưu user (middleware pre('save') sẽ chạy để hash mật khẩu mới)
    await user.save()

    // 8. Đăng nhập user ngay lập tức (tùy chọn) hoặc yêu cầu đăng nhập lại
    const newToken = generateToken(user)

    res.status(200).json({
      status: 'success',
      message: 'Đặt lại mật khẩu thành công.',
      token: newToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// ======================= CHANGE PASSWORD =======================
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  try {
    const user = await User.findById(req.user._id).select('+password')

    // 1. Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác.' })
    }

    // 2. Gán mật khẩu mới (Mongoose sẽ tự hash nhờ pre-save)
    user.password = newPassword
    await user.save()

    res.status(200).json({ message: 'Đổi mật khẩu thành công!' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server.' })
  }
}

// ======================= GET PROFILE =======================
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user

    const populatedUser = await User.findById(user._id).populate({
      path: 'favorites',
      select: 'name price images slug'
    })

    // Xử lý nếu không tìm thấy user (hiếm khi xảy ra nếu auth middleware đúng)
    if (!populatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      avatar: populatedUser.avatar,
      avatarCloudId: populatedUser.avatarCloudId,
      gender: populatedUser.gender,
      favorites: populatedUser.favorites
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// ======================= UPDATE PROFILE =======================
export const updateUserProfile = async (req, res) => {
  const user = req.user
  const { name, gender } = req.body

  try {
    if (name) user.name = name
    if (gender) user.gender = gender
    if (req.file) {
      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'user_avatars' },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          streamifier.createReadStream(fileBuffer).pipe(uploadStream)
        })
      }

      const uploadResult = await uploadFromBuffer(req.file.buffer)

      // Xóa avatar cũ nếu có
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id)
      }

      user.avatar = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
      user.avatarCloudId = uploadResult.public_id
    }

    // ghi log
    res.locals.userId = user._id

    await user.save()

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      avatarCloudId: user.avatarCloudId,
      gender: user.gender,
      favorites: user.favorites
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ message: 'Server Error khi cập nhật profile.' })
  }
}

// =======================ADD FAVORITE =======================
export const addFavorite = async (req, res) => {
  const user = req.user
  const productId = req.params.productId

  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId)
    await user.save()
  }

  const populatedUser = await User.findById(user._id).populate({
    path: 'favorites',
    // Chỉ chọn các trường cần thiết cho FE: Tên, Giá, Ảnh
    select: 'name price images slug'
  })

  // Trả về mảng favorites đã được populate
  res.status(200).json(populatedUser.favorites)
}

// =======================REMOVE FAVORITE =======================
export const removeFavorite = async (req, res) => {
  const user = req.user
  const productId = req.params.productId

  user.favorites = user.favorites.filter(id => id.toString() !== productId)
  await user.save()

  const populatedUser = await User.findById(user._id).populate({
    path: 'favorites',
    // Chỉ chọn các trường cần thiết
    select: 'name price images slug'
  })

  // Trả về mảng favorites đã được populate
  res.status(200).json(populatedUser.favorites)
}

