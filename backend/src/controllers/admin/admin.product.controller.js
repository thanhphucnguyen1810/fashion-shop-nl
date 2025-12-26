import productModel from '~/models/product.model.js'
import cloudinary from '~/config/cloudinary.config'

// ================= GET ALL PRODUCTS =================
// @route GET /api/admin/products
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
  try {
    const { name, description, price, countInStock, sku, category, collections } = req.body
    // Kiểm tra SKU trùng
    const existing = await productModel.findOne({ sku })
    if (existing) {
      return res.status(400).json({ message: 'SKU đã tồn tại' })
    }

    // Upload image to Cloudinary
    let imageUrls = []
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadedResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, { folder: 'products' })

        // Lưu public_id và url vào đối tượng
        imageUrls.push({
          public_id: uploadedResult.public_id,
          url: uploadedResult.secure_url
        })
      }
    }

    const cleanData = (data) => {
      if (!data || !Array.isArray(data)) return []
      return data.map(item =>
        String(item)
          .trim()
          .replace(/^["']|["']$/g, '')
      )
    }

    const newSizes = cleanData(req.body.sizes)
    const newColors = cleanData(req.body.colors)

    const newProduct = await productModel.create({
      name,
      description,
      price,
      countInStock,
      sku,
      category,
      sizes: newSizes,
      colors: newColors,
      collections,
      images: imageUrls,
      user: req.user._id
    })

    // await product.save()
    res.status(201).json({ message: 'Thêm sản phẩm thành công', newProduct })
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

    let imageUrls = product.images

    if (req.files && req.files.length > 0) {
      // Xóa ảnh cũ trên Cloudinary
      for (let img of imageUrls) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id)
        }
      }

      // Upload ảnh mới
      imageUrls = []
      for (const file of req.files) {
        const uploadedResult = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, { folder: 'products' })

        // Lưu public_id và url vào đối tượng
        imageUrls.push({
          public_id: uploadedResult.public_id,
          url: uploadedResult.secure_url
        })
      }
    }

    const updated = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: imageUrls },
      { new: true }
    )

    res.json({ message: 'Cập nhật sản phẩm thành công', product: updated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    // 1. Tìm sản phẩm trong DB trước
    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
    }

    // 2. Xóa các ảnh trên Cloudinary dựa trên public_id đã lưu lúc Create
    if (product.images && product.images.length > 0) {
      // Tạo một danh sách các lời hứa (Promise) xóa ảnh
      const deleteImagePromises = product.images.map((img) => {
        if (img.public_id) {
          return cloudinary.uploader.destroy(img.public_id)
        }
      })

      // Chạy song song tất cả các yêu cầu xóa ảnh để tiết kiệm thời gian
      await Promise.all(deleteImagePromises)
    }

    // 3. Cuối cùng mới xóa sản phẩm trong Database
    await product.deleteOne()

    res.json({ message: 'Đã xóa sản phẩm và tất cả ảnh liên quan thành công' })
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error)
    res.status(500).json({ message: 'Server Error: Không thể xóa sản phẩm' })
  }
}
