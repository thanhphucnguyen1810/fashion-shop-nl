import userModel from '~/models/user.model.js'
import cloudinary from '~/config/cloudinary.config'

// Hàm chuyển đổi Buffer (từ Multer) sang Base64 Data URL để Cloudinary upload
const bufferToDataURI = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
}

// @desc Add a new user (Admin only)
export const createUser = async (req, res) => {
  const { name, email, password, role, gender } = req.body

  try {
    let user = await userModel.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    let avatarData = {}

    if (req.file) {
      // CHUYỂN BUFFER THÀNH DATA URI VÀ TẢI LÊN CLOUDINARY
      const fileDataURI = bufferToDataURI(req.file)

      const uploadResult = await cloudinary.uploader.upload(fileDataURI, {
        folder: 'user_avatars'
      })

      avatarData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
    }

    user = new userModel({
      name,
      email,
      password: password,
      role: role || 'customer',
      gender: gender || 'other',
      avatar: avatarData.url ? avatarData : undefined
    })


    await user.save()

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// @desc Update user info (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, gender } = req.body

    const user = await userModel.findById(id).select('+avatar')
    if (!user) return res.status(404).json({ message: 'User not found' })

    const updatedData = { name, email, role, gender }

    if (req.file) {
      // KIỂM TRA VÀ XÓA ẢNH CŨ TRÊN CLOUDINARY
      const isDefaultAvatar = user.avatar?.public_id === 'default_avatar_id'
      if (user.avatar?.public_id && !isDefaultAvatar) {
        await cloudinary.uploader.destroy(user.avatar.public_id)
      }

      // TẢI ẢNH MỚI LÊN
      const fileDataURI = bufferToDataURI(req.file)
      const uploadResult = await cloudinary.uploader.upload(fileDataURI, {
        folder: 'user_avatars'
      })

      // Cập nhật URL/ID mới
      updatedData.avatar = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
    }

    // Cập nhật user
    const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, { new: true }).select('-password')

    res.json({ message: 'User updated', user: updatedUser })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}


// @desc Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password')
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Delete a user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // KIỂM TRA VÀ XÓA ẢNH TRÊN CLOUDINARY
    const isDefaultAvatar = user.avatar?.public_id === 'default_avatar_id'
    if (user.avatar?.public_id && !isDefaultAvatar) {
      await cloudinary.uploader.destroy(user.avatar.public_id)
    }

    // Tiến hành xóa user
    await userModel.findByIdAndDelete(id)

    res.json({ message: 'User deleted' })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Get a single user by ID (Admin only)
// @route GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    // Lấy user, loại trừ mật khẩu
    const user = await userModel.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid User ID format' })
    }
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Block/Unblock a user (Admin only)
// @route PATCH /api/admin/users/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isBlocked } = req.body

    if (typeof isBlocked !== 'boolean') {
      return res.status(400).json({ message: 'isBlocked status is required and must be boolean' })
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { isBlocked: isBlocked },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const statusMessage = user.isBlocked ? 'blocked' : 'unblocked'
    res.json({ message: `User successfully ${statusMessage}`, user })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

