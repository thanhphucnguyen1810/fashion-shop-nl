import StockImport from '~/models/stockImport.model.js'
import Product from '~/models/product.model.js'

const getAll = async ({ page = 1, limit = 20, search = '' }) => {
  const query = search ? { $or: [
    { code: { $regex: search, $options: 'i' } },
    { supplier: { $regex: search, $options: 'i' } }
  ] } : {}

  const result = await StockImport.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $facet: {
      queryImports: [
        { $skip: (Number(page) - 1) * Number(limit) },
        { $limit: Number(limit) },
        { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        } },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productDetails',
          pipeline: [{ $project: { name: 1, sku: 1, images: 1 } }]
        } },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } }
      ],
      queryTotal: [{ $count: 'total' }]
    } }
  ])
  const data = result[0]
  return {
    imports: data.queryImports || [],
    total: data.queryTotal[0]?.total || 0,
    page: Number(page),
    pages: Math.ceil((data.queryTotal[0]?.total || 0) / Number(limit))
  }
}

const getById = async (id) => {
  return await StockImport.findById(id)
    .populate('createdBy', 'name email')
    .populate('items.product', 'name sku images')
}

const create = async (data, userId) => {
  const { supplier, note, items } = data

  // Tạo phiếu nhập
  const stockImport = await StockImport.create({
    supplier,
    note,
    items,
    createdBy: userId
  })

  // Cập nhật stock cho từng variant/size
  for (const item of items) {
    await Product.findOneAndUpdate(
      {
        _id: item.product,
        'variants._id': item.variantId,
        'variants.sizes._id': item.sizeId
      },
      { $inc: { 'variants.$[v].sizes.$[s].stock': item.quantity } },
      {
        arrayFilters: [
          { 'v._id': item.variantId },
          { 's._id': item.sizeId }
        ]
      }
    )
  }

  return stockImport
}

const remove = async (id) => {
  const stockImport = await StockImport.findById(id)
  if (!stockImport) return null

  // Hoàn lại stock khi xóa phiếu
  for (const item of stockImport.items) {
    await Product.findOneAndUpdate(
      {
        _id: item.product,
        'variants._id': item.variantId,
        'variants.sizes._id': item.sizeId
      },
      { $inc: { 'variants.$[v].sizes.$[s].stock': -item.quantity } },
      {
        arrayFilters: [
          { 'v._id': item.variantId },
          { 's._id': item.sizeId }
        ]
      }
    )
  }

  await stockImport.deleteOne()
  return true
}

export const stockImportService = { getAll, getById, create, remove }
