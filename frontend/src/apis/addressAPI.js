import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// ================= ADDRESS =================

// GET ALL
export const getAddressesAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/address`)
  return response.data
}

// ADD
export const addAddressAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/address`, data)
  return response.data
}

// UPDATE
export const updateAddressAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/address/${id}`, data)
  return response.data
}

// DELETE
export const deleteAddressAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/address/${id}`)
  return response.data
}

// SET DEFAULT
export const setDefaultAddressAPI = async (id) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/address/default/${id}`)
  return response.data
}
