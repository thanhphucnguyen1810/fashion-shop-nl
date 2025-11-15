import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  role: {
    type: String,
    enum: ['customer', 'staff', 'admin'],
    default: 'customer'
  },
  avatar: {
    type: String,
    default: 'https://picsum.photos/500/500?random=1' // hoặc 1 avatar mặc định
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, {
  timestamps: true
})

// Password hash middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Match User entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare( await bcrypt.hash(enteredPassword), this.password)
// }

export default mongoose.model('User', userSchema)
