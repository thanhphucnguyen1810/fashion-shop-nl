import userModel from '~/models/user.model.js'
import cloudinary from '~/config/cloudinary.config'

// ===== HELPERS =====
const bufferToDataURI = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
}

// ===== CREATE USER =====
export const createUserService = async (data, file) => {
  const { name, email, password, role, gender } = data

  const existingUser = await userModel.findOne({ email })
  if (existingUser) {
    throw new Error('EMAIL_EXISTS')
  }

  let avatarData = {}

  if (file) {
    const fileDataURI = bufferToDataURI(file)

    const uploadResult = await cloudinary.uploader.upload(fileDataURI, {
      folder: 'user_avatars'
    })

    avatarData = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }
  }

  const user = new userModel({
    name,
    email,
    password,
    role: role || 'customer',
    gender: gender || 'other',
    avatar: avatarData.url ? avatarData : undefined
  })

  await user.save()

  return user
}

// ===== UPDATE USER =====
export const updateUserService = async (id, data, file) => {
  const user = await userModel.findById(id).select('+avatar')
  if (!user) return null

  const updatedData = {
    name: data.name,
    email: data.email,
    role: data.role,
    gender: data.gender
  }

  if (file) {
    const isDefaultAvatar = user.avatar?.public_id === 'default_avatar_id'

    if (user.avatar?.public_id && !isDefaultAvatar) {
      await cloudinary.uploader.destroy(user.avatar.public_id)
    }

    const fileDataURI = bufferToDataURI(file)

    const uploadResult = await cloudinary.uploader.upload(fileDataURI, {
      folder: 'user_avatars'
    })

    updatedData.avatar = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(id, updatedData, { new: true })
    .select('-password')

  return updatedUser
}

// ===== GET ALL USERS =====
export const getAllUsersService = async () => {
  return userModel.find({}).select('-password')
}

// ===== DELETE USER =====
export const deleteUserService = async (id) => {
  const user = await userModel.findById(id)
  if (!user) return null

  const isDefaultAvatar = user.avatar?.public_id === 'default_avatar_id'

  if (user.avatar?.public_id && !isDefaultAvatar) {
    await cloudinary.uploader.destroy(user.avatar.public_id)
  }

  await userModel.findByIdAndDelete(id)
  return true
}

// ===== GET USER BY ID =====
export const getUserByIdService = async (id) => {
  return userModel.findById(id).select('-password')
}

// ===== TOGGLE STATUS =====
export const toggleUserStatusService = async (id, isBlocked) => {
  const user = await userModel
    .findByIdAndUpdate(id, { isBlocked }, { new: true })
    .select('-password')

  return user
}
