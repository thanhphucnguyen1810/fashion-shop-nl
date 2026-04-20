import {
  createUserService,
  updateUserService,
  getAllUsersService,
  deleteUserService,
  getUserByIdService,
  toggleUserStatusService
} from '~/services/admin/admin.user.service'

// ===== CREATE =====
export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body, req.file)

    res.status(201).json({
      message: 'User created successfully',
      user: { ...user.toObject(), password: undefined }
    })
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(400).json({ message: 'Email đã tồn tại' })
    }

    res.status(500).json({ message: 'Server Error' })
  }
}

// ===== UPDATE =====
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body, req.file)

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User updated', user: updatedUser })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// ===== GET ALL =====
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// ===== DELETE =====
export const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id)

    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// ===== GET BY ID =====
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid User ID format' })
    }
    res.status(500).json({ message: 'Server Error' })
  }
}

// ===== TOGGLE STATUS =====
export const toggleUserStatus = async (req, res) => {
  try {
    const { isBlocked } = req.body

    const user = await toggleUserStatusService(req.params.id, isBlocked)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      message: `User successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      user
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}
