import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io5'
import { RiTwitterXLine } from 'react-icons/ri'
import { FaGlobe, FaQuestionCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import CarouselMid from '~/components/Common/CarouselMid'

const BACKGROUND_COLOR = '#0A3D62'
const TEXT_COLOR = '#FFCBA4'
const HOVER_TEXT_COLOR = '#FFFFFF'

const Topbar = () => {

  return (
    <div
      className={'text-sm transition-colors duration-300'}
      style={{ backgroundColor: BACKGROUND_COLOR, color: TEXT_COLOR }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">

        {/* Left */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/help-center"
            className={`font-medium transition text-xs flex items-center space-x-1 hover:text-[${HOVER_TEXT_COLOR}]`}
            style={{ color: TEXT_COLOR }}
          >
            <FaQuestionCircle className="w-4 h-4" />
            <span>Trợ giúp & FAQ</span>
          </Link>

          <div className="flex items-center space-x-2">
            <a href="#" className={`transition hover:text-[${HOVER_TEXT_COLOR}]`} title="Meta" style={{ color: TEXT_COLOR }}>
              <TbBrandMeta className="w-4 h-4" />
            </a>
            <a href="#" className={`transition hover:text-[${HOVER_TEXT_COLOR}]`} title="Instagram" style={{ color: TEXT_COLOR }}>
              <IoLogoInstagram className="w-4 h-4" />
            </a>
            <a href="#" className={`transition hover:text-[${HOVER_TEXT_COLOR}]`} title="Twitter X" style={{ color: TEXT_COLOR }}>
              <RiTwitterXLine className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="flex-1 text-center px-2">
          <div className="text-[13px] font-medium tracking-wide">
            <CarouselMid />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <button
            className={`font-medium transition text-xs flex items-center space-x-1 hover:text-[${HOVER_TEXT_COLOR}]`}
            title="Select Currency"
          >
            <span>VND</span>
          </button>

          <button
            className={`font-medium transition text-xs flex items-center space-x-1 hover:text-[${HOVER_TEXT_COLOR}]`}
            title="Select Language"
          >
            <FaGlobe className="w-4 h-4" />
            <span>VI</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Topbar
