import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      beats: {
        Row: {
          id: string
          title: string
          description: string | null
          genre: string[]
          bpm: number
          key: string
          duration: number
          price: number
          discount_price: number | null
          preview_url: string
          audio_url: string
          stems_url: string | null
          cover_image: string | null
          tags: string[]
          is_featured: boolean
          is_published: boolean
          downloads_count: number
          likes_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          genre: string[]
          bpm: number
          key: string
          duration: number
          price: number
          discount_price?: number | null
          preview_url: string
          audio_url: string
          stems_url?: string | null
          cover_image?: string | null
          tags?: string[]
          is_featured?: boolean
          is_published?: boolean
          downloads_count?: number
          likes_count?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          genre?: string[]
          bpm?: number
          key?: string
          duration?: number
          price?: number
          discount_price?: number | null
          preview_url?: string
          audio_url?: string
          stems_url?: string | null
          cover_image?: string | null
          tags?: string[]
          is_featured?: boolean
          is_published?: boolean
          downloads_count?: number
          likes_count?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          email: string
          beat_id: string
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          download_url: string | null
          download_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          beat_id: string
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          download_url?: string | null
          download_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          beat_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          download_url?: string | null
          download_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'beat' | 'production' | 'collaboration' | 'remix'
          client: string | null
          year: number
          audio_url: string | null
          video_url: string | null
          cover_image: string | null
          tags: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'beat' | 'production' | 'collaboration' | 'remix'
          client?: string | null
          year: number
          audio_url?: string | null
          video_url?: string | null
          cover_image?: string | null
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'beat' | 'production' | 'collaboration' | 'remix'
          client?: string | null
          year?: number
          audio_url?: string | null
          video_url?: string | null
          cover_image?: string | null
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'unread' | 'read' | 'replied' | 'archived'
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'unread' | 'read' | 'replied' | 'archived'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}