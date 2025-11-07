import express from 'express'
import multer from 'multer'
import { uploadImage } from '~/controllers/upload.controller.js'

const router = express.Router()

// Cấu hình Multer lưu file tạm trong bộ nhớ
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', upload.single('image'), uploadImage)

export default router
