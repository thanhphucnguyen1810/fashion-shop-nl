import Category from '~/models/category.model.js'
import cloudinary from '~/config/cloudinary.config.js'
import streamifier from 'streamifier'

/** UPLOAD ẢNH TỪ BUFFER LÊN CLOUDINARY */
const uploadFromBuffer = (buffer, folder = 'categories') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}

/** ---------------------------------------------------
 *  GET /api/categories  (PUBLIC)
 ----------------------------------------------------*/
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: 1 })
    res.status(200).json(categories)
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error)
    res.status(500).json({ message: 'Không thể lấy danh mục' })
  }
}

/** ---------------------------------------------------
 *  POST /api/categories  (ADMIN)
 ----------------------------------------------------*/
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên danh mục là bắt buộc' })
    }

    let imageData = {
      url: 'https://placehold.co/100x100/eeeeee/333333?text=No+Image',
      public_id: 'default_placeholder'
    }

    // Có upload ảnh
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer, 'categories')

      imageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
    }

    const category = await Category.create({
      name,
      image: imageData
    })

    return res.status(201).json(category)
  } catch (error) {
    console.error('Lỗi tạo danh mục:', error)
    res.status(500).json({ message: 'Không thể tạo danh mục' })
  }
}

/** ---------------------------------------------------
 *  PATCH /api/categories/:id  (ADMIN)
 ----------------------------------------------------*/
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params

    const category = await Category.findById(id)
    if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' })

    // Cập nhật tên
    if (name) category.name = name

    // Cập nhật ảnh
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer, 'categories')

      // Xóa ảnh cũ nếu không phải ảnh mặc định
      if (
        category.image?.public_id &&
        category.image.public_id !== 'default_placeholder'
      ) {
        try {
          await cloudinary.uploader.destroy(category.image.public_id)
        } catch (err) {
          console.warn('Không thể xóa ảnh cũ Cloudinary:', err.message)
        }
      }

      category.image = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      }
    }

    await category.save()

    res.json(category)
  } catch (error) {
    console.error('Lỗi cập nhật danh mục:', error)
    res.status(500).json({ message: 'Không thể cập nhật danh mục' })
  }
}

/** ---------------------------------------------------
 *  DELETE /api/categories/:id  (ADMIN)
 ----------------------------------------------------*/
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' })
    }

    // Xóa ảnh Cloudinary
    if (
      category.image?.public_id &&
      category.image.public_id !== 'default_placeholder'
    ) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id)
      } catch (error) {
        console.warn('Không thể xóa ảnh Cloudinary:', error.message)
      }
    }

    await category.deleteOne()

    res.json({ message: 'Danh mục đã được xóa thành công.' })
  } catch (error) {
    console.error('Lỗi xóa danh mục:', error)
    res.status(500).json({ message: 'Không thể xóa danh mục' })
  }
}
