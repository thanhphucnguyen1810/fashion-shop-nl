import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// FETCH CART
export const fetchCartAPI = async ({ userId, guestId }) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/cart`, {
    params: { userId, guestId }
  })
  return response.data
}

// ADD TO CART
export const addToCartAPI = async ({ productId, quantity, size, color, guestId, userId }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/cart`, {
    productId,
    quantity,
    size,
    color,
    guestId,
    userId
  })
  return response.data
}

// UPDATE CART
export const updateCartItemQuantityAPI = async ({ productId, quantity, guestId, userId, size, color }) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/cart`, {
    productId,
    quantity,
    guestId,
    userId,
    size,
    color
  })
  return response.data
}

// REMOVE ITEM
export const removeFromCartAPI = async ({ productId, guestId, userId, size, color }) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/cart`, {
    data: { productId, guestId, userId, size, color }
  })
  return response.data
}

// MERGE CART
export const mergeCartAPI = async ({ guestId }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/cart/merge`, {
    guestId
  })
  return response.data
}

// APPLY COUPON
export const applyCouponAPI = async ({ code, userId, guestId }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/coupons/apply`, {
    code,
    userId,
    guestId
  })
  return response.data
}

// REMOVE COUPON
export const removeCouponAPI = async ({ userId, guestId }) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/coupons/remove`, {
    userId,
    guestId
  })
  return response.data
}
