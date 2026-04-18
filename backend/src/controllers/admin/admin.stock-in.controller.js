import {
  getAllStockInsService,
  getStockInByIdService,
  createStockInService,
  deleteStockInService
} from '~/services/admin/admin.stock-in.service'

// ================= GET ALL =================
export const getAllStockIns = async (req, res) => {
  try {
    const stockIns = await getAllStockInsService()
    res.json(stockIns)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phiếu nhập' })
  }
}

// ================= GET BY ID =================
export const getStockInById = async (req, res) => {
  try {
    const stockIn = await getStockInByIdService(req.params.id)

    if (!stockIn) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' })
    }

    res.json(stockIn)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết phiếu nhập' })
  }
}

// ================= CREATE =================
export const createStockIn = async (req, res) => {
  try {
    const newStockIn = await createStockInService(req.body)
    res.status(201).json(newStockIn)
  } catch (error) {
    res.status(400).json({ message: 'Thêm phiếu nhập thất bại' })
  }
}

// ================= DELETE =================
export const deleteStockIn = async (req, res) => {
  try {
    await deleteStockInService(req.params.id)
    res.json({ message: 'Đã xóa phiếu nhập' })
  } catch (error) {
    res.status(500).json({ message: 'Xóa phiếu nhập thất bại' })
  }
}
