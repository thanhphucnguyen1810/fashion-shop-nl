import stockinModel from '~/models/stockin.model'

// ===== POPULATE HELPER =====
const populateStockIn = (query) => {
  return query.populate('items.product')
}

// ===== GET ALL =====
export const getAllStockInsService = async () => {
  return populateStockIn(stockinModel.find())
}

// ===== GET BY ID =====
export const getStockInByIdService = async (id) => {
  return populateStockIn(stockinModel.findById(id))
}

// ===== CREATE =====
export const createStockInService = async (data) => {
  const { title, supplier, employee, warehouse, items } = data

  const newStockIn = new stockinModel({
    title,
    supplier,
    employee,
    warehouse,
    items
  })

  return newStockIn.save()
}

// ===== DELETE =====
export const deleteStockInService = async (id) => {
  return stockinModel.findByIdAndDelete(id)
}
