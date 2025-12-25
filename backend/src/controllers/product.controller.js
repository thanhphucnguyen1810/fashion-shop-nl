/* eslint-disable no-console */
import Product from '~/models/product.model.js'

// @desc Get all products with filters, search, and pagination
// @route GET /api/products
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
      material,
      brand,
      category,
      limit,
      page
    } = req.query

    const query = {}

    const slugify = (text) => {
      return text
        .toLowerCase()
        .normalize('NFD') // tách dấu
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .replace(/\s+/g, '-') // space -> -
        .replace(/[^a-z0-9-]/g, '') // ký tự lạ
    }

    if (category) {
      const categorySlug = slugify(category)

      query.category = {
        $regex: categorySlug,
        $options: 'i'
      }
    }


    if (gender) {
      query.gender = gender
    } else if (collection) {
      const collectionLower = collection.toLowerCase()
      if (collectionLower.includes('nam')) {
        query.gender = 'Nam'
      } else if (collectionLower.includes('nữ') || collectionLower.includes('nu')) {
        query.gender = 'Nữ'
      }
    }

    // --- Lọc theo các field khác ---
    if (material) query.material = { $in: material.split(',') }
    if (brand) query.brand = { $in: brand.split(',') }
    if (size) query.sizes = { $in: size.split(',') }
    if (color) query.colors = color

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice) * 1000
      if (maxPrice) query.price.$lte = Number(maxPrice) * 1000
    }

    // --- Tìm kiếm ---
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // --- Phân trang ---
    const pageSize = Number(limit) || 60
    const currentPage = Number(page) || 1
    const skip = pageSize * (currentPage - 1)

    // --- Sắp xếp ---
    let sort = {}
    if (sortBy) {
      switch (sortBy) {
      case 'priceAsc': sort = { price: 1 }; break
      case 'priceDesc': sort = { price: -1 }; break
      case 'popularity': sort = { rating: -1 }; break
      case 'nameAsc': sort = { name: 1 }; break
      case 'nameDesc': sort = { name: -1 }; break
      default: sort = { createdAt: -1 }
      }
    } else {
      sort = { createdAt: -1 }
    }

    // --- Đếm tổng số ---
    const count = await Product.countDocuments(query)

    // --- Lấy sản phẩm ---
    const products = await Product.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(skip)

    res.json({
      products,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error!')
  }
}

// @desc Get best seller product
// @route GET /api/products/best-seller
export const getBestSeller = async (req, res) => {
  try {
    const bestSeller = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(8).lean()
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
