import userModel from '~/models/user.model'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'

const protect = (req, res, next) => {
  try {
    let token = null

    // 1. lấy từ cookie
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken
    }

    // 2. fallback header
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'No token' })
    }

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    next()
  } else {
    res.status(403).json({ message: 'Access denied: Staff or Admin only' })
  }
}

export {
  protect,
  admin
}
