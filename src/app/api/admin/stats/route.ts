import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    await requireAuth(token, 'admin')
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    
    const [
      totalRevenueResult,
      previousRevenueResult,
      totalOrdersResult,
      previousOrdersResult,
      totalUsersResult,
      previousUsersResult,
      totalBeatsResult,
      previousBeatsResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('amount')
        .eq('status', 'completed'),
      
      supabaseAdmin
        .from('orders')
        .select('amount')
        .eq('status', 'completed')
        .lt('created_at', thirtyDaysAgo.toISOString())
        .gt('created_at', sixtyDaysAgo.toISOString()),
      
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('status', 'completed'),
      
      supabaseAdmin
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('status', 'completed')
        .lt('created_at', thirtyDaysAgo.toISOString())
        .gt('created_at', sixtyDaysAgo.toISOString()),
      
      supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' }),
      
      supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' })
        .lt('created_at', thirtyDaysAgo.toISOString()),
      
      supabaseAdmin
        .from('beats')
        .select('id', { count: 'exact' }),
      
      supabaseAdmin
        .from('beats')
        .select('id', { count: 'exact' })
        .lt('created_at', thirtyDaysAgo.toISOString()),
    ])
    
    const totalRevenue = totalRevenueResult.data?.reduce((sum, order) => sum + order.amount, 0) || 0
    const previousRevenue = previousRevenueResult.data?.reduce((sum, order) => sum + order.amount, 0) || 0
    const totalOrders = totalOrdersResult.count || 0
    const previousOrders = previousOrdersResult.count || 0
    const totalUsers = totalUsersResult.count || 0
    const previousUsers = previousUsersResult.count || 0
    const totalBeats = totalBeatsResult.count || 0
    const previousBeats = previousBeatsResult.count || 0
    
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }
    
    const stats = {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalBeats,
      revenueChange: calculateChange(totalRevenue, previousRevenue),
      ordersChange: calculateChange(totalOrders, previousOrders),
      usersChange: calculateChange(totalUsers, previousUsers),
      beatsChange: calculateChange(totalBeats, previousBeats),
    }
    
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Admin stats error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}