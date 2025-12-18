import Address from '~/models/address.model'

// Lấy danh sách địa chỉ của user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
    res.json(addresses)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Tạo địa chỉ mới
export const addAddress = async (req, res) => {
  try {
    const { name, phone, street, province, district, ward } = req.body

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Lỗi xác thực. Vui lòng đăng nhập lại.' })
    }

    const newAddress = await Address.create({
      user: req.user._id,
      name,
      phone,
      street,
      province,
      district,
      ward
    })

    res.status(201).json(newAddress)
  } catch (error) {
    console.error('Lỗi khi thêm địa chỉ:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'Dữ liệu địa chỉ không hợp lệ' })
    }

    res.status(500).json({ message: 'Lỗi server: Không thể tạo địa chỉ' })
  }
}

// Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!address) return res.status(404).json({ message: 'Address not found' })

    Object.assign(address, req.body)
    await address.save()

    res.json(address)
  } catch (error) {
    res.status(500).json({ message: 'Cannot update address' })
  }
}

// Xóa địa chỉ
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!address) return res.status(404).json({ message: 'Address not found' })

    await address.deleteOne()
    res.json({ message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Cannot delete address' })
  }
}

// Đặt mặc định
export const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    )

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!address) return res.status(404).json({ message: 'Address not found' })

    address.isDefault = true
    await address.save()

    res.json(address)
  } catch (error) {
    res.status(500).json({ message: 'Cannot set default address' })
  }
}
