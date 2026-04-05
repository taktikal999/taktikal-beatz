import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/database'
import { sanitizeObject, getClientIP } from '@/lib/security'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const beatSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  bpm: z.number().min(60).max(240),
  key: z.string().min(1, 'Key is required'),
  duration: z.number().min(30).max(600),
  price: z.number().min(0),
  discount_price: z.number().min(0).optional().nullable(),
  preview_url: z.string().url('Preview URL must be valid'),
  audio_url: z.string().url('Audio URL must be valid'),
  stems_url: z.string().url().optional().nullable(),
  cover_image: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const genre = searchParams.get('genre')
    const minBpm = searchParams.get('minBpm')
    const maxBpm = searchParams.get('maxBpm')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured')
    const published = searchParams.get('published') || 'true'
    
    let query = supabase
      .from('beats')
      .select('*', { count: 'exact' })
    
    if (genre) {
      query = query.contains('genre', [genre])
    }
    
    if (minBpm) {
      query = query.gte('bpm', parseInt(minBpm))
    }
    
    if (maxBpm) {
      query = query.lte('bpm', parseInt(maxBpm))
    }
    
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    
    if (published === 'true') {
      query = query.eq('is_published', true)
    }
    
    const { data: beats, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: beats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error: any) {
    console.error('Get beats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const user = await requireAuth(token, 'admin')
    
    const body = await request.json()
    const sanitizedBody = sanitizeObject(body)
    
    const validationResult = beatSchema.safeParse(sanitizedBody)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const beatData = {
      ...validationResult.data,
      created_by: user.id,
      downloads_count: 0,
      likes_count: 0,
    }
    
    const ip = getClientIP(request)
    
    await supabase.from('admin_logs').insert({
      user_id: user.id,
      action: 'create_beat',
      ip_address: ip,
      details: { beat_title: beatData.title },
    })
    
    const { data: beat, error } = await supabase
      .from('beats')
      .insert([beatData])
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: beat,
      message: 'Beat created successfully',
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create beat error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create beat' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const user = await requireAuth(token, 'admin')
    
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Beat ID is required' },
        { status: 400 }
      )
    }
    
    const sanitizedData = sanitizeObject(updateData)
    
    const ip = getClientIP(request)
    
    await supabase.from('admin_logs').insert({
      user_id: user.id,
      action: 'update_beat',
      ip_address: ip,
      details: { beat_id: id, updates: Object.keys(sanitizedData) },
    })
    
    const { data: beat, error } = await supabase
      .from('beats')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      data: beat,
      message: 'Beat updated successfully',
    })
  } catch (error: any) {
    console.error('Update beat error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update beat' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    const user = await requireAuth(token, 'admin')
    
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Beat ID is required' },
        { status: 400 }
      )
    }
    
    const ip = getClientIP(request)
    
    await supabase.from('admin_logs').insert({
      user_id: user.id,
      action: 'delete_beat',
      ip_address: ip,
      details: { beat_id: id },
    })
    
    const { error } = await supabase
      .from('beats')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Beat deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete beat error:', error)
    
    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete beat' },
      { status: 500 }
    )
  }
}