import SecurityLog from '~/models/securitylog.model'

export const checkBruteForce = async (ip) => {
  const attempts = await SecurityLog.countDocuments({
    ip,
    action: 'LOGIN',
    status: 'FAILED',
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
  })

  if (attempts >= 5) {
    await SecurityLog.create({
      action: 'ALERT_BRUTE_FORCE',
      status: 'FAILED',
      ip,
      details: 'Phát hiện brute-force login'
    })
  }
}

