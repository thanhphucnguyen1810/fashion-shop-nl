import express from 'express'
import { protect, admin } from '~/middlewares/auth.middleware.js'
import {
  getAllImports,
  getImportById,
  createImport,
  deleteImport
} from '~/controllers/admin/stockImport.controller.js'

const router = express.Router()

router.get('/', protect, admin, getAllImports)
router.get('/:id', protect, admin, getImportById)
router.post('/', protect, admin, createImport)
router.delete('/:id', protect, admin, deleteImport)

export default router
