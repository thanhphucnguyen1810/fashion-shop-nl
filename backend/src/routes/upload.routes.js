import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

const uploadRoutes = express.Router()

// Cloudinary Configuration
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// Multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

uploadRoutes.post('/', upload.single('image'), async(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(error)
          }
        })

        // Use streamifier to convert file buffer to a stream
        streamifier.createReadStream(fileBuffer).pipe(stream)
      })
    }

    // Call the streamUpload function
    const result = await streamUpload(req.file.buffer)

    // Respond with the uploaded image  URL
    res.json({ imageUrl: result.secure_url })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default uploadRoutes
