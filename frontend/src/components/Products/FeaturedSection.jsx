import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'
import { useTheme } from '@mui/material/styles'

const FeaturedSection = () => {
  const theme = useTheme()

  const textPrimary = theme.palette.text.primary
  const textSecondary = theme.palette.text.secondary
  const bgMain = theme.palette.background.default

  return (
    <section className="py-16 px-4" style={{ backgroundColor: bgMain }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Ưu điểm 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl" style={{ color: theme.palette.primary.main }} />
          </div>
          <h4 className="tracking-tighter mb-2 uppercase" style={{ color: textPrimary }}>
            Miễn phí vận chuyển quốc tế
          </h4>
          <p className="text-sm tracking-tighter" style={{ color: textSecondary }}>
            Cho mọi đơn hàng từ 2.500.000₫ trở lên
          </p>
        </div>

        {/* Ưu điểm 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiArrowPathRoundedSquare className="text-xl" style={{ color: theme.palette.success.main }} />
          </div>
          <h4 className="tracking-tighter mb-2 uppercase" style={{ color: textPrimary }}>
            Đổi trả trong 45 ngày
          </h4>
          <p className="text-sm tracking-tighter" style={{ color: textSecondary }}>
            Hoàn tiền nếu không hài lòng
          </p>
        </div>

        {/* Ưu điểm 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard className="text-xl" style={{ color: theme.palette.info.main }} />
          </div>
          <h4 className="tracking-tighter mb-2 uppercase" style={{ color: textPrimary }}>
            Thanh toán an toàn
          </h4>
          <p className="text-sm tracking-tighter" style={{ color: textSecondary }}>
            Quy trình bảo mật 100% khi thanh toán
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection
