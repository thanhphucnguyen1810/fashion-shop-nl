import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import heroImg from '~/assets/hero.png'

const Hero = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const overlayStyle = {
    backgroundColor: isDark
      ? 'rgba(0, 0, 0, 0.55)'
      : 'rgba(255, 255, 255, 0.25)'
  }

  const textColor = {
    color: '#00ABFD'
  }

  const descriptionColor = {
    color: isDark ? theme.palette.grey[200] : theme.palette.grey[800]
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
    <section className="relative w-full overflow-hidden">
      <img
        src={heroImg}
        alt="TheAurora Hero Banner"
        className="w-full h-[350px] md:h-[450px] lg:h-[500px] xl:max-h-[550px] object-cover object-top brightness-95 contrast-110"
        loading="eager"
      />

      {/* Overlay + Text */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-start text-left transition-all duration-500"
        style={overlayStyle}
      >
        <div className="w-full px-6 py-8 md:py-12 md:pl-20 lg:pl-32">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-Poppins font-bold tracking-tight mb-4 drop-shadow-2xl leading-tight"
            style={textColor}
          >
            <span className='font-Lobster'>TheAurora</span>
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-md drop-shadow-md font-medium"
            style={descriptionColor}
          >
           Outfit năng động, thoải mái cho mọi hành trình — tự tin thể hiện phong cách riêng của bạn!
          </p>

          <Link
            to="#"
            className="inline-block px-6 py-2 rounded-full text-base font-bold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-300 transform"
            style={buttonStyle}
          >
           MUA NGAY
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
