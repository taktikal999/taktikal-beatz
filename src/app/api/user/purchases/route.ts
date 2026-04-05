import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, AuthError } from '@/lib/auth'
import { supabase } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const payload = verifyToken(token)
    
    const { data: purchases, error } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        download_url,
        beats (
          title
        )
      `)
      .eq('user_id', payload.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    const formattedPurchases = purchases?.map(purchase => ({
      id: purchase.id,
      beat_title: (purchase.beats as any)?.[0]?.title || 'Unknown Beat',
      amount: purchase.amount,
      status: purchase.status,
      created_at: purchase.created_at,
      download_url: purchase.download_url,
    })) || []
    
    return NextResponse.json(formattedPurchases)
  } catch (error: any) {
    console.error('Get purchases error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    )
  }
}