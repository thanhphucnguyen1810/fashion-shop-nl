import cloudinary from '~/config/cloudinary.config.js'
import streamifier from 'streamifier'

// @desc Upload image to Cloudinary
// @route POST /api/upload
// @access Public or Private (tuỳ bạn)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    // Hàm upload stream lên Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result)
          else reject(error)
        })
        streamifier.createReadStream(fileBuffer).pipe(stream)
      })
    }

    const result = await streamUpload(req.file.buffer)
    res.json({ imageUrl: result.secure_url })

  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}
