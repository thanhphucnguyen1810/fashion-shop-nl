import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const BASE = `${API_ROOT}/api/admin/orders`

export const fetchAllOrdersAPI = async () => {
  const res = await authorizedAxiosInstance.get(BASE)
  return res.data
}

export const fetchAdminOrderDetailsAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(`${BASE}/${id}`)
  return res.data
}

export const fetchOrdersByUserAPI = async (userId) => {
  const res = await authorizedAxiosInstance.get(`${BASE}/user/${userId}`)
  return res.data
}

export const updateOrderStatusAPI = async ({ id, status }) => {
  const res = await authorizedAxiosInstance.put(`${BASE}/${id}`, { status })
  return res.data
}

export const deleteOrderAPI = async (id) => {
  await authorizedAxiosInstance.delete(`${BASE}/${id}`)
  return id
}
