import productModel from '~/models/product.model.js'
import cloudinary from '~/config/cloudinary.config.js'

// ================= CLOUDINARY HELPERS =================
const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    { folder: 'products' }
  )

  return {
    public_id: result.public_id,
    url: result.secure_url
  }
}

const deleteImages = async (images = []) => {
  const promises = images.map(img => {
    if (img.public_id) {
      return cloudinary.uploader.destroy(img.public_id)
    }
  })

  await Promise.all(promises)
}

// ================= SERVICE =================
export const productService = {
  async getAllProducts(search) {
    const keyword = search
      ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      }
      : {}

    const products = await productModel.find(keyword)
    return products
  },

  async createProduct(data, files, userId) {
    const {
      name,
      description,
      price,
      countInStock,
      sku,
      category,
      collections
    } = data

    const existing = await productModel.findOne({ sku })
    if (existing) {
      throw new Error('SKU đã tồn tại')
    }

    let images = []
    if (files?.length) {
      for (const file of files) {
        const img = await uploadImage(file)
        images.push(img)
      }
    }

    const cleanData = (arr) => {
      if (!Array.isArray(arr)) return []
      return arr.map(i =>
        String(i).trim().replace(/^["']|["']$/g, '')
      )
    }

    const newProduct = await productModel.create({
      name,
      description,
      price,
      countInStock,
      sku,
      category,
      sizes: cleanData(data.sizes),
      colors: cleanData(data.colors),
      collections,
      images,
      user: userId
    })

    return newProduct
  },

  async updateProduct(id, data, files) {
    const product = await productModel.findById(id)
    if (!product) return null

    let images = product.images

    if (files?.length) {
      await deleteImages(images)

      images = []
      for (const file of files) {
        const img = await uploadImage(file)
        images.push(img)
      }
    }

    const updated = await productModel.findByIdAndUpdate(
      id,
      { ...data, images },
      { new: true }
    )

    return updated
  },

  async deleteProduct(id) {
    const product = await productModel.findById(id)
    if (!product) return null

    await deleteImages(product.images || [])
    await product.deleteOne()

    return true
  }
}
