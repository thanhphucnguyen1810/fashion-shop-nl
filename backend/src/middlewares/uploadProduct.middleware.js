import multer from 'multer'

const storage = multer.memoryStorage() // dùng memory để upload lên cloudinary

export const upload = multer({ storage })
