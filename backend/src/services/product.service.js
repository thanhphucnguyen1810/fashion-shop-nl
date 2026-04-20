import Product from '~/models/product.model.js'

const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// ================= GET PRODUCTS =================
const getProducts = async (queryParams) => {
  const {
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    material,
    brand,
    category,
    limit,
    page
  } = queryParams

  const query = {}

  if (category) {
    query.category = {
      $regex: slugify(category),
      $options: 'i'
    }
  }

  if (gender) {
    query.gender = gender
  } else if (collection) {
    const collectionLower = collection.toLowerCase()
    if (collectionLower.includes('nam')) query.gender = 'Nam'
    else if (collectionLower.includes('nữ') || collectionLower.includes('nu')) query.gender = 'Nữ'
  }

  if (material) query.material = { $in: material.split(',') }
  if (brand) query.brand = { $in: brand.split(',') }
  if (size) query.sizes = { $in: size.split(',') }
  if (color) query.colors = color

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice) * 1000
    if (maxPrice) query.price.$lte = Number(maxPrice) * 1000
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  const pageSize = Number(limit) || 60
  const currentPage = Number(page) || 1
  const skip = pageSize * (currentPage - 1)

  let sort = { createdAt: -1 }

  if (sortBy) {
    switch (sortBy) {
    case 'priceAsc': sort = { price: 1 }; break
    case 'priceDesc': sort = { price: -1 }; break
    case 'popularity': sort = { rating: -1 }; break
    case 'nameAsc': sort = { name: 1 }; break
    case 'nameDesc': sort = { name: -1 }; break
    }
  }

  const result = await Product.aggregate([
    { $match: query },
    { $sort: sort },
    { $facet: {
      queryProducts: [
        { $skip: skip },
        { $limit: pageSize }
      ],
      queryTotal: [{ $count: 'total' }]
    } }
  ])

  const data = result[0]
  return {
    products: data.queryProducts || [],
    page: currentPage,
    pages: Math.ceil((data.queryTotal[0]?.total || 0) / pageSize),
    totalProducts: data.queryTotal[0]?.total || 0
  }
}

// ================= BEST SELLER =================
const getBestSeller = async () => {
  return await Product.find({})
    .sort({ rating: -1, numReviews: -1 })
    .limit(8)
    .lean()
}

// ================= NEW ARRIVALS =================
const getNewArrivals = async () => {
  return await Product.find()
    .sort({ createdAt: -1 })
    .limit(8)
}

// ================= GET BY ID =================
const getProductById = async (id) => {
  return await Product.findById(id)
}

// ================= SIMILAR PRODUCTS =================
const getSimilarProducts = async (id) => {
  const product = await Product.findById(id)
  if (!product) return null

  return await Product.find({
    _id: { $ne: id },
    gender: product.gender,
    category: product.category
  }).limit(4)
}

// ================= VARIANTS =================
const getVariants = async (productId) => {
  const product = await Product.findById(productId).select('variants price')
  if (!product) return null
  return product.variants
}

export const productService = {
  getProducts,
  getBestSeller,
  getNewArrivals,
  getProductById,
  getSimilarProducts,
  getVariants
}
