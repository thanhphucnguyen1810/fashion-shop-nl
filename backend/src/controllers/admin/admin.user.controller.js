import bcrypt from 'bcryptjs'
import userModel from '~/models/user.model.js'

// @desc Get all users (Admin only)
// @route GET /api/admin/users
// @access Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password')
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Add a new user (Admin only)
// @route POST /api/admin/users
// @access Private/Admin
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    let user = await userModel.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    })
    await user.save()

    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Update user info (Admin only)
// @route PUT /api/admin/users/:id
// @access Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10)
    }


    const updatedUser = await user.save()
    res.json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc Delete a user (Admin only)
// @route DELETE /api/admin/users/:id
// @access Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.deleteOne()
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

