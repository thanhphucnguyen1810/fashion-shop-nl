import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'
import { useTheme } from '@mui/material/styles'

import CarouselMid from '~/components/Common/CarouselMid'

const Topbar = () => {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  // Màu linh hoạt theo chế độ sáng/tối
  const bgColor = isLight ? 'bg-[#0b3d91]' : 'bg-[#0a2a52]'
  const textColor = isLight ? 'text-[#f8fafc]' : 'text-[#e2e8f0]'
  const iconColor = isLight ? 'text-[#e0e7ff]' : 'text-[#cbd5e1]'
  const hoverColor = isLight ? 'hover:text-white' : 'hover:text-[#f1f5f9]'

  return (
    <div className={`${bgColor} ${textColor} text-sm transition-colors duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4 py-2">

        {/* Left - Social Icons */}
        <div className="hidden md:flex items-center space-x-3">
          <a href="#" className={`${iconColor} ${hoverColor} transition`} title="Meta">
            <TbBrandMeta className="w-5 h-5" />
          </a>
          <a href="#" className={`${iconColor} ${hoverColor} transition`} title="Instagram">
            <IoLogoInstagram className="w-5 h-5" />
          </a>
          <a href="#" className={`${iconColor} ${hoverColor} transition`} title="X (Twitter)">
            <RiTwitterXLine className="w-5 h-5" />
          </a>
        </div>

        {/* Center - Announcement */}
        <div className="flex-1 text-center px-2">
          <div className="text-[13px] font-medium tracking-wide text-[#f8fafc] dark:text-[#e2e8f0]">
            <CarouselMid />
          </div>
        </div>

        {/* Right - Phone */}
        <div className="hidden md:block">
          <a
            href="tel:+12345678901"
            className={`${hoverColor} font-medium transition`}
            title="Call us"
          >
            +1 (234) 567-8901
          </a>
        </div>

      </div>
    </div>
  )
}

export default Topbar
