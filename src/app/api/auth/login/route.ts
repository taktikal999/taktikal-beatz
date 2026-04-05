import { NextRequest, NextResponse } from 'next/server'
import { login, validatePassword } from '@/lib/auth'
import { sanitizeObject, getClientIP, getClientUserAgent } from '@/lib/security'
import { supabaseAdmin } from '@/lib/database'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const validationResult = loginSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { email, password } = validationResult.data
    
    const ip = getClientIP(request)
    const userAgent = getClientUserAgent(request)
    
    await supabaseAdmin.from('auth_logs').insert({
      email,
      action: 'login_attempt',
      ip_address: ip,
      user_agent: userAgent,
      success: false,
    })
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid password format', details: passwordValidation.errors },
        { status: 400 }
      )
    }
    
    try {
      const { token, user } = await login({ email, password })
      
      await supabaseAdmin.from('auth_logs').insert({
        email,
        action: 'login_success',
        ip_address: ip,
        user_agent: userAgent,
        success: true,
      })
      
      const response = NextResponse.json({
        success: true,
        token,
        user,
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
      await supabaseAdmin.from('auth_logs').insert({
        email,
        action: 'login_failed',
        ip_address: ip,
        user_agent: userAgent,
        success: false,
        error_message: error.message,
      })
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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