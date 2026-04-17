import { BrevoProvider } from '~/providers/BrevoProvider'
import generateVerificationEmail from '~/Templates/verifyEmail'
import generatePasswordResetEmail from '~/Templates/passwordResetEmail'

// ================= VERIFY EMAIL =================
export const sendVerificationEmail = async ({ to, subject, name, token }) => {
  const htmlMessage = generateVerificationEmail(name, token)

  try {
    await BrevoProvider.sendEmail(
      to,
      subject,
      htmlMessage
    )

    console.log('Verification email sent')
  } catch (error) {
    console.error('Brevo error:', error?.response?.body || error.message)

    throw new Error('Error sending email')
  }
}

// ================= RESET PASSWORD =================
export const sendPasswordResetEmail = async ({ to, subject, name, resetURL }) => {
  const htmlMessage = generatePasswordResetEmail(name, resetURL)

  try {
    await BrevoProvider.sendEmail(
      to,
      subject,
      htmlMessage
    )

    console.log(`Password reset email sent to: ${to}`)
  } catch (error) {
    console.error('Brevo error:', error?.response?.body || error.message)

    throw new Error('Error sending password reset email')
  }
}
