import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

async function seedDatabase() {
  console.log('Seeding database with initial data...')
  
  try {
    console.log('Creating admin user...')
    const adminPassword = await hashPassword('Admin@1234')
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .insert([{
        email: 'admin@taktikalbeatz.com',
        username: 'admin',
        full_name: 'Taktikal Beatz Admin',
        password_hash: adminPassword,
        role: 'admin',
      }])
      .select()
      .single()
    
    if (adminError && !adminError.message.includes('duplicate key')) {
      throw adminError
    }
    
    console.log('Creating test user...')
    const userPassword = await hashPassword('User@1234')
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .insert([{
        email: 'test@example.com',
        username: 'testuser',
        full_name: 'Test User',
        password_hash: userPassword,
        role: 'user',
      }])
      .select()
      .single()
    
    if (userError && !userError.message.includes('duplicate key')) {
      throw userError
    }
    
    console.log('Creating sample beats...')
    const sampleBeats = [
      {
        title: 'Midnight Groove',
        description: 'Smooth jazz-inspired hip hop beat with atmospheric pads and laid-back drums',
        genre: ['hip-hop', 'jazz', 'lofi'],
        bpm: 85,
        key: 'C minor',
        duration: 185,
        price: 49.99,
        discount_price: 29.99,
        preview_url: 'https://example.com/audio/midnight-groove-preview.mp3',
        audio_url: 'https://example.com/audio/midnight-groove-full.mp3',
        stems_url: 'https://example.com/audio/midnight-groove-stems.zip',
        cover_image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        tags: ['lofi', 'chill', 'atmospheric', 'jazz'],
        is_featured: true,
        is_published: true,
        created_by: adminUser?.id || '00000000-0000-0000-0000-000000000000',
      },
      {
        title: 'Trap Supreme',
        description: 'Hard-hitting trap beat with 808s and aggressive hi-hats',
        genre: ['trap', 'hip-hop', 'drill'],
        bpm: 140,
        key: 'F minor',
        duration: 210,
        price: 79.99,
        preview_url: 'https://example.com/audio/trap-supreme-preview.mp3',
        audio_url: 'https://example.com/audio/trap-supreme-full.mp3',
        stems_url: 'https://example.com/audio/trap-supreme-stems.zip',
        cover_image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b',
        tags: ['trap', 'aggressive', '808', 'bass'],
        is_featured: true,
        is_published: true,
        created_by: adminUser?.id || '00000000-0000-0000-0000-000000000000',
      },
      {
        title: 'Future Bounce',
        description: 'Energetic future bass track with soaring melodies and punchy drums',
        genre: ['future-bass', 'edm', 'electronic'],
        bpm: 128,
        key: 'A major',
        duration: 195,
        price: 89.99,
        discount_price: 59.99,
        preview_url: 'https://example.com/audio/future-bounce-preview.mp3',
        audio_url: 'https://example.com/audio/future-bounce-full.mp3',
        cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
        tags: ['future-bass', 'edm', 'melodic', 'energetic'],
        is_featured: true,
        is_published: true,
        created_by: adminUser?.id || '00000000-0000-0000-0000-000000000000',
      },
    ]
    
    const { error: beatsError } = await supabase
      .from('beats')
      .insert(sampleBeats)
    
    if (beatsError && !beatsError.message.includes('duplicate key')) {
      throw beatsError
    }
    
    console.log('Creating portfolio items...')
    const portfolioItems = [
      {
        title: 'Commercial Production for Nike',
        description: 'Original music composition for global advertising campaign',
        type: 'production',
        client: 'Nike',
        year: 2024,
        audio_url: 'https://example.com/audio/nike-commercial.mp3',
        cover_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        tags: ['commercial', 'advertising', 'brand'],
        is_featured: true,
      },
      {
        title: 'Artist Collaboration - R&B Album',
        description: 'Production and co-writing for upcoming R&B artist debut album',
        type: 'collaboration',
        client: 'Emerging Artist',
        year: 2023,
        audio_url: 'https://example.com/audio/rnb-collab.mp3',
        cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
        tags: ['r&b', 'collaboration', 'album'],
        is_featured: true,
      },
      {
        title: 'Official Remix - Chart Hit',
        description: 'Official remix for top 10 charting single',
        type: 'remix',
        client: 'Major Label',
        year: 2024,
        audio_url: 'https://example.com/audio/remix-chart.mp3',
        video_url: 'https://youtube.com/watch?v=example',
        cover_image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
        tags: ['remix', 'chart', 'dance'],
        is_featured: true,
      },
    ]
    
    const { error: portfolioError } = await supabase
      .from('portfolio_items')
      .insert(portfolioItems)
    
    if (portfolioError && !portfolioError.message.includes('duplicate key')) {
      throw portfolioError
    }
    
    console.log('Database seeding completed successfully!')
    console.log('\nDefault credentials:')
    console.log('Admin: admin@taktikalbeatz.com / Admin@1234')
    console.log('User: test@example.com / User@1234')
    console.log('\nIMPORTANT: Change these passwords immediately!')
    
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()