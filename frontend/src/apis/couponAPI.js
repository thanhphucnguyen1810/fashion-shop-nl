import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const BASE = `${API_ROOT}/api/admin/coupons`

export const fetchCouponsAPI = async () => {
  const res = await authorizedAxiosInstance.get(BASE)
  return res.data.data
}

export const createCouponAPI = async (couponData) => {
  const res = await authorizedAxiosInstance.post(BASE, couponData)
  return res.data.data
}

export const updateCouponAPI = async ({ _id, ...data }) => {
  const res = await authorizedAxiosInstance.put(`${BASE}/${_id}`, data)
  return res.data.data
}

export const deleteCouponAPI = async (couponId) => {
  await authorizedAxiosInstance.delete(`${BASE}/${couponId}`)
  return couponId
}
