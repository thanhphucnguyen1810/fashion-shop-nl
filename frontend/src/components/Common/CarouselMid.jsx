import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { FaOpencart } from 'react-icons/fa'

const slides = [
  'Thanh lịch & tinh tế – Giảm đến 40% cho áo sơ mi và vest!',
  'Thoải mái, năng động – Áo polo và quần chinos đang giảm giá!',
  'Váy hoa và chân váy nhẹ nhàng – Tỏa sáng trong từng bước đi!',
  'Thanh lịch, thời trang – Khám phá bộ sưu tập mới nhất!',
  'Cho bé vui chơi thật phong cách – Trang phục dễ chịu, năng động!',
  'Màu sắc rực rỡ & họa tiết đáng yêu – Bắt đầu làm mới tủ đồ của bé ngay hôm nay!'
]

const CarouselMid = () => {
  const theme = useTheme()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const isLight = theme.palette.mode === 'light'
  const textColor = isLight ? '#f1f5f9' : '#e2e8f0'
  const iconColor = isLight ? '#f8fafc' : '#e2e8f0'

  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-4 text-center">
      <div
        className="transition-opacity duration-500 ease-in-out text-base md:text-lg font-medium"
        style={{ color: textColor }}
      >
        <FaOpencart className="inline mr-2 text-lg align-text-bottom" style={{ color: iconColor }} />
        {slides[current]}
      </div>
    </div>
  )
}

export default CarouselMid
