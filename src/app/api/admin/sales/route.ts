import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    await requireAuth(token, 'admin')
    
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '7d'
    
    let days = 7
    switch (range) {
      case '30d':
        days = 30
        break
      case '90d':
        days = 90
        break
      case '1y':
        days = 365
        break
    }
    
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('amount, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
    
    if (error) {
      throw error
    }
    
    const salesData = generateDateRange(startDate, endDate).map(date => {
      const dateStr = date.toISOString().split('T')[0]
      const dayOrders = orders?.filter(order => 
        order.created_at.split('T')[0] === dateStr
      ) || []
      
      return {
        date: dateStr,
        revenue: dayOrders.reduce((sum, order) => sum + order.amount, 0),
        orders: dayOrders.length,
      }
    })
    
    return NextResponse.json(salesData)
  } catch (error: any) {
    console.error('Admin sales data error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}

function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}