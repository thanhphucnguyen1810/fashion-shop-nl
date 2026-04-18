/* eslint-disable no-unused-vars */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutUser } from '~/redux/slices/authSlice'
import { refreshTokenAPI } from '~/apis/authAPI'

// use redux in non-component file
let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Khởi tạo một đối tượng axios mục đích  để custom và cấu hình chung
const authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của một request (10 phút)
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: cho phép axios tự động gửi cookie trong mỗi lần request lên BE
// phục vụ chúng ta sẽ lưu JWT tokens vào httpOnly của trình duyệt (đính kèm cookie lên trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptor đánh chặn giữa response và request
// https://axios-http.com/docs/interceptors

// Interceptor request can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Do something before request is sent
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
}
)

// Khởi tạo một cái promise cho việc  gọi api refreshToken
// Mục đích: khi nào gọi API refreshToken xong thì mới retry lại nhiều API bị lỗi trước đó
let refreshTokenPromise = null

// Interceptor request can thiệp vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  // Mọi mã http status ngoài 200-299 là error rơi vào đây

  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  // XỬ LÝ refreshToken tự động
  // TH1: NHận mã 401 từ BE, thì đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUser(false))
  }
  // TH2: NHận mã 410 (GONE), gọi API refreshToken
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một giá trị _retry luôn = true trong thời gian chờ, đảm bảo việc refershToken này chỉ luôn gọi 1 lần tại 1 thời điểm
    originalRequests._retry = true

    // Kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi API refresh_token đồng thời gắn vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ api refreshToken thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUser(false))
          // return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API có ok hay lỗi thì luôn gán lại refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }

    // cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
    return refreshTokenPromise.then((accessToken) => {
      return authorizedAxiosInstance(originalRequests)
    })
  }
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance

