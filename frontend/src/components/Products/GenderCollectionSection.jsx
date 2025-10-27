import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import menCollectionImage from '~/assets/mens-collection.webp'
import womenCollectionImage from '~/assets/womens-collection.webp'

const GenderCollectionSection = () => {
  const theme = useTheme()

  const overlayStyle = {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(31, 41, 55, 0.85)' // nền tối hơn cho dark mode
        : 'rgba(255, 255, 255, 0.9)', // nền sáng cho light mode
    color: theme.palette.text.primary,
    borderRadius: '0.5rem'
  }

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col md:flex-row gap-8'>
        {/* Bộ sưu tập nữ */}
        <div className='relative flex-1 rounded-lg overflow-hidden shadow-md'>
          <img
            src={womenCollectionImage}
            alt='Bộ sưu tập nữ'
            className='w-full h-[700px] object-cover transform hover:scale-105 transition duration-500 ease-in-out'
          />
          <div className='absolute bottom-8 left-8 p-6 backdrop-blur-sm shadow-lg' style={overlayStyle}>
            <h2 className='text-3xl font-bold mb-3 tracking-wide'>Bộ sưu tập Nữ</h2>
            <Link
              to='/collections/all?gender=Women'
              className='underline font-medium hover:opacity-80 transition'
              style={{ color: theme.palette.text.primary }}
            >
              Mua ngay
            </Link>
          </div>
        </div>

        {/* Bộ sưu tập nam */}
        <div className='relative flex-1 rounded-lg overflow-hidden shadow-md'>
          <img
            src={menCollectionImage}
            alt='Bộ sưu tập nam'
            className='w-full h-[700px] object-cover transform hover:scale-105 transition duration-500 ease-in-out'
          />
          <div className='absolute bottom-8 left-8 p-6 backdrop-blur-sm shadow-lg' style={overlayStyle}>
            <h2 className='text-3xl font-bold mb-3 tracking-wide'>Bộ sưu tập Nam</h2>
            <Link
              to='/collections/all?gender=Men'
              className='underline font-medium hover:opacity-80 transition'
              style={{ color: theme.palette.text.primary }}
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection
