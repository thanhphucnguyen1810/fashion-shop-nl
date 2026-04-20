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

export const getVariants = async (req, res, next) => {
  try {
    const data = await productService.getVariants(req.params.id)
    if (!data) return res.status(404).json({ message: 'Product not found' })
    res.json(data)
  } catch (err) { next(err) }
}

export const upsertVariant = async (req, res, next) => {
  try {
    // body: { color: 'Đỏ', sizes: [{ size: 'M', price: 250000, stock: 10, sku: 'ABC-RED-M' }] }
    const data = await productService.upsertVariant(req.params.id, req.body)
    if (!data) return res.status(404).json({ message: 'Product not found' })
    res.json(data)
  } catch (err) { next(err) }
}

export const deleteVariant = async (req, res, next) => {
  try {
    const data = await productService.deleteVariant(req.params.id, req.params.variantId)
    if (!data) return res.status(404).json({ message: 'Product not found' })
    res.json(data)
  } catch (err) { next(err) }
}

export const deleteSize = async (req, res, next) => {
  try {
    const data = await productService.deleteSize(
      req.params.id, req.params.variantId, req.params.sizeId
    )
    if (!data) return res.status(404).json({ message: 'Not found' })
    res.json(data)
  } catch (err) { next(err) }
}

export const updateStock = async (req, res, next) => {
  try {
    // body: { delta: -1 }
    const data = await productService.updateStock(
      req.params.id, req.params.variantId, req.params.sizeId, req.body.delta
    )
    if (!data) return res.status(404).json({ message: 'Not found' })
    res.json(data)
  } catch (err) { next(err) }
}
