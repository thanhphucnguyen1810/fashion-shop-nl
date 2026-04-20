import Address from '~/models/address.model'

// GET ALL
const getAddresses = async (userId) => {
  return await Address.find({ user: userId })
}

// CREATE
const addAddress = async (userId, data) => {
  const { name, phone, street, province, district, ward } = data

  return await Address.create({
    user: userId,
    name,
    phone,
    street,
    province,
    district,
    ward
  })
}

// UPDATE
const updateAddress = async (userId, id, data) => {
  const address = await Address.findOne({
    _id: id,
    user: userId
  })

  if (!address) throw new Error('Address not found')

  Object.assign(address, data)
  await address.save()

  return address
}

// DELETE
const deleteAddress = async (userId, id) => {
  const address = await Address.findOne({
    _id: id,
    user: userId
  })

  if (!address) throw new Error('Address not found')

  await address.deleteOne()

  return { message: 'Deleted successfully' }
}

// SET DEFAULT
const setDefaultAddress = async (userId, id) => {
  await Address.updateMany(
    { user: userId },
    { $set: { isDefault: false } }
  )

  const address = await Address.findOne({
    _id: id,
    user: userId
  })

  if (!address) throw new Error('Address not found')

  address.isDefault = true
  await address.save()

  return address
}

export const addressService = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}
