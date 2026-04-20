import crypto from 'crypto'
import streamifier from 'streamifier'
import { env } from '~/config/environment'
import userModel from '~/models/user.model'
import { sendPasswordResetEmail, sendVerificationEmail } from '~/utils/sendEmail'
import cloudinary from '~/config/cloudinary.config'
import { JwtProvider } from '~/providers/jwt.provider'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

// ======================= REGISTER =======================
const registerUser = async (reqBody) => {
  const { name, email, password } = reqBody

  let user = await userModel.findOne({ email })

  if (user && user.isVerified) {
    throw new Error('User already exists')
  }

  if (user && !user.isVerified) {
    user.name = name
    user.password = password
  }

  if (!user) user = await userModel.create({ name, email, password })

  const verificationToken = user.createEmailVerificationToken()
  await user.save()

  try {
    await sendVerificationEmail({
      to: user.email,
      subject: 'Xác minh Email',
      name: user.name,
      token: verificationToken
    })

    return {
      status: 'success',
      message: 'Đăng ký thành công!',
      redirectEmail: user.email,
      userId: user._id
    }
  } catch (error) {
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save({ validateBeforeSave: false })
    throw error
  }
}

// ======================= VERIFY EMAIL =======================
const verifyEmail = async (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await userModel.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  })

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

  user.isVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpires = undefined

  await user.save({ validateBeforeSave: false })

  return `${env.FRONTEND_URL}/login?status=verified`
}

// ======================= REFRESH TOKEN =======================
const refreshTokenService = async (clientToken) => {
  if (!clientToken) throw new Error('No refresh token')

  const decoded = JwtProvider.verifyToken(
    clientToken,
    env.REFRESH_TOKEN_SECRET_SIGNATURE
  )

  const user = await userModel.findById(decoded._id)

  if (!user || user.refreshToken !== clientToken) {
    throw new Error('Refresh token invalid')
  }

  const newAccessToken = JwtProvider.generateToken(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )

  return { accessToken: newAccessToken, user }
}

// ======================= LOGIN =======================
const loginUser = async (reqBody) => {
  const { email, password } = reqBody

  const user = await userModel.findOne({ email }).populate({
    path: 'favorites',
    select: 'name price images slug'
  })

  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid Credentials')
  }

  if (!user.isVerified) {
    return {
      message: 'Tài khoản chưa được xác minh.',
      isVerified: false
    }
  }

  const userInfo = {
    _id: user._id,
    email: user.email,
    role: user.role
  }

  const accessToken = JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )

  const refreshToken = JwtProvider.generateToken(
    userInfo,
    env.REFRESH_TOKEN_SECRET_SIGNATURE,
    env.REFRESH_TOKEN_LIFE
  )

  user.refreshToken = refreshToken
  await user.save()

  return {
    accessToken,
    refreshToken,
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
    userId: user._id
  }
}

// ======================= SOCIAL LOGIN =======================
const socialLogin = async (user) => {
  const populatedUser = await userModel.findById(user._id).populate({
    path: 'favorites',
    select: 'name price images slug'
  })

  if (!populatedUser) return `${env.FRONTEND_URL}/login`

  const token = JwtProvider.generateToken(
    {
      _id: populatedUser._id,
      email: populatedUser.email,
      role: populatedUser.role
    },
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )

  return `${env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(
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
}

// ======================= FORGOT PASSWORD =======================
const forgotPassword = async (email) => {
  const user = await userModel.findOne({ email })

  if (!user) {
    return { message: 'Nếu email tồn tại, một liên kết đã được gửi.' }
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `${env.FRONTEND_URL}/reset-password/${resetToken}`

  await sendPasswordResetEmail({
    to: user.email,
    subject: 'Đặt lại mật khẩu',
    name: user.name,
    resetURL
  })

  return {
    status: 'success',
    message: 'Email đặt lại mật khẩu đã được gửi.',
    userId: user._id
  }
}

// ======================= RESET PASSWORD =======================
const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  if (!user) throw new Error('Token không hợp lệ hoặc hết hạn')

  user.password = newPassword
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  const newToken = JwtProvider.generateToken(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    env.ACCESS_TOKEN_LIFE
  )

  return {
    status: 'success',
    message: 'Đặt lại mật khẩu thành công.',
    token: newToken,
    userId: user._id
  }
}

// ======================= CHANGE PASSWORD =======================
const changePassword = async (user, reqBody) => {
  try {
    const { oldPassword, newPassword } = reqBody

    const currentUser = await userModel.findById(user._id).select('+password')

    const isMatch = await currentUser.matchPassword(oldPassword)
    if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác.')

    currentUser.password = newPassword
    await currentUser.save()

    return { message: 'Đổi mật khẩu thành công!' }
  } catch (error) { throw error }
}

// ======================= PROFILE =======================
const getUserProfile = async (user) => {
  try {
    const populatedUser = await userModel.findById(user._id).populate({
      path: 'favorites',
      select: 'name price images slug'
    })

    if (!populatedUser) throw new Error('User not found')
    return populatedUser
  } catch (error) { throw error }
}

// ======================= UPDATE PROFILE =======================
const updateUserProfile = async (user, reqBody, file) => {
  const updateData = {}

  if (reqBody.name) updateData.name = reqBody.name
  if (reqBody.gender) updateData.gender = reqBody.gender

  if (file) {
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'user_avatars' },
          (error, result) => (error ? reject(error) : resolve(result))
        )
        streamifier.createReadStream(file.buffer).pipe(stream)
      })

    const uploadResult = await uploadStream()

    // Lấy avatar cũ để xóa trên Cloudinary
    const oldUser = await userModel.findById(user._id).select('avatar')
    if (oldUser?.avatar?.public_id) {
      await cloudinary.uploader.destroy(oldUser.avatar.public_id)
    }

    updateData.avatar = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }
  }

  // Dùng findByIdAndUpdate thay vì save()
  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    { $set: updateData },
    { new: true }
  )

  return updatedUser
}

// ======================= FAVORITES =======================
const addFavorite = async (userId, productId) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) throw new Error('User not found')

    const isExist = user.favorites.some(id => id.toString() === productId)

    if (!isExist) {
      user.favorites.push(productId)
      await user.save()
    }

    const result = await userModel.findById(userId).populate({
      path: 'favorites',
      select: 'name price images slug'
    })

    return result.favorites
  } catch (error) { throw error }
}

const removeFavorite = async (userId, productId) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) throw new Error('User not found')

    user.favorites = user.favorites.filter(id => id.toString() !== productId)

    await user.save()
    const result = await userModel.findById(userId).populate({
      path: 'favorites',
      select: 'name price images slug'
    })

    return result.favorites
  } catch (error) { throw error }
}

export const userService = {
  registerUser,
  verifyEmail,
  refreshTokenService,
  loginUser,
  socialLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  addFavorite,
  removeFavorite
}
