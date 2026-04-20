import mongoose from 'mongoose'

const sizeSchema = new mongoose.Schema({
  size:  { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku:   { type: String, required: true }
}, { _id: true })

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  sizes: { type: [sizeSchema], required: true }
}, { _id: true })

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true },
  disCountPrice: { type: Number },
  sku:           { type: String, unique: true, required: true },
  category:      { type: String, required: true },
  brand:         { type: String },
  collections:   { type: String, required: true },
  material:      { type: String },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Unisex', 'Nam (Bé Trai)', 'Nữ (Bé Gái)'],
    default: 'Unisex'
  },
  images: [{
    public_id: { type: String, required: true },
    url:       { type: String, required: true },
    altText:   { type: String }
  }],
  variants: { type: [variantSchema], default: [] },
  isFeatured:  { type: Boolean, default: false },
  isPublished:  { type: Boolean, default: false },
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  tags:        [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{ timestamps: true }
)

productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) =>
    sum + v.sizes.reduce((s, sz) => s + sz.stock, 0), 0
  )
})

export default mongoose.model('Product', productSchema)
