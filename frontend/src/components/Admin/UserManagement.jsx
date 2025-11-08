import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import { useTheme, alpha } from '@mui/material/styles'

const UserManagement = () => {
  const theme = useTheme()

  const [users, setUsers] = useState([
    {
      _id: 12345,
      name: 'Thanh Phuc',
      email: 'thanhphucnguyen54@gmail.com',
      role: 'admin'
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  })


  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5
  const modalRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowForm(false)
      }
    }
    if (showForm) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showForm])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newUser = {
      _id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role
    }

    setUsers(prev => [...prev, newUser])
    setMessage('Thêm người dùng thành công!')

    //Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer'
    })

    // Đóng modal
    setShowForm(false)
    // Xóa message sau 3s
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user._id === userId ? { ...user, role: newRole } : user
    )
    setUsers(updatedUsers)
    setMessage('Cập nhật vai trò thành công!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleAddUser = () => {

  }

  const handleEditUser = () => {

  }

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa người dùng này không?')
    if (confirmDelete) {
      const updatedUsers = users.filter(user => user._id !== userId)
      setUsers(updatedUsers)
      setMessage('Đã xóa người dùng!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (roleFilter === '' || user.role === roleFilter)
  )

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const inputClass = `w-full p-2 border rounded bg-transparent text-[${theme.palette.text.primary}] border-[${alpha(theme.palette.text.primary, 0.3)}]`
  const labelClass = 'block mb-1'

  return (
    <div
      className="max-w-7xl mx-auto p-6"
      style={{ color: theme.palette.text.primary }}
    >
      <h2 className="text-2xl font-bold mb-6">Danh sách người dùng</h2>

      {message && (
        <div
          className="mb-4 p-2 border rounded"
          style={{
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            borderColor: alpha(theme.palette.success.main, 0.4)
          }}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Search input + search button */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-11 pr-24 text-sm rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: '1px solid rgba(0,0,0,0.2)'
            }}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
            onClick={() => console.log('Search:', searchQuery)}
          >
           Tìm
          </button>
        </div>

        {/* Select filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderColor: alpha(theme.palette.text.primary, 0.3)
          }}
        >
          <option value="">Tất cả vai trò</option>
          <option value="customer">Khách hàng</option>
          <option value="staff">Nhân viên</option>
          <option value="admin">Quản trị viên</option>
        </select>

        {/* Thêm sản phẩm button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto px-4 py-2 rounded flex items-center gap-2"
          style={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <FaPlus /> Thêm người dùng
        </button>
      </div>


      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 bg-opacity-20 rounded-lg p-6 w-full max-w-md relative"
            style={{ backgroundColor: theme.palette.background.paper }}
          >
            {/* Nút đóng */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-semibold mb-4">Thêm người dùng mới</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClass}
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderColor: alpha(theme.palette.text.primary, 0.3)
                  }}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <button
                type="submit"
                className="py-2 px-4 rounded hover:opacity-90 w-full"
                style={{
                  backgroundColor: theme.palette.success.main,
                  color: theme.palette.success.contrastText
                }}
              >
          Thêm người dùng
              </button>
            </form>
          </div>
        </div>
      )}


      <section className="overflow-x-auto shadow-md sm:rounded-lg">
        <table
          className="min-w-full text-left"
          style={{ color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper }}
        >
          <thead
            className="text-xs uppercase"
            style={{ backgroundColor: alpha(theme.palette.grey[500], 0.2) }}
          >
            <tr>
              <th className="py-3 px-4">Tên</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Vai trò</th>
              <th className="py-3 px-4">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b"
                style={{ borderBottomColor: alpha(theme.palette.divider, 0.2) }}
              >
                <td className="p-4 font-medium whitespace-nowrap">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderColor: alpha(theme.palette.text.primary, 0.3)
                    }}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleAddUser()}
                    className="px-3 py-2 rounded hover:opacity-90"
                    style={{
                      backgroundColor: theme.palette.success.main,
                      color: theme.palette.success.contrastText
                    }}
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={() => handleEditUser(user._id)}
                    className="px-3 py-2 rounded hover:opacity-90"
                    style={{
                      backgroundColor: theme.palette.warning.main,
                      color: theme.palette.warning.contrastText
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-2 rounded hover:opacity-90"
                    style={{
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText
                    }}
                  >
                    <FaTrash />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 border rounded disabled:opacity-50 flex items-center justify-center"
          style={{ backgroundColor: theme.palette.action.hover }}
          title="Trang trước"
        >
          <FaChevronLeft />
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
          style={{ backgroundColor: theme.palette.action.hover }}
          title="Trang sau"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}

export default UserManagement
