import axiosLib from 'axios'
import store from '~/redux/store'
import { setUser, logout } from '~/redux/slices/authSlice'

const BASE_URL = import.meta.env.VITE_API_URL

const axiosInstance = axiosLib.create({
  baseURL: BASE_URL,
  withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await axiosLib.post(
          `${BASE_URL}/api/users/refresh-token`,
          {},
          { withCredentials: true }
        )

        const { accessToken } = res.data


        localStorage.setItem('userToken', accessToken)

        store.dispatch(setUser({
          token: accessToken,
          user: store.getState().auth.user
        }))

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        store.dispatch(logout())
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance