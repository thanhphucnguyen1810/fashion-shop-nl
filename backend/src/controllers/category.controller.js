import { categoryService } from '~/services/category.service.js'
import { StatusCodes } from 'http-status-codes'

const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body, req.file)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body,
      req.file
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
}
