import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// REGISTER
export const registerUserAPI = async (userData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/register`, userData)
  return response.data
}

// LOGIN
export const loginUserAPI = async (userData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/login`, userData)
  return response.data
}

// LOGOUT
export const logoutUserAPI = async () => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/users/logout`)
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/users/refresh-token`)
  return response.data
}

// FORGOT PASSWORD
export const forgotPasswordAPI = async (email) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/forgot-password`, { email })
  return response.data
}

// RESET PASSWORD
export const resetPasswordAPI = async ({ token, password }) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/users/reset-password/${token}`,
    { password }
  )
  return response.data
}

// FAVORITE
export const addFavoriteAPI = async (productId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/favorites/${productId}`)
  return response.data
}

export const removeFavoriteAPI = async (productId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/users/favorites/${productId}`)
  return response.data
}
