/* eslint-disable no-unused-vars */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

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
  interceptorLoadingElements(false)

  // XỬ LÝ refreshToken tự động
  // TH1: NHận mã 401 từ BE, thì đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
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
          axiosReduxStore.dispatch(logoutUserAPI(false))
          // return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API có ok hay lỗi thì luôn gán lại refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }

    // cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
    return refreshTokenPromise.then((accessToken) => {
      //B1: với TH lưu accessToken vào localStorage hoặc chỗ khác thì thêm code ở đây
      // Hiện ko cần xử lý vì đã đưa vào cookie
      // axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
      // B2: Return lại axios instance của ta kết hợp với các originalRequests để gọi lại những API ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })

  }
  // XỬ LÝ TẬP TRUNG PHẦN HIỂN THỊ THÔNG BÁO LỖI TRẢ VỀ TỪ MỌI API
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify hiển thị all lỗi trừ - 410 - GONE PHỤC VỤ VIỆC TỰ ĐỘNG REFRESHTOKEN
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance