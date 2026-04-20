import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const BASE = `${API_ROOT}/api/admin/products`

export const fetchAdminProductsAPI = async ({ search = '', page = 1 } = {}) => {
  const res = await authorizedAxiosInstance.get(`${BASE}?search=${search}&page=${page}`)
  return res.data
}

export const createProductAPI = async (formData) => {
  const res = await authorizedAxiosInstance.post(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const updateProductAPI = async ({ id, productData }) => {
  const res = await authorizedAxiosInstance.put(`${BASE}/${id}`, productData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const deleteProductAPI = async (id) => {
  await authorizedAxiosInstance.delete(`${BASE}/${id}`)
  return id
}

// VARIANTS
export const upsertVariantAPI = async (productId, variantData) => {
  const res = await authorizedAxiosInstance.put(`${BASE}/${productId}/variants`, variantData)
  return res.data
}

export const deleteVariantAPI = async (productId, variantId) => {
  const res = await authorizedAxiosInstance.delete(`${BASE}/${productId}/variants/${variantId}`)
  return res.data
}

export const deleteSizeAPI = async (productId, variantId, sizeId) => {
  const res = await authorizedAxiosInstance.delete(
    `${BASE}/${productId}/variants/${variantId}/sizes/${sizeId}`
  )
  return res.data
}
