import { productService } from '~/services/admin/admin.product.service'

// ================= GET =================
export const getAllProducts = async (req, res) => {
  try {
    const { search = '', page = 1 } = req.query
    const result = await productService.getAllProducts(search, Number(page))
    res.json(result)
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

export const upsertVariant = async (req, res) => {
  try {
    // body: { color: 'Đỏ', sizes: [{ size: 'M', price: 250000, stock: 10, sku: 'ABC-RED-M' }] }
    const variants = await productService.upsertVariant(req.params.id, req.body)
    if (!variants) return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    res.json({ message: 'Cập nhật variant thành công', variants })
  } catch (err) {
    res.status(400).json({ message: err.message || 'Server Error' })
  }
}

export const deleteVariant = async (req, res) => {
  try {
    const variants = await productService.deleteVariant(req.params.id, req.params.variantId)
    if (!variants) return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    res.json({ message: 'Đã xóa màu thành công', variants })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const deleteSize = async (req, res) => {
  try {
    const variants = await productService.deleteSize(
      req.params.id, req.params.variantId, req.params.sizeId
    )
    if (!variants) return res.status(404).json({ message: 'Không tìm thấy' })
    res.json({ message: 'Đã xóa size thành công', variants })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
}
