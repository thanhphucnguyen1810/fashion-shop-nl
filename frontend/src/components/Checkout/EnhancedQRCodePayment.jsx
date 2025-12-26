import { CircularProgress, Box, Paper, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const EnhancedQRCodePayment = ({ qrData, isPaidSuccess }) => {
  const PrimaryColor = '#1976D2'
  const SuccessColor = '#38A169'

  return (
    <Paper
      elevation={10}
      className="w-full p-6 sm:p-10 rounded-xl"
    >
      <Box className="text-center">
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          color="textPrimary"
          className="mb-2"
          style={{ color: PrimaryColor }}
        >
          THANH TOÁN QR AN TOÀN
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className="mb-8"
        >
          Vui lòng quét mã QR để hoàn tất đơn hàng. Giao dịch được xác nhận tự động.
        </Typography>

        {/* KHU VỰC MÃ QR */}
        <div className="flex justify-center relative mb-8">
          <div className="inline-block p-4 border-8 border-gray-100 rounded-xl shadow-2xl bg-white transition-all duration-500">

            {qrData ? (
              // Hiển thị Mã QR
              <img
                src={qrData.qrUrl}
                alt="QR Code Payment"
                className="w-64 h-64 sm:w-80 sm:h-80 object-contain rounded-lg"
              />
            ) : (
              // Trạng thái Đang tạo mã
              <Box className="w-64 h-64 sm:w-80 sm:h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                <CircularProgress color="primary" />
                <span className="mt-4 text-gray-500">Đang tạo mã QR...</span>
              </Box>
            )}

            {/* TRẠNG THÁI THANH TOÁN OVERLAY */}
            {qrData && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-opacity duration-700 
                ${isPaidSuccess ? 'bg-white/90 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <CheckCircleOutlineIcon style={{ fontSize: 72, color: SuccessColor }} />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  className="mt-4 animate-bounce"
                  style={{ color: SuccessColor }}
                >
                      THANH TOÁN THÀNH CÔNG!
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mt-1">
                      Hệ thống đang xử lý đơn hàng...
                </Typography>
              </div>
            )}
          </div>
        </div>

        {/* KHU VỰC TRẠNG THÁI CHỜ */}
        {qrData && !isPaidSuccess && (
          <div className="mt-2 flex items-center justify-center gap-3 text-lg font-semibold animate-pulse mb-6" style={{ color: PrimaryColor }}>
            <AccessTimeIcon style={{ fontSize: 20 }} />
            <span>Đang chờ bạn thanh toán...</span>
          </div>
        )}

        {/* KHU VỰC LƯU Ý QUAN TRỌNG */}
        {qrData && (
          <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 text-left text-base text-gray-700">
            <Typography variant="body1">
  Nội dung chuyển khoản phải là:
            </Typography>

            <Box className="mt-2 text-center bg-white p-2 border border-blue-400 rounded-md shadow-inner">
              <Typography
                component="strong"
                className="font-mono text-xl text-blue-900 select-all"
              >
                {qrData?.transferContent || '...'}
              </Typography>
            </Box>
          </div>
        )}
      </Box>
    </Paper>
  )
}

export default EnhancedQRCodePayment
