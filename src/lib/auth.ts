import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabase, supabaseAdmin } from './database'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface UserPayload {
  id: string
  email: string
  role: 'user' | 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  username?: string
  fullName?: string
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'taktikal-beatz',
  })
}

export function verifyToken(token: string): UserPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (error) {
    throw new AuthError('Invalid or expired token')
  }
}

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: UserPayload }> {
  const { email, password } = credentials
  
  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  
  if (error || !userData) {
    throw new AuthError('Invalid email or password')
  }
  
  const isValid = await verifyPassword(password, userData.password_hash)
  if (!isValid) {
    throw new AuthError('Invalid email or password')
  }
  
  await supabaseAdmin
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userData.id)
  
  const payload: UserPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  }
  
  const token = generateToken(payload)
  
  return { token, user: payload }
}

export async function register(data: RegisterData): Promise<{ token: string; user: UserPayload }> {
  const { email, password, username, fullName } = data
  
  const existingUser = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()
  
  if (!existingUser.error) {
    throw new AuthError('User already exists')
  }
  
  const passwordHash = await hashPassword(password)
  
  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      username: username || null,
      full_name: fullName || null,
      role: 'user',
    })
    .select()
    .single()
  
  if (error) {
    throw new AuthError('Failed to create user')
  }
  
  const payload: UserPayload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  }
  
  const token = generateToken(payload)
  
  return { token, user: payload }
}

export async function requireAuth(token: string | undefined, requiredRole?: 'admin'): Promise<UserPayload> {
  if (!token) {
    throw new AuthError('Authentication required')
  }
  
  const payload = verifyToken(token)
  
  if (requiredRole && payload.role !== requiredRole) {
    throw new AuthError('Insufficient permissions')
  }
  
  return payload
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}