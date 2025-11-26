import { env } from '~/config/environment'
const generateVerificationEmail = (name, token) => {
  const link = `${env.API_URL}/api/users/verify-email/${token}`
  return `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận Email Tài khoản</title>
    <style>
        /* Reset CSS cơ bản */
        body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background-color: #115581; color: #ffffff; padding: 20px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; text-align: left; line-height: 1.6; color: #333333; }
        .button-container { text-align: center; margin: 25px 0; }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff !important; /* Quan trọng để đảm bảo màu chữ */
            background-color: #115581;
            text-decoration: none;
            border-radius: 6px;
            border: 1px solid #115581;
        }
        .footer { padding: 20px 30px; font-size: 12px; color: #777777; text-align: center; border-top: 1px solid #eeeeee; }
        .expiration { font-size: 14px; color: #999999; margin-top: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Xác Minh Tài Khoản</h1>
        </div>

        <div class="content">
            <p style="font-size: 16px;">Chào ${name}, </p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại TheAurora. </p>
            <p>Để hoàn tất quá trình đăng ký và kích hoạt tài khoản, vui lòng bấm vào nút xác nhận bên dưới:</p>
            
            <div class="button-container">
                <a class="btn" href="${link}" target="_blank">Xác nhận Email</a>
            </div>

            <p style="font-style: italic;">Nếu bạn không thể bấm vào nút, vui lòng sao chép và dán liên kết sau vào trình duyệt của bạn: </p>
            <p style="font-size: 12px; word-break: break-all;">${link}</p>
            
            <div class="expiration">
                Liên kết này sẽ hết hạn trong vòng 24 giờ.
            </div>

            <p style="margin-top: 30px;">Xin chân thành cảm ơn,<br/>Đội ngũ TheAurora</p>
        </div>

        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TheAurora. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `
}

export default generateVerificationEmail
