import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const BASE = `${API_ROOT}/api/admin/stock-imports`

export const fetchStockImportsAPI = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await authorizedAxiosInstance.get(`${BASE}?${query}`)
  return res.data
}

export const fetchStockImportDetailAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(`${BASE}/${id}`)
  return res.data
}

export const createStockImportAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(BASE, data)
  return res.data
}

export const deleteStockImportAPI = async (id) => {
  await authorizedAxiosInstance.delete(`${BASE}/${id}`)
  return id
}
