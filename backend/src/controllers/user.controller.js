import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'
import { env } from '~/config/environment'

const registerUser = async (req, res, next) => {
  try {
    const result = await userService.registerUser(req.body)

    res.locals.userId = result.userId

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const verifyEmail = async (req, res, next) => {
  try {
    const result = await userService.verifyEmail(req.params.token)
    return res.redirect(result)
  } catch (error) { next(error) }
}

const loginUser = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body)

    if (result.userId) {
      res.locals.userId = result.userId
    }

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const { accessToken, refreshToken, ...safeResult } = result
    res.status(StatusCodes.OK).json(safeResult)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) { next(error)}
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshTokenService(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: env.BUILD_MODE === 'production',
      sameSite: env.BUILD_MODE === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    })

    res.status(StatusCodes.OK).json({ user: result.user })
  } catch (error) { next(error) }
}

const socialLogin = async (req, res, next) => {
  try {
    const result = await userService.socialLogin(req.user)
    return res.redirect(result)
  } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {
  try {
    const result = await userService.forgotPassword(req.body.email)

    if (result.userId) {
      res.locals.userId = result.userId
    }

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const resetPassword = async (req, res, next) => {
  try {
    const result = await userService.resetPassword(req.params.token, req.body.password)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req.user, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getUserProfile = async (req, res, next) => {
  try {
    const result = await userService.getUserProfile(req.user)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const updateUserProfile = async (req, res, next) => {
  try {
    const result = await userService.updateUserProfile(req.user, req.body, req.file)

    res.locals.userId = req.user._id

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const addFavorite = async (req, res, next) => {
  try {
    const result = await userService.addFavorite(req.user._id, req.params.productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const removeFavorite = async (req, res, next) => {
  try {
    const result = await userService.removeFavorite(req.user._id, req.params.productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  registerUser,
  verifyEmail,
  loginUser,
  logout,
  refreshToken,
  socialLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  getUserProfile,
  updateUserProfile,
  addFavorite,
  removeFavorite
}
