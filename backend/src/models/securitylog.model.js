import mongoose from 'mongoose'

const securityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    action: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true
    },
    ip: String,
    userAgent: String,
    details: String
  },
  {
    timestamps: true
  }
)

export default mongoose.model('SecurityLog', securityLogSchema)
