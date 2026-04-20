import { getSecurityLogsService } from '~/services/admin/security-log.service'

// ===== GET LOGS =====
export const getSecurityLogs = async (req, res) => {
  try {
    const logs = await getSecurityLogsService()
    res.status(200).json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy nhật ký hệ thống' })
  }
}
