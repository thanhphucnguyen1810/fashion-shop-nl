/* eslint-disable no-console */
import Product from '~/models/product.model.js'

// @desc Create a new Product
// @route POST /api/products
// @access Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      materials,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku
    } = req.body

    const product = new Product({
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      materials,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!!!')
  }
}

// @desc Update product by ID
// @route PUT /api/products/:id
// @access Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      materials,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku
    } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    // cập nhật từng trường nếu có
    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.disCountPrice = disCountPrice || product.disCountPrice
    product.countInStock = countInStock || product.countInStock
    product.category = category || product.category
    product.brand = brand || product.brand
    product.sizes = sizes || product.sizes
    product.colors = colors || product.colors
    product.collections = collections || product.collections
    product.materials = materials || product.materials
    product.gender = gender || product.gender
    product.images = images || product.images
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured
    product.isPublished = isPublished !== undefined ? isPublished : product.isPublished
    product.tags = tags || product.tags
    product.dimensions = dimensions || product.dimensions
    product.weight = weight || product.weight
    product.sku = sku || product.sku

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!!!')
  }
}

// @desc Delete product by ID
// @route DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send({ message: 'Product not found!' })

    await product.deleteOne()
    res.json({ message: 'Product removed.' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!!!')
  }
}

// @desc Get all products with filters
// @route GET /api/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit
    } = req.query

    const query = {}

    if (collection && collection.toLocaleLowerCase() !== 'all') query.collections = collection
    if (category && category.toLocaleLowerCase() !== 'all') query.category = category
    if (material) query.material = { $in: material.split(',') }
    if (brand) query.brand = { $in: brand.split(',') }
    if (size) query.sizes = { $in: size.split(',') }
    if (color) query.colors = { $in: [color] }
    if (gender) query.gender = gender
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    let sort = {}
    if (sortBy) {
      switch (sortBy) {
      case 'priceAsc': sort = { price: 1 }; break
      case 'priceDesc': sort = { price: -1 }; break
      case 'popularity': sort = { rating: -1 }; break
      }
    }

    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0)
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc Get best seller product
// @route GET /api/products/best-seller
export const getBestSeller = async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 })
    if (!bestSeller) return res.status(404).json({ message: 'No best seller found!' })
    res.json(bestSeller)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc Get new arrivals
// @route GET /api/products/new-arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8)
    res.json(newArrivals)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc Get product by ID
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product Not Found!' })
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc Get similar products
// @route GET /api/products/similar/:id
export const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product Not Found!' })

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category
    }).limit(4)

    res.json(similarProducts)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}
