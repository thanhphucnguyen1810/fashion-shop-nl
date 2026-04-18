import { productService } from '~/services/product.service.js'

// ================= GET =================
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query.search)
    res.json({ products })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// ================= CREATE =================
export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(
      req.body,
      req.files,
      req.user._id
    )

    res.status(201).json({
      message: 'Thêm sản phẩm thành công',
      newProduct: product
    })
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server Error' })
  }
}

// ================= UPDATE =================
export const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(
      req.params.id,
      req.body,
      req.files
    )

    if (!updated) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product: updated
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// ================= DELETE =================
export const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id)

    if (!result) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    res.json({ message: 'Đã xóa sản phẩm thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}
