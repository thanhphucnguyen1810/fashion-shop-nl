import { useTheme } from '@mui/material/styles'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const AuthLayout = ({ children, image, imageAlt, showBackButton = false }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <div
      className='flex min-h-screen relative'
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      {/* Nút quay lại */}
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className='absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-1 text-sm font-semibold p-2 rounded hover:opacity-80 transition z-10'
          style={{ color: theme.palette.text.secondary }}
        >
          <IoIosArrowBack className='text-lg' />
          Quay lại
        </button>
      )}

      {/*Form nội dung */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12'>
        <div
          className='w-full max-w-md p-6 md:p-8 rounded-xl border shadow-lg'
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider
          }}
        >
          {children}
        </div>
      </div>

      {/* Hình ảnh minh họa */}
      <div
        className='hidden md:flex w-1/2 items-center justify-center p-12'
        style={{ backgroundColor: theme.palette.background.neutral }}
      >
        <div className='relative flex justify-center items-center w-full'>
          <img
            src={image}
            alt={imageAlt}
            className='max-h-[600px] w-auto object-contain transform transition duration-500 hover:scale-105'
          />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout