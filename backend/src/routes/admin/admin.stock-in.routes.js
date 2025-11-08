import express from 'express'
import {
  getAllStockIns,
  getStockInById,
  createStockIn,
  deleteStockIn
} from '../controllers/stockIn.controller.js'

const router = express.Router()

router.get('/', getAllStockIns)
router.get('/:id', getStockInById)
router.post('/', createStockIn)
router.delete('/:id', deleteStockIn)

export default router
