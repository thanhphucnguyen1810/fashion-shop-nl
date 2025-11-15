import jwt from 'jsonwebtoken'
import User from '~/models/user.model'
import { env } from '~/config/environment'

// Helper: tạo token JWT
const generateToken = (user) => {
  // create JWT payload
  const payload = { user: { id: user._id, role: user.role } }
  // Sign and return the token along with user data
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '40h' })
}

// @desc   Register user
// @route  POST /api/users/register
// @access Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Registration
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'User already exists' })

    user = new User({ name, email, password })
    await user.save()

    const token = generateToken(user)

    // Send the user and token in response
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc   Login user
// @route  POST /api/users/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body
  console.log('Login body:', req.body)
  try {
    // Find the user by email
    const user = await User.findOne({ email })
    console.log(user)
    if (!user || !(await user.matchPassword(password))) {

      return res.status(400).json({ message: 'Invalid Credentials' })
    }

    const token = generateToken(user)

    // Send the user and token in response
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc   Social Login callback (Google, Facebook)
// @route  GET /api/users/auth/.../callback
// @access Public
// ============= SOCIAL LOGIN CALLBACK =============
export const socialLogin = async (req, res) => {
  const user = req.user
  const token = generateToken(user)

  const redirectURL = `${env.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(
    JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  )}`

  return res.redirect(redirectURL)
}


// @desc   Get profile
// @route  GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  const user = req.user
  const { name, gender, avatar } = req.body

  if (name) user.name = name
  if (gender) user.gender = gender
  if (avatar) user.avatar = avatar

  await user.save()

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    gender: user.gender,
    favorites: user.favorites
  })
}

// POST /api/users/favorites/:productId
export const addFavorite = async (req, res) => {
  const user = req.user
  const productId = req.params.productId

  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId)
    await user.save()
  }

  res.status(200).json(user.favorites)
}

// DELETE /api/users/favorites/:productId
export const removeFavorite = async (req, res) => {
  const user = req.user
  const productId = req.params.productId

  user.favorites = user.favorites.filter(id => id.toString() !== productId)
  await user.save()

  res.status(200).json(user.favorites)
}

/**

Khi người dùng đăng ký:

Client gửi POST /api/users/register với { name, email, password }
Route /register gọi hàm registerUser trong user.controller.js
Controller kiểm tra email, tạo User mới, hash mật khẩu, lưu DB.
Controller tạo token JWT và trả JSON { user, token } về client.


Khi người dùng đăng nhập:

Client gửi POST /api/users/login với { email, password }
Controller kiểm tra email và mật khẩu (dùng user.matchPassword())
Nếu đúng, tạo token JWT và trả { user, token }.


Khi lấy thông tin profile:

Client gửi GET /api/users/profile kèm header Authorization: Bearer <token>
Middleware protect xác thực token → gắn req.user
Controller getUserProfile trả req.user (user hiện tại) về client.

 */