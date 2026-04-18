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

// BUY NOW
export const createTemporaryOrderAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/orders/buy-now`,
    data
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
