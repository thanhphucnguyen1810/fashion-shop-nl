import SecurityLog from '~/models/securitylog.model'
import { checkBruteForce } from '~/services/security.service'

export const logSecurity = (action) => (req, res, next) => {
  res.on('finish', async () => {
    try {
      const isSuccess = res.statusCode < 400
      let clientIp = req.ip || req.connection.remoteAddress
      if (clientIp === '::1') clientIp = '127.0.0.1'

      const userId = req.user?._id || res.locals.userId || null

      await SecurityLog.create({
        userId: userId,
        action: action,
        status: isSuccess ? 'SUCCESS' : 'FAILED',
        ip: clientIp,
        userAgent: req.headers['user-agent'],
        details: `${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
      })
    } catch (err) {
      console.error('LỖI GHI LOG:', err.message)
    }
  })
  next()
}