import mongoose from 'mongoose'

const importItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // color._id
  sizeId:    { type: mongoose.Schema.Types.ObjectId, required: true }, // size._id
  color:     { type: String, required: true },
  size:      { type: String, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  costPrice: { type: Number, required: true } // giá vốn
}, { _id: true })

const stockImportSchema = new mongoose.Schema({
  code:     { type: String, unique: true }, // tự sinh: IMP-20240419-001
  supplier: { type: String, required: true },
  note:     { type: String },
  items:    { type: [importItemSchema], required: true },
  totalCost: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

// Tự tính totalCost và sinh code trước khi save
stockImportSchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date()
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const count = await mongoose.model('StockImport').countDocuments()
    this.code = `IMP-${dateStr}-${String(count + 1).padStart(3, '0')}`
  }
  this.totalCost = this.items.reduce((sum, i) => sum + i.quantity * i.costPrice, 0)
  next()
})

export default mongoose.model('StockImport', stockImportSchema)
