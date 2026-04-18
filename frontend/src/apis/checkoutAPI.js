import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// CREATE
export const createCheckoutAPI = async (checkoutData) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/checkout/create`,
    checkoutData
  )
  return res.data
}

// DETAIL
export const getCheckoutDetailAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/checkout/${id}`
  )
  return res.data
}

// FINALIZE
export const finalizeOrderAPI = async (checkoutId) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/checkout/finalize/${checkoutId}`,
    {}
  )
  return res.data
}

// QR
export const getSepayQrInfoAPI = async (checkoutId) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/checkout/sepay-qr/${checkoutId}`
  )
  return res.data
}

// CHECK STATUS
export const checkPaymentStatusAPI = async (checkoutId) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/checkout/sepay-status/${checkoutId}`
  )
  return res.data
}
