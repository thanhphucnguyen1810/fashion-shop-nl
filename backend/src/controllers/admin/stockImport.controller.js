import { stockImportService } from '~/services/admin/stockImport.service'

export const getAllImports = async (req, res, next) => {
  try {
    const result = await stockImportService.getAll(req.query)
    res.json(result)
  } catch (err) { next(err) }
}

export const getImportById = async (req, res, next) => {
  try {
    const result = await stockImportService.getById(req.params.id)
    if (!result) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' })
    res.json(result)
  } catch (err) { next(err) }
}

export const createImport = async (req, res, next) => {
  try {
    const result = await stockImportService.create(req.body, req.user._id)
    res.status(201).json({ message: 'Tạo phiếu nhập thành công', stockImport: result })
  } catch (err) { next(err) }
}

export const deleteImport = async (req, res, next) => {
  try {
    const result = await stockImportService.remove(req.params.id)
    if (!result) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' })
    res.json({ message: 'Đã xóa phiếu nhập' })
  } catch (err) { next(err) }
}
