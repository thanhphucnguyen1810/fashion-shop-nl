import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import featured from '~/assets/featured.png'

const FeaturedCollection = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const bgColor = isDark ? '#212121' : '#f0fdf4'

  return (
    <section className="py-12">
      <div
        className="container mx-auto flex flex-col-reverse lg:flex-row items-center rounded-3xl overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Nội dung bên trái */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left space-y-6">
          <h2
            className="text-lg font-semibold"
            style={{ color: theme.palette.text.secondary }}
          >
            Thoải mái & Phong cách
          </h2>

          <h2
            className="text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: theme.palette.text.primary }}
          >
            Trang phục phù hợp với nhu cầu mỗi ngày của bạn
          </h2>

          <p
            className="text-lg"
            style={{ color: theme.palette.text.secondary }}
          >
            Khám phá những thiết kế chất lượng cao, thoải mái và thời trang —
            giúp bạn luôn tự tin, nổi bật và dễ chịu trong mọi khoảnh khắc.
          </p>

          <Link
            to="/collections/all"
            className="inline-block px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 shadow-md hover:opacity-90"
            style={{
              backgroundColor: isDark
                ? theme.palette.common.white
                : theme.palette.primary.main,
              color: isDark
                ? theme.palette.grey[900]
                : theme.palette.common.white
            }}
          >
            Mua Ngay
          </Link>
        </div>

        {/* Hình ảnh bên phải */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Bộ sưu tập nổi bật"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
