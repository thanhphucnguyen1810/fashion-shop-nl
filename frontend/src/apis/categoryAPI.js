import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// FETCH
export const fetchCategoriesAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/api/categories`)
  return res.data
}

// CREATE
export const createCategoryAPI = async (formData) => {
  const res = await authorizedAxiosInstance.post(
    `${API_ROOT}/api/categories`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return res.data
}

// UPDATE
export const updateCategoryAPI = async ({ id, formData }) => {
  const res = await authorizedAxiosInstance.patch(
    `${API_ROOT}/api/categories/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return res.data
}

// DELETE
export const deleteCategoryAPI = async (categoryId) => {
  await authorizedAxiosInstance.delete(`${API_ROOT}/api/categories/${categoryId}`)
  return categoryId
}
