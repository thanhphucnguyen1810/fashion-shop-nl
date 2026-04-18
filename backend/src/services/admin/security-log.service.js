import SecurityLog from '~/models/securitylog.model'

// ===== GET SECURITY LOGS =====
export const getSecurityLogsService = async () => {
  return SecurityLog.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('userId', 'name email')
}
