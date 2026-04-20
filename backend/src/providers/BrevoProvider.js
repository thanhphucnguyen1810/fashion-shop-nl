import { BrevoClient } from '@getbrevo/brevo'
import { env } from '~/config/environment'

const brevo = new BrevoClient({
  apiKey: env.BREVO_API_KEY,
  timeout: 30000,
  maxRetries: 3
})

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: customSubject,

      htmlContent: customHtmlContent,

      sender: {
        email: env.ADMIN_EMAIL_ADDRESS,
        name: env.ADMIN_EMAIL_NAME
      },

      to: [
        { email: recipientEmail }
      ]
    })

    return result
  } catch (error) {
    console.error('Send email error:', error)
    throw error
  }
}

export const BrevoProvider = {
  sendEmail
}
