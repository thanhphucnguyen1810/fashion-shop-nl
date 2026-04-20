import { StatusCodes } from 'http-status-codes'
import { addressService } from '~/services/address.service'

// GET
const getAddresses = async (req, res, next) => {
  try {
    const result = await addressService.getAddresses(req.user._id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// CREATE
const addAddress = async (req, res, next) => {
  try {
    const result = await addressService.addAddress(req.user._id, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

// UPDATE
const updateAddress = async (req, res, next) => {
  try {
    const result = await addressService.updateAddress(
      req.user._id,
      req.params.id,
      req.body
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// DELETE
const deleteAddress = async (req, res, next) => {
  try {
    const result = await addressService.deleteAddress(
      req.user._id,
      req.params.id
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

// SET DEFAULT
const setDefaultAddress = async (req, res, next) => {
  try {
    const result = await addressService.setDefaultAddress(
      req.user._id,
      req.params.id
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const addressController = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}
