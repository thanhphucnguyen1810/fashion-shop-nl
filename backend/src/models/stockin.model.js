import mongoose from 'mongoose'

const StockInItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  version: String,
  size: String,
  quantity: Number,
  price: Number
})

const StockInSchema = new mongoose.Schema({
  title: { type: String, required: true },
  supplier: { type: String, required: true },
  employee: { type: String },
  warehouse: { type: String },
  items: [StockInItemSchema],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('StockIn', StockInSchema)
