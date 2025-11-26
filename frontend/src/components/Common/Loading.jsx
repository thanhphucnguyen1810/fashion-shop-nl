import React from 'react'

const Loading = () => {
  return (
    // Container chiếm toàn bộ màn hình, căn giữa
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm'>

      {/* Loading Spinner */}
      <div className='relative flex items-center justify-center'>

        {/* Vòng tròn bên ngoài (Animation) */}
        <div className='w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-yellow-600'></div>

        {/* Logo/Text ở giữa (hoặc có thể thay bằng logo SVG) */}
        <div className='absolute text-lg font-bold text-gray-800 opacity-70'>
          <span className='text-sm font-serif text-yellow-600'>A</span>
        </div>
      </div>

      {/* Loading Text */}
      <p className='mt-5 text-lg font-medium text-gray-700 tracking-wider animate-pulse'>
        Đang tải nội dung, chờ chút nhé...
      </p>

      {/* Thương hiệu */}
      <p className='mt-2 text-xs text-gray-500 font-light'>
        THEAURORA
      </p>
    </div>
  )
}

export default Loading
