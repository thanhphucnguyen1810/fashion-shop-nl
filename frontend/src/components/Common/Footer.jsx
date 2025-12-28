import { useTheme } from '@mui/material/styles'
import { FiPhoneCall } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

  const headingStyle = {
    color: theme.palette.text.primary,
    fontWeight: 700,
    letterSpacing: '0.05em',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  }

  const linkStyle = {
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    transition: 'color 0.3s ease'
  }

  return (
    <footer
      className='pt-10 pb-6 md:pt-14 md:pb-8'
      style={{ backgroundColor: theme.palette.background.default }}
    >


      {/* === MAIN CONTENT*/}
      <div className='container mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 lg:gap-20 px-4 lg:px-0'>

        {/* Mua sắm & Hỗ trợ */}
        <div className='col-span-2 md:col-span-1 grid grid-cols-2 gap-8'>
          {/* Shop links */}
          <div>
            <h3 style={headingStyle} className='uppercase'>Mua sắm</h3>
            <ul className='space-y-1.5'>
              {['Thời trang nam', 'Thời trang nữ', 'Bộ sưu tập mới', 'Sản phẩm giảm giá'].map((text, i) => (
                <li key={i}>
                  <Link
                    to='#'
                    style={linkStyle}
                    className='hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={headingStyle} className='uppercase'>Hỗ trợ khách hàng</h3>
            <ul className='space-y-1.5'>
              {['Liên hệ', 'Về chúng tôi', 'Câu hỏi thường gặp', 'Chính sách bảo mật'].map((text, i) => (
                <li key={i}>
                  <Link
                    to='#'
                    style={linkStyle}
                    className='hover:text-blue-600 dark:hover:text-blue-400'
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === 2. Thông tin liên hệ & Socials=== */}
        <div className='md:col-span-1'>
          <h3 style={headingStyle} className='uppercase'>Liên hệ & Theo dõi</h3>

          <p className='mt-1 mb-1' style={linkStyle}>
            support@yourshop.com
          </p>
          <p className='mt-1' style={{ color: theme.palette.text.primary, fontWeight: 700, fontSize: '0.9rem' }}>
            <FiPhoneCall className='inline-block mr-2 h-4 w-4' />
            0123-456-789
          </p>

          <div className='flex items-center space-x-5 mt-6'>
            {[
              { icon: <FaFacebookF className='h-5 w-5' />, href: 'https://www.facebook.com' },
              { icon: <FaInstagram className='h-5 w-5' />, href: 'https://www.instagram.com' },
              { icon: <FaTwitter className='h-5 w-5' />, href: 'https://x.com' }
            ].map(({ icon, href }, i) => (
              <a
                key={i}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: theme.palette.text.secondary }}
                className='hover:text-yellow-600 transition-colors duration-300'
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* === 3. Bản tin (Newsletter) === */}
        <div className='col-span-2 md:col-span-1 mt-4 md:mt-0'>
          <h3 style={headingStyle} className='uppercase'>
            Nhận ưu đãi 10%
          </h3>
          <p style={linkStyle} className='mb-3 leading-relaxed'>
            Đăng ký để nhận ưu đãi đầu tiên và thông tin sản phẩm mới nhất.
          </p>

          <form className='flex'>
            <input
              type='email'
              placeholder='Email của bạn'
              className='p-3 w-full text-sm border focus:outline-none focus:ring-1 transition-all'
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: '4px 0 0 4px'
              }}
              required
            />
            <button
              type='submit'
              className='px-5 py-3 text-sm font-bold tracking-wider uppercase hover:opacity-90'
              style={{
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                borderRadius: '0 4px 4px 0'
              }}
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* === Bottom bar (Thông tin bản quyền) === */}
      <div
        className='container mx-auto mt-10 px-4 lg:px-0 pt-4'
        style={{ borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <p
          className='text-xs tracking-wider text-center'
          style={{ color: theme.palette.text.secondary }}
        >
          &copy; {currentYear}, CompileTab. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  )
}

export default Footer
