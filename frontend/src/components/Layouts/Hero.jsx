import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import heroImg from '~/assets/aurora-hero.jpg'

const Hero = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const overlayStyle = {
    backgroundColor: isDark
      ? 'rgba(0, 0, 0, 0.55)'
      : 'rgba(255, 255, 255, 0.25)'
  }

  const textColor = {
    color: isDark
      ? theme.palette.info.light
      : theme.palette.primary.dark
  }

  const buttonStyle = {
    backgroundColor: isDark
      ? theme.palette.common.white
      : theme.palette.primary.main,
    color: isDark
      ? theme.palette.grey[900]
      : theme.palette.common.white
  }

  return (
    <section className="relative w-full">
      {/* Ảnh nền */}
      <img
        src={heroImg}
        alt="TheAurora Hero Banner"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover object-center brightness-110 contrast-125"
      />

      {/* Overlay + Text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-all duration-500"
        style={overlayStyle}
      >
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl leading-tight"
          style={textColor}
        >
          TỎA SÁNG CÙNG <br /> TheAurora
        </h1>

        <p
          className="text-base md:text-lg mb-8 max-w-2xl mx-auto drop-shadow-md"
          style={{
            color: isDark
              ? theme.palette.grey[300]
              : theme.palette.text.primary
          }}
        >
          Outfit năng động, thoải mái cho mọi hành trình — tự tin thể hiện phong cách riêng của bạn!
        </p>

        <Link
          to="#"
          className="inline-block px-6 py-3 rounded-md text-lg font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
          style={buttonStyle}
        >
          Mua Sắm Ngay
        </Link>
      </div>
    </section>
  )
}

export default Hero
