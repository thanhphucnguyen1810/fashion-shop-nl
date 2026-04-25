import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// GET MY ORDERS
export const fetchUserOrdersAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/orders/my-orders`
  )
  return res.data
}

// GET ORDER DETAILS
export const fetchOrderDetailsAPI = async (orderId) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/orders/${orderId}`
  )
  return res.data
}

// CREATE TEMP ORDER (BUY NOW)
export const createTemporaryOrderAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/orders/buy-now`,
    data
  )
  return res.data
}

export const confirmReceivedAPI = async (orderId) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/api/orders/${orderId}/confirm-received`)
  return res.data
}
