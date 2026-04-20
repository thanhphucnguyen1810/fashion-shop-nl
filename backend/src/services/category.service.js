import Category from '~/models/category.model.js'
import cloudinary from '~/config/cloudinary.config.js'
import streamifier from 'streamifier'

/** UPLOAD ẢNH */
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

// ================= GET =================
const getCategories = async () => {
  const categories = await Category.find({}).sort({ createdAt: 1 })
  return categories
}

// ================= CREATE =================
const createCategory = async (reqBody, file) => {
  const { name } = reqBody

  if (!name || name.trim() === '') {
    const error = new Error('Tên danh mục là bắt buộc')
    error.statusCode = 400
    throw error
  }

  let imageData = {
    url: 'https://placehold.co/100x100/eeeeee/333333?text=No+Image',
    public_id: 'default_placeholder'
  }

  if (file) {
    const uploadResult = await uploadFromBuffer(file.buffer, 'categories')

    imageData = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }
  }

  const category = await Category.create({
    name,
    image: imageData
  })

  return category
}

// ================= UPDATE =================
const updateCategory = async (id, reqBody, file) => {
  const { name } = reqBody

  const category = await Category.findById(id)
  if (!category) {
    const error = new Error('Danh mục không tồn tại')
    error.statusCode = 404
    throw error
  }

  if (name) category.name = name

  if (file) {
    const uploadResult = await uploadFromBuffer(file.buffer, 'categories')

    if (
      category.image?.public_id &&
      category.image.public_id !== 'default_placeholder'
    ) {
      try {
        await cloudinary.uploader.destroy(category.image.public_id)
      } catch (err) {
        console.warn('Không thể xóa ảnh cũ:', err.message)
      }
    }

    category.image = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    }
  }

  await category.save()

  return category
}

// ================= DELETE =================
const deleteCategory = async (id) => {
  const category = await Category.findById(id)

  if (!category) {
    const error = new Error('Không tìm thấy danh mục')
    error.statusCode = 404
    throw error
  }

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

  return { message: 'Danh mục đã được xóa thành công.' }
}

export const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
}
