import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const BASE = `${API_ROOT}/api/admin/users`

export const fetchUsersAPI = async () => {
  const res = await authorizedAxiosInstance.get(BASE)
  return res.data
}

export const addUserAPI = async (userData) => {
  const fd = new FormData()
  fd.append('name', userData.name)
  fd.append('email', userData.email)
  fd.append('password', userData.password)
  fd.append('role', userData.role)
  fd.append('gender', userData.gender)
  if (userData.avatarFile) fd.append('avatar', userData.avatarFile)

  const res = await authorizedAxiosInstance.post(BASE, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const updateUserAPI = async ({ id, name, email, role, gender, avatarFile }) => {
  const fd = new FormData()
  fd.append('name', name)
  fd.append('email', email)
  fd.append('role', role)
  fd.append('gender', gender)
  if (avatarFile) fd.append('avatar', avatarFile)

  const res = await authorizedAxiosInstance.put(`${BASE}/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.user
}

export const deleteUserAPI = async (id) => {
  await authorizedAxiosInstance.delete(`${BASE}/${id}`)
  return id
}

export const toggleUserStatusAPI = async ({ id, isBlocked }) => {
  const res = await authorizedAxiosInstance.patch(`${BASE}/${id}/status`, { isBlocked })
  return res.data.user
}
