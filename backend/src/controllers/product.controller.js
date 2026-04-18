import { productService } from '~/services/product.service.js'

// GET PRODUCTS
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

// BEST SELLER
export const getBestSeller = async (req, res, next) => {
  try {
    const result = await productService.getBestSeller()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

// NEW ARRIVALS
export const getNewArrivals = async (req, res, next) => {
  try {
    const result = await productService.getNewArrivals()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

// GET BY ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product Not Found!' })
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// SIMILAR
export const getSimilarProducts = async (req, res, next) => {
  try {
    const result = await productService.getSimilarProducts(req.params.id)

    if (!result) {
      return res.status(404).json({ message: 'Product Not Found!' })
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
}
