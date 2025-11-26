import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import menCollectionImage from '~/assets/mens-collection.png'
import womenCollectionImage from '~/assets/womens-collection.png'

const TITLE_COLOR = '#00587C'
const CTA_COLOR = '#00ABFD'

const GenderCollectionSection = () => {
  const theme = useTheme()
  const overlayStyle = {
    backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(31, 41, 55, 0.85)'
      : 'rgba(255, 255, 255, 0.9)',
    color: theme.palette.text.primary,
    borderRadius: '0.5rem',
    boxShadow: theme.shadows[10]
  }


  const buttonStyle = {
    backgroundColor: CTA_COLOR,
    color: '#FFFFFF',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold'
  }

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto flex flex-col md:flex-row gap-8'>
        {/* Bộ sưu tập nữ */}
        <div className='relative flex-1 rounded-lg overflow-hidden shadow-xl'>
          <img
            src={womenCollectionImage}
            alt='Thời Trang nữ'
            className='w-full h-[400px] md:h-[550px] object-cover object-top transform hover:scale-105 transition duration-500 ease-in-out'
          />

          <div className='absolute bottom-8 left-8 p-6 backdrop-blur-sm' style={overlayStyle}>
            <h2
              className='text-3xl font-bold mb-4 tracking-wide'
              style={{ color: TITLE_COLOR }}
            > Thời Trang Nữ
            </h2>
            <Link
              to='/collections/women'
              className='inline-block shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]'
              style={buttonStyle}
            > MUA NGAY
            </Link>
          </div>
        </div>

        {/* Bộ sưu tập nam */}
        <div className='relative flex-1 rounded-lg overflow-hidden shadow-xl'>
          <img
            src={menCollectionImage}
            alt='Thời Trang nam'
            className='w-full h-[400px] md:h-[550px] object-cover object-top transform hover:scale-105 transition duration-500 ease-in-out'
          />
          <div className='absolute bottom-8 left-8 p-6 backdrop-blur-sm' style={overlayStyle}>
            <h2
              className='text-3xl font-bold mb-4 tracking-wide'
              style={{ color: TITLE_COLOR }}
            >
              Thời Trang Nam
            </h2>
            <Link
              to='/collections/men'
              className='inline-block shadow-lg hover:opacity-90 transition transform hover:scale-[1.02]'
              style={buttonStyle}
            >
           MUA NGAY
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenderCollectionSection
