import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa'
import storeImage from '~/assets/storeImage.png'

<div className='h-60 bg-gray-200 rounded-lg shadow-lg overflow-hidden relative'>
  <div
    className='absolute inset-0 bg-cover bg-center'
    style={{ backgroundImage: `url(${storeImage})` }}
  ></div>
  <div className='absolute inset-0 bg-black opacity-40 flex items-center justify-center'>
    <span className='text-white text-lg font-semibold'>THEAURORA Flagship Store</span>
  </div>
</div>


const Contact = () => {
  return (
    <div className='min-h-screen bg-gray-900 flex flex-col items-center p-0 sm:p-4'>
      <div className='w-full max-w-6xl xl:max-w-7xl bg-white shadow-2xl rounded-none sm:rounded-xl overflow-hidden my-4 sm:my-10'>
        <div className='p-12 text-center bg-black text-white'>
          <h1 className='text-6xl font-serif font-extrabold tracking-widest'>
            LIÊN HỆ <span className='text-yellow-400 font-Lobster'>TheAurora</span>
          </h1>
          <p className='mt-3 text-xl font-light opacity-80'>
            Kết nối với chúng tôi để nhận sự hỗ trợ về phong cách nhanh nhất.
          </p>
        </div>
        <div className='p-8 md:p-12 grid md:grid-cols-2 gap-12'>
          <div className='space-y-10'>
            <h2 className='text-3xl font-bold text-gray-900 border-b pb-3 border-yellow-400'>
              Chi Tiết Liên Hệ
            </h2>

            <div className='flex items-start space-x-4'>
              <FaMapMarkerAlt className='text-3xl text-yellow-600 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-bold text-gray-800'>Cửa Hàng Chính</h3>
                <p className='text-gray-600'>247 Đại lộ Thời Trang, Quận Phong Cách, TP. Ánh Sáng</p>
                <a
                  href="https://maps.app.goo.gl/YourMapLinkHere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className='text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center mt-1'
                >
                  <FaLocationArrow className='mr-1' /> Xem trên bản đồ
                </a>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <FaPhone className='text-3xl text-yellow-600 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-bold text-gray-800'>Hotline Hỗ Trợ</h3>
                <p className='text-gray-600'>+84 901 234 567 (Dịch vụ khách hàng)</p>
                <p className='text-gray-600'>+84 908 765 432 (Hợp tác kinh doanh)</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <FaEnvelope className='text-3xl text-yellow-600 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-bold text-gray-800'>Email Chính Thức</h3>
                <p className='text-gray-600'>support@theaurorashop.vn (Hỗ trợ chung)</p>
                <p className='text-gray-600'>sales@theaurorashop.vn (Đặt hàng số lượng lớn)</p>
              </div>
            </div>
            <div className='mt-10'>
              <div className='h-60 bg-gray-200 rounded-lg shadow-lg overflow-hidden relative'>
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{ backgroundImage: `url(${storeImage})` }}
                ></div>
                <div className='absolute inset-0 bg-black opacity-40 flex items-center justify-center'>
                  <span className='text-white text-lg font-semibold'>THEAURORA Flagship Store</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className='text-3xl font-bold text-gray-900 border-b pb-3 border-yellow-400'>
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            <form className='mt-8 space-y-6 bg-gray-50 p-6 rounded-lg shadow-inner'>
              <input
                type='text'
                placeholder='Tên đầy đủ của bạn'
                className='w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150'
                required
              />
              <input
                type='email'
                placeholder='Địa chỉ Email'
                className='w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150'
                required
              />
              <input
                type='text'
                placeholder='Tiêu đề (Ví dụ: Về đơn hàng #1234, Yêu cầu hợp tác...)'
                className='w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150'
                required
              />
              <textarea
                placeholder='Nội dung chi tiết'
                rows='6'
                className='w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 resize-none transition duration-150'
                required
              ></textarea>
              <button
                type='submit'
                className='w-full py-4 bg-yellow-600 text-white text-lg font-bold rounded-lg hover:bg-yellow-700 transition duration-300 shadow-xl tracking-wider uppercase'
              >
                Gửi Yêu Cầu Hỗ Trợ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
