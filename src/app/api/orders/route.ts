import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
import { sanitizeObject, getClientIP, validateEmail } from '@/lib/security'
import { requireAuth } from '@/lib/auth'
import Stripe from 'stripe'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const createOrderSchema = z.object({
  beat_id: z.string().uuid('Invalid beat ID'),
  email: z.string().email('Invalid email address'),
  user_id: z.string().uuid().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const user = await requireAuth(token)
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const status = searchParams.get('status')
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        beats (
          title,
          price,
          preview_url,
          cover_image
        )
      `, { count: 'exact' })
    
    if (user.role === 'user') {
      query = query.eq('user_id', user.id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: orders, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Get orders error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const validationResult = createOrderSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { beat_id, email, user_id } = validationResult.data
    
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    const { data: beat, error: beatError } = await supabase
      .from('beats')
      .select('*')
      .eq('id', beat_id)
      .eq('is_published', true)
      .single()
    
    if (beatError || !beat) {
      return NextResponse.json(
        { error: 'Beat not found or not available' },
        { status: 404 }
      )
    }
    
    const amount = beat.discount_price || beat.price
    const ip = getClientIP(request)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        beat_id,
        beat_title: beat.title,
        email,
        user_id: user_id || 'guest',
        ip_address: ip,
      },
      receipt_email: email,
    })
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        beat_id,
        email,
        user_id: user_id || null,
        amount,
        currency: 'usd',
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      }])
      .select()
      .single()
    
    if (orderError) {
      throw orderError
    }
    
    await supabase.from('purchase_logs').insert({
      order_id: order.id,
      beat_id,
      email,
      amount,
      ip_address: ip,
      action: 'payment_intent_created',
    })
    
    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        client_secret: paymentIntent.client_secret,
        amount,
        beat_title: beat.title,
      },
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const user = await requireAuth(token, 'admin')
    
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }
    
    const validStatuses = ['pending', 'completed', 'failed', 'refunded']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }
    
    const ip = getClientIP(request)
    
    await supabase.from('admin_logs').insert({
      user_id: user.id,
      action: 'update_order_status',
      ip_address: ip,
      details: { order_id: id, new_status: status },
    })
    
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    if (status === 'completed') {
      await supabase
        .from('beats')
        .update({ downloads_count: supabase.rpc('increment', { x: 1 }) })
        .eq('id', order.beat_id)
    }
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    })
  } catch (error: any) {
    console.error('Update order error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}