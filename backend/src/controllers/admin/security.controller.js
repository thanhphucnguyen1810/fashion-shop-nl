import SecurityLog from '~/models/securitylog.model'

export const getSecurityLogs = async (req, res) => {
  try {
    const logs = await SecurityLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name email')

    res.status(200).json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy nhật ký hệ thống' })
  }
}

