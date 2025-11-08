import stockinModel from '~/models/stockin.model'

// Lấy tất cả phiếu nhập
export const getAllStockIns = async (req, res) => {
  try {
    const stockIns = await stockinModel.find().populate('items.product')
    res.json(stockIns)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu nhập' })
  }
}

// Lấy chi tiết 1 phiếu nhập
export const getStockInById = async (req, res) => {
  try {
    const stockIn = await stockinModel.findById(req.params.id).populate('items.product')
    if (!stockIn) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' })
    res.json(stockIn)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết phiếu nhập' })
  }
}

// Thêm phiếu nhập mới
export const createStockIn = async (req, res) => {
  try {
    const { title, supplier, employee, warehouse, items } = req.body
    const newStockIn = new stockinModel({ title, supplier, employee, warehouse, items })
    await newStockIn.save()
    res.status(201).json(newStockIn)
  } catch (error) {
    res.status(400).json({ message: 'Thêm phiếu nhập thất bại' })
  }
}

// Xóa phiếu nhập
export const deleteStockIn = async (req, res) => {
  try {
    await stockinModel.findByIdAndDelete(req.params.id)
    res.json({ message: 'Đã xóa phiếu nhập' })
  } catch (error) {
    res.status(500).json({ message: 'Xóa phiếu nhập thất bại' })
  }
}
