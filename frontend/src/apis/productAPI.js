import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// GET PRODUCTS
export const fetchProductsAPI = async (params) => {
  const query = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) query.append(key, value)
  })

  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/products?${query.toString()}`
  )
  return res.data
}

// GET DETAILS
export const fetchProductDetailsAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/products/${id}`)
  return res.data
}

// UPDATE PRODUCT
export const updateProductAPI = async ({ id, productData }) => {
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/api/products/${id}`,
    productData
  )
  return res.data
}

// SIMILAR
export const fetchSimilarProductsAPI = async (id) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/products/similar/${id}`
  )
  return res.data
}

// REVIEWS
export const fetchProductReviewsAPI = async (productId) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/api/reviews/product/${productId}`
  )
  return res.data
}

// VARIANTS
export const fetchVariantsAPI = async (productId) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/products/${productId}/variants`)
  return res.data
}

export const upsertVariantAPI = async (productId, variantData) => {
  // variantData: { color, sizes: [{ size, price, stock, sku }] }
  const res = await authorizedAxiosInstance.put(
    `${API_ROOT}/api/products/${productId}/variants`, variantData
  )
  return res.data
}

export const deleteVariantAPI = async (productId, variantId) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/products/${productId}/variants/${variantId}`
  )
  return res.data
}

export const deleteSizeAPI = async (productId, variantId, sizeId) => {
  const res = await authorizedAxiosInstance.delete(
    `${API_ROOT}/api/products/${productId}/variants/${variantId}/sizes/${sizeId}`
  )
  return res.data
}

export const updateStockAPI = async (productId, variantId, sizeId, delta) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/products/${productId}/variants/${variantId}/sizes/${sizeId}/stock`,
    { delta }
  )
  return res.data
}


