import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'

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
    const result = await userService.loginUser(req.body, res)

    if (result.userId) {
      res.locals.userId = result.userId
    }

    res.status(StatusCodes.OK).json(result)
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
    const result = await userService.addFavorite(req.user, req.params.productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const removeFavorite = async (req, res, next) => {
  try {
    const result = await userService.removeFavorite(req.user, req.params.productId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  registerUser,
  verifyEmail,
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
