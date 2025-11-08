import mongoose from 'mongoose'

const StockInItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  version: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: Number,
  price: Number
})

const StockInSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  employee: {
    type: String
  },
  warehouse: {
    type: String
  },
  items: [StockInItemSchema]
}, { timestamps: true })

export default mongoose.model('StockIn', StockInSchema)
