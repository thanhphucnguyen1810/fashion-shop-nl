import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'
import { useTheme } from '@mui/material/styles'

const FeaturedSection = () => {
  const theme = useTheme()

  const PRIMARY_BLUE = '#1D4ED8'
  const PRIMARY_GREEN = '#059669'
  const ACCENT_YELLOW = '#F59E0B'
  const ICON_SIZE = 'text-3xl'

  return (
    <section className="py-20 px-4" style={{ backgroundColor: theme.palette.background.default }}>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">

        <div className="flex flex-col items-center group cursor-pointer p-4 transition duration-300 hover:shadow-lg rounded-xl">

          <div
            className={'p-5 rounded-full mb-4 shadow-md transition duration-300 transform group-hover:scale-110'}
            style={{
              backgroundColor: 'rgba(29, 78, 216, 0.1)',
              color: PRIMARY_BLUE
            }}
          >
            <HiShoppingBag className={ICON_SIZE} />
          </div>

          <h4 className="font-extrabold tracking-wider mb-1 uppercase" style={{ color: PRIMARY_BLUE }}>
            MIỄN PHÍ VẬN CHUYỂN
          </h4>

          <p className="text-sm tracking-wide font-medium text-gray-600 max-w-xs">
            Giao hàng toàn cầu miễn phí và nhanh chóng cho mọi đơn hàng.
          </p>
        </div>

        <div className="flex flex-col items-center group cursor-pointer p-4 transition duration-300 hover:shadow-lg rounded-xl">
          <div
            className={'p-5 rounded-full mb-4 shadow-md transition duration-300 transform group-hover:scale-110'}
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: ACCENT_YELLOW
            }}
          >
            <HiArrowPathRoundedSquare className={ICON_SIZE} />
          </div>

          <h4 className="font-extrabold tracking-wider mb-1 uppercase" style={{ color: ACCENT_YELLOW }}>
            ĐỔI TRẢ DỄ DÀNG
          </h4>

          <p className="text-sm tracking-wide font-medium text-gray-600 max-w-xs">
            Chính sách đổi trả sản phẩm linh hoạt trong 45 ngày.
          </p>
        </div>

        <div className="flex flex-col items-center group cursor-pointer p-4 transition duration-300 hover:shadow-lg rounded-xl">

          <div
            className={'p-5 rounded-full mb-4 shadow-md transition duration-300 transform group-hover:scale-110'}
            style={{
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              color: PRIMARY_GREEN
            }}
          >
            <HiOutlineCreditCard className={ICON_SIZE} />
          </div>
          <h4 className="font-extrabold tracking-wider mb-1 uppercase" style={{ color: PRIMARY_GREEN }}>
            THANH TOÁN AN TOÀN
          </h4>

          <p className="text-sm tracking-wide font-medium text-gray-600 max-w-xs">
            Giao dịch được bảo mật tuyệt đối với công nghệ mã hóa SSL.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection
