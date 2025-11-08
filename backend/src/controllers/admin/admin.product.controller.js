import productModel from '~/models/product.model.js'

// ================= GET ALL PRODUCTS =================
// @desc Get all products (Admin only)
// @route GET /api/admin/products
// @access Private/Admin
export const getAllProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { sku: { $regex: req.query.search, $options: 'i' } },
          { category: { $regex: req.query.search, $options: 'i' } }
        ]
      }
      : {}

    const products = await productModel.find(keyword)
    res.json({ products })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

/*
$regex: tìm kiếm gần đúng (chuỗi có chứa từ khóa)
$options: 'i': không phân biệt hoa/thường
$or: tìm theo nhiều trường cùng lúc (name, sku, category)
*/

// ================= CREATE PRODUCT =================
export const createProduct = async (req, res) => {
  const { name, price, sku, category, sizes, colors, collections, user } = req.body
  try {
    // Kiểm tra SKU trùng
    const existing = await productModel.findOne({ sku })
    if (existing) {
      return res.status(400).json({ message: 'SKU đã tồn tại' })
    }

    const product = new productModel({
      name,
      price,
      sku,
      category,
      sizes: sizes || [],
      colors: colors || [],
      collections,
      user
    })

    await product.save()
    res.status(201).json({ message: 'Thêm sản phẩm thành công', product })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    // Cập nhật thông tin từ body
    Object.assign(product, req.body)
    const updatedProduct = await product.save()
    res.json({ message: 'Cập nhật sản phẩm thành công', product: updatedProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    await product.deleteOne()
    res.json({ message: 'Xóa sản phẩm thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

