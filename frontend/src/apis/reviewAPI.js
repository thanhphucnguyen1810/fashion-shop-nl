import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// PRODUCT REVIEWS
export const fetchProductReviewsAPI = async (productId) => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/reviews/product/${productId}`
  )
  return res.data
}

// ADMIN: ALL REVIEWS
export const fetchAllReviewsAdminAPI = async () => {
  const res = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/reviews`
  )
  return res.data
}

// SUBMIT REVIEW
export const submitReviewAPI = async (formData) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/reviews`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return res.data
}

// UPDATE STATUS
export const updateReviewStatusAPI = async ({ id, status }) => {
  await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/reviews/${id}/status`,
    { status }
  )
  return { id, status }
}

// DELETE REVIEW
export const deleteReviewAPI = async (reviewId) => {
  await authorizedAxiosInstance.delete(
    `${API_ROOT}/reviews/${reviewId}`
  )
  return reviewId
}
