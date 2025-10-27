import { useTheme } from '@mui/material/styles'
import { FiPhoneCall } from 'react-icons/fi'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Footer = () => {
  const theme = useTheme()

  return (
    <footer
      style={{ borderTop: `1px solid ${theme.palette.divider}` }}
      className='py-12'
    >
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
        {/* Newsletter */}
        <div>
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4'>
            Bản tin
          </h3>
          <p style={{ color: theme.palette.text.secondary }} className='mb-4'>
            Hãy là người đầu tiên biết về sản phẩm mới, sự kiện độc quyền và ưu đãi trực tuyến.
          </p>
          <p style={{ color: theme.palette.text.secondary }}>
            Đăng ký và nhận ngay ưu đãi giảm 10% cho đơn hàng đầu tiên.
          </p>
          <form className='flex mt-4'>
            <input
              type='email'
              placeholder='Nhập email của bạn'
              className='p-3 w-full text-sm border-t border-l border-b rounded-l-md focus:outline-none transition-all'
              style={{
                borderColor: theme.palette.grey[300],
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
              }}
              required
            />
            <button
              type='submit'
              className='px-6 py-3 text-sm rounded-r-md transition-all'
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            >
              Đăng ký
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div>
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4'>Mua sắm</h3>
          <ul className='space-y-2'>
            {['Áo nam', 'Áo nữ', 'Quần nam', 'Quần nữ'].map((text, i) => (
              <li key={i}>
                <Link
                  to='#'
                  style={{ color: theme.palette.text.secondary }}
                  className='hover:underline'
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4'>Hỗ trợ</h3>
          <ul className='space-y-2'>
            {['Liên hệ', 'Về chúng tôi', 'Câu hỏi thường gặp', 'Tính năng'].map((text, i) => (
              <li key={i}>
                <Link
                  to='#'
                  style={{ color: theme.palette.text.secondary }}
                  className='hover:underline'
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 style={{ color: theme.palette.text.primary }} className='text-lg mb-4'>Theo dõi chúng tôi</h3>
          <div className='flex items-center space-x-4 mb-6'>
            {[{
              icon: <TbBrandMeta className='h-5 w-5' />,
              href: 'https://www.facebook.com'
            }, {
              icon: <IoLogoInstagram className='h-5 w-5' />,
              href: 'https://www.instagram.com'
            }, {
              icon: <RiTwitterXLine className='h-4 w-4' />,
              href: 'https://x.com'
            }].map(({ icon, href }, i) => (
              <a
                key={i}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: theme.palette.text.secondary }}
                className='hover:opacity-80'
              >
                {icon}
              </a>
            ))}
          </div>
          <p style={{ color: theme.palette.text.secondary }}>Gọi cho chúng tôi</p>
          <p style={{ color: theme.palette.text.primary }}>
            <FiPhoneCall className='inline-block mr-2' />
            0123-456-789
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className='container mx-auto mt-12 px-4 lg:px-0 pt-6'
        style={{ borderTop: `1px solid ${theme.palette.divider}` }}
      >
        <p
          className='text-sm tracking-tighter text-center'
          style={{ color: theme.palette.text.secondary }}
        >
          &copy; 2025, CompileTab. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  )
}

export default Footer
