import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: false
    },
    ward: {
      type: String,
      required: false
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('Address', addressSchema)

