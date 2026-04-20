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
const getAllProducts = async (search, page = 1, limit = 10) => {
  const keyword = search
    ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }
    : {}

  const result = await productModel.aggregate([
    { $match: keyword },
    { $sort: { createdAt: -1 } },
    { $facet: {
      queryProducts: [
        { $skip: limit * (page - 1) },
        { $limit: limit }
      ],
      queryTotal: [
        { $count: 'total' }
      ]
    } }
  ])

  const data = result[0]
  return {
    products: data.queryProducts || [],
    page,
    pages: Math.ceil((data.queryTotal[0]?.total || 0) / limit),
    totalProducts: data.queryTotal[0]?.total || 0
  }
}

const createProduct = async (data, files, userId) => {
  const {
    name,
    description,
    price,
    sku,
    category,
    collections,
    brand,
    material,
    gender,
    isFeatured,
    isPublished,
    tags,
    disCountPrice,
    variants
  } = data

  const existing = await productModel.findOne({ sku })
  if (existing) throw new Error('SKU đã tồn tại')

  let parsedVariants = []
  if (variants) {
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants
    } catch {
      throw new Error('Variants không hợp lệ')
    }
  }

  // price thấp nhất từ variants
  const allPrices = parsedVariants.flatMap(v => v.sizes.map(s => s.price))
  const basePrice = allPrices.length > 0 ? Math.min(...allPrices) : Number(price)

  let images = []
  if (files?.length) {
    for (const file of files) {
      images.push(await uploadImage(file))
    }
  }

  const newProduct = await productModel.create({
    name,
    description,
    price: basePrice,
    disCountPrice,
    sku,
    category,
    collections,
    brand,
    material,
    gender,
    isFeatured,
    isPublished,
    tags: tags ? JSON.parse(tags) : [],
    variants: parsedVariants,
    images,
    user: userId
  })

  return newProduct
}

const updateProduct = async (id, data, files) => {
  const product = await productModel.findById(id)
  if (!product) return null

  if (data.variants) {
    try {
      data.variants = typeof data.variants === 'string'
        ? JSON.parse(data.variants)
        : data.variants

      // Sync lại price thấp nhất
      const allPrices = data.variants.flatMap(v => v.sizes.map(s => s.price))
      if (allPrices.length > 0) data.price = Math.min(...allPrices)
    } catch {
      throw new Error('Variants không hợp lệ')
    }
  }

  let images = product.images
  if (files?.length) {
    await deleteImages(images)
    images = []
    for (const file of files) {
      images.push(await uploadImage(file))
    }
  }

  const updated = await productModel.findByIdAndUpdate(
    id,
    { ...data, images },
    { new: true }
  )

  return updated
}

const deleteProduct = async (id) => {
  const product = await productModel.findById(id)
  if (!product) return null

  await deleteImages(product.images || [])
  await product.deleteOne()

  return true
}

const upsertVariant = async (productId, { color, sizes }) => {
  const product = await productModel.findById(productId)
  if (!product) return null

  const existingIndex = product.variants.findIndex(v => v.color === color)

  if (existingIndex !== -1) {
    sizes.forEach(newSize => {
      const sizeIndex = product.variants[existingIndex].sizes.findIndex(
        s => s.size === newSize.size
      )
      if (sizeIndex !== -1) {
        product.variants[existingIndex].sizes[sizeIndex] = newSize
      } else {
        product.variants[existingIndex].sizes.push(newSize)
      }
    })
  } else {
    product.variants.push({ color, sizes })
  }

  const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.price))
  if (allPrices.length > 0) product.price = Math.min(...allPrices)

  await product.save()
  return product.variants
}

const deleteVariant = async (productId, variantId) => {
  const product = await productModel.findById(productId)
  if (!product) return null

  product.variants = product.variants.filter(
    v => v._id.toString() !== variantId
  )

  const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.price))
  if (allPrices.length > 0) product.price = Math.min(...allPrices)

  await product.save()
  return product.variants
}

const deleteSize = async (productId, variantId, sizeId) => {
  const product = await productModel.findById(productId)
  if (!product) return null

  const variant = product.variants.find(v => v._id.toString() === variantId)
  if (!variant) return null

  variant.sizes = variant.sizes.filter(s => s._id.toString() !== sizeId)

  if (variant.sizes.length === 0) {
    product.variants = product.variants.filter(v => v._id.toString() !== variantId)
  }

  const allPrices = product.variants.flatMap(v => v.sizes.map(s => s.price))
  if (allPrices.length > 0) product.price = Math.min(...allPrices)

  await product.save()
  return product.variants
}

export const productService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  upsertVariant,
  deleteVariant,
  deleteSize
}
