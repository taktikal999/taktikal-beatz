import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
import { sanitizeObject, getClientIP, getClientUserAgent, validateEmail } from '@/lib/security'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const validationResult = contactSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { name, email, subject, message } = validationResult.data
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    const ip = getClientIP(request)
    const userAgent = getClientUserAgent(request)
    
    const { data: contactMessage, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        subject,
        message,
        ip_address: ip,
        user_agent: userAgent,
        status: 'unread',
      }])
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    try {
      await sendNotificationEmail({
        name,
        email,
        subject,
        message,
        messageId: contactMessage.id,
      })
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact message submitted successfully',
      data: { id: contactMessage.id },
    })
  } catch (error: any) {
    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact message' },
      { status: 500 }
    )
  }
}

async function sendNotificationEmail(data: {
  name: string
  email: string
  subject: string
  message: string
  messageId: string
}) {
  const { name, email, subject, message, messageId } = data
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@taktikalbeatz.com'
  
  const emailContent = `
    New Contact Form Submission
    
    From: ${name} <${email}>
    Subject: ${subject}
    Message ID: ${messageId}
    Date: ${new Date().toLocaleString()}
    
    Message:
    ${message}
    
    ---
    
    This message was sent via the Taktikal Beatz contact form.
    Please respond to the sender within 24-48 hours.
  `
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New Contact Form Submission</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>From:</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${name} &lt;${email}&gt;</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>Subject:</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>Message ID:</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${messageId}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f9fafb;"><strong>Date:</strong></td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <strong>Message:</strong>
        <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 12px;">
        This message was sent via the Taktikal Beatz contact form.<br>
        Please respond to the sender within 24-48 hours.
      </p>
    </div>
  `
  
  await transporter.sendMail({
    from: `"Taktikal Beatz Contact Form" <${process.env.SMTP_FROM || 'noreply@taktikalbeatz.com'}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New Contact: ${subject}`,
    text: emailContent,
    html: htmlContent,
  })
  
  await sendAutoReply(email, name)
}

async function sendAutoReply(toEmail: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #0ea5e9; margin: 0;">Taktikal Beatz</h1>
        <p style="color: #6b7280; margin-top: 5px;">Premium Music Production</p>
      </div>
      
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Thank You for Reaching Out!</h2>
        
        <p>Hi ${name},</p>
        
        <p>We've received your message and our team will review it shortly. We strive to respond to all inquiries within 24-48 hours during business days.</p>
        
        <div style="background-color: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #1f2937; margin-top: 0;">What to Expect Next:</h3>
          <ul style="color: #4b5563;">
            <li>Initial response within 24-48 hours</li>
            <li>Personalized attention to your inquiry</li>
            <li>Professional guidance for your music needs</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul style="color: #4b5563;">
          <li>Browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/store" style="color: #0ea5e9; text-decoration: none;">beat store</a></li>
          <li>Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/portfolio" style="color: #0ea5e9; text-decoration: none;">portfolio</a></li>
          <li>Follow us on social media for updates</li>
        </ul>
        
        <p>If your matter is urgent, you can also reach us at:</p>
        <ul style="color: #4b5563;">
          <li>Phone: +1 (555) 123-4567</li>
          <li>Support: support@taktikalbeatz.com</li>
        </ul>
        
        <p style="margin-bottom: 0;">
          Best regards,<br>
          <strong>The Taktikal Beatz Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
        <p>
          Taktikal Beatz &copy; ${new Date().getFullYear()}<br>
          Los Angeles, CA
        </p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280;">Privacy Policy</a> | 
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280;">Terms of Service</a>
        </p>
      </div>
    </div>
  `
  
  await transporter.sendMail({
    from: `"Taktikal Beatz" <${process.env.SMTP_FROM || 'contact@taktikalbeatz.com'}>`,
    to: toEmail,
    subject: 'Thank You for Contacting Taktikal Beatz',
    html: htmlContent,
  })
}