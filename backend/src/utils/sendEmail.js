import sgMail from '@sendgrid/mail'
import { env } from '~/config/environment'
import generateVerificationEmail from '~/Templates/verifyEmail'
import generatePasswordResetEmail from '~/Templates/passwordResetEmail'

sgMail.setApiKey(env.SENDGRID_API_KEY)


export const sendVerificationEmail = async ({ to, from, subject, name, token }) => {
  const htmlMessage = generateVerificationEmail(name, token)
  const msg = {
    to,
    from,
    subject,
    html: htmlMessage,
    mailSettings: {
      sandboxMode: { enable: false }
    }
  }

  try {
    await sgMail.send(msg)
    console.log('Verification email sent')
  } catch (error) {
    console.error(error)
    if (error.response) {
      console.error(error.response.body)
    }
    throw new Error('Error sending email')
  }
}

export const sendPasswordResetEmail = async ({ to, from, subject, name, resetURL }) => {
  const htmlMessage = generatePasswordResetEmail(name, resetURL)

  const msg = {
    to,
    from,
    subject,
    html: htmlMessage,
    mailSettings: {
      sandboxMode: { enable: false }
    }
  }

  try {
    await sgMail.send(msg)
    console.log(`Password reset email sent to: ${to}`)
  } catch (error) {
    console.error(error)
    if (error.response) {
      // Log chi tiết phản hồi lỗi từ SendGrid
      console.error(error.response.body)
    }
    throw new Error('Error sending password reset email')
  }
}

