// Khởi tạo app, middleware, routes, cấu hình logic express
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import xss from 'xss-clean'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import session from 'express-session'

import passport from './config/passport'
import { corsOptions } from './config/cors'
import { errorHandlingMiddleware } from '~/middlewares/errorHandling.middleware'

import userRoutes from './routes/user.routes'
import oauthRoutes from './routes/oauth.routes'

import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'
import couponRoutes from './routes/coupon.routes'
import checkoutRoutes from './routes/checkout.routes'
import orderRoutes from './routes/order.routes'
import uploadRoutes from './routes/upload.routes'
import subscribeRoutes from './routes/subscribe.routes'
import categoryRoutes from './routes/category.routes'

import adminUserRoutes from './routes/admin/admin.user.routes'
import adminProductRoutes from './routes/admin/admin.product.routes'
import adminOrderRoutes from './routes/admin/admin.order.routes'
import adminStockInRoutes from './routes/admin/admin.stock-in.routes'
import adminReviewRoutes from './routes/admin/admin.review.routes'
import adminCouponRoutes from './routes/admin/admin.coupon.routes'
import reviewRoutes from './routes/review.routes'
import addressRoutes from './routes/address.routes'
import adminSystemRoutes from './routes/admin/admin.system.routes'

// Load environment variables
dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Enable cors
app.use(cors(corsOptions))

// Bảo vệ ứng dụng khỏi các cuộc tấn công Cross-Site Scripting (XSS)
app.use(xss())

//Bảo vệ ứng dụng khỏi các cuộc tấn công NoSQL Injection
app.use(mongoSanitize())

// kích thước body tối đa là 10kb, tránh DoS
app.use(express.json({ limit: '10kb' }))

// Cấu hình session (bắt buộc cho Passport)
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true, cookie: { secure: false } }))
app.use(passport.initialize())
app.use(passport.session())

// Bảo mật http headers: tránh XSS, CSRF, phishing, clickjacking, etc.
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000, // In one hour
  message: 'Too many requests from this IP, Please try again in an hour'
})

app.use('/e-commerce', limiter)

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/oauth', oauthRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/subscribe', subscribeRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/address', addressRoutes)

// Admin
app.use('/api/admin/users', adminUserRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/admin/stock-in', adminStockInRoutes)
app.use('/api/admin/reviews', adminReviewRoutes)
app.use('/api/admin/coupons', adminCouponRoutes)
app.use('/api/admin/system', adminSystemRoutes)
// app.use('/api/admin/invoice', adminInvoice)

// Middleware xử lý lỗi tập trung
app.use(errorHandlingMiddleware)


export default app
