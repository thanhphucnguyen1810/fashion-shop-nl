const generatePasswordResetEmail = (name, resetURL) => {
  return `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Chào ${name},</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấp vào liên kết dưới đây để hoàn tất:</p>
                
                <p style="margin: 20px 0;">
                    <a href="${resetURL}" 
                       style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Đặt lại Mật khẩu
                    </a>
                </p>

                <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                
                <p>Trân trọng,</p>
                <p>Đội ngũ Hỗ trợ</p>
                <p style="font-size: 0.8em; color: #666;">Liên kết đặt lại: ${resetURL}</p>
            </body>
        </html>
    `
}

export default generatePasswordResetEmail
