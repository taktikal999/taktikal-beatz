import { NextRequest, NextResponse } from 'next/server'
import { register, validatePassword } from '@/lib/auth'
import { sanitizeObject, getClientIP, getClientUserAgent, validateEmail } from '@/lib/security'
import { supabaseAdmin } from '@/lib/database'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const validationResult = registerSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { email, password, username, fullName } = validationResult.data
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Weak password', details: passwordValidation.errors },
        { status: 400 }
      )
    }
    
    const ip = getClientIP(request)
    const userAgent = getClientUserAgent(request)
    
    try {
      const { token, user } = await register({
        email,
        password,
        username,
        fullName,
      })
      
      await supabaseAdmin.from('auth_logs').insert({
        email,
        action: 'register_success',
        ip_address: ip,
        user_agent: userAgent,
        success: true,
      })
      
      const response = NextResponse.json({
        success: true,
        token,
        user,
        message: 'Registration successful',
      })
      
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
      
      return response
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      
      await supabaseAdmin.from('auth_logs').insert({
        email,
        action: 'register_failed',
        ip_address: ip,
        user_agent: userAgent,
        success: false,
        error_message: error.message,
      })
      
      throw error
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}