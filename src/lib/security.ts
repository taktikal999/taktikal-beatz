import { NextRequest, NextResponse } from 'next/server'
import rateLimit from 'express-rate-limit'
import { createHash } from 'crypto'

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') 
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key])
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key])
    }
  }
  
  return sanitized
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function generateCSRFToken(): string {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('hex')
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken
}

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function getClientUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown'
}

export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, 
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp3', '.wav']
  } = options
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
    }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (extension && !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`
    }
  }
  
  return { valid: true }
}

export function sanitizeSQL(input: string): string {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
    'TRUNCATE', 'EXEC', 'EXECUTE', 'UNION', 'OR', 'AND', 'WHERE',
    'FROM', 'TABLE', 'DATABASE', 'SCHEMA', 'INFORMATION_SCHEMA'
  ]
  
  let sanitized = input
  sqlKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })
  
  sanitized = sanitized.replace(/'/g, "''")
  sanitized = sanitized.replace(/;/g, '')
  
  return sanitized
}

export function generateSecureFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const hash = createHash('sha256')
    .update(originalName + timestamp + random)
    .digest('hex')
    .substring(0, 16)
  
  const extension = originalName.split('.').pop() || ''
  return `${hash}.${extension}`
}

export function enforceHTTPS(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto')
    if (proto && proto !== 'https') {
      const secureUrl = request.nextUrl.clone()
      secureUrl.protocol = 'https:'
      return NextResponse.redirect(secureUrl.toString(), 301)
    }
  }
  return null
}