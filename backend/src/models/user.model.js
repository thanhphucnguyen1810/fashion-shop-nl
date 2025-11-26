import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

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
    type: Object,
    default: {
      url: 'https://res.cloudinary.com/dgec7q298/image/upload/v1763440910/products/p_img2.png',
      public_id: 'products/p_img2'
    }
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
  ],
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
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

// Reset Token
userSchema.methods.createPasswordResetToken = function () {
  // 1. Tạo token ngẫu nhiên (chưa hash) để gửi cho người dùng
  const resetToken = crypto.randomBytes(32).toString('hex')

  // 2. Hash token đó và lưu vào database (để so sánh). Dùng thuật toán SHA256 để hash.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // 3. Thiết lập thời gian hết hạn
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  // 4. Trả về token KHÔNG HASH để gửi qua email
  return resetToken
}

// ====================== THÊM PHƯƠNG THỨC TẠO VERIFICATION TOKEN ======================
userSchema.methods.createEmailVerificationToken = function() {
  // 1. Tạo token ngẫu nhiên (chưa hash) gửi cho người dùng
  const verificationToken = crypto.randomBytes(32).toString('hex')

  // 2. Hash token và lưu vào db
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex')

  // 3. Thiết lập thời gian hết hạn
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 giờ

  // 4. Trả về token KHÔNG HASH để gửi qua email
  return verificationToken
}

export default mongoose.model('User', userSchema)
