'use client'

import { useState } from 'react'
import { Play, Pause, ShoppingBag, Heart, Clock, Music } from 'lucide-react'

const mockBeats = [
  {
    id: '1',
    title: 'Midnight Groove',
    description: 'Smooth jazz-inspired hip hop beat with atmospheric pads',
    genre: ['lofi', 'jazz', 'chill'],
    bpm: 85,
    key: 'C minor',
    duration: 185,
    price: 49.99,
    discount_price: 29.99,
    cover_image: null,
    likes_count: 124,
  },
  {
    id: '2',
    title: 'Trap Supreme',
    description: 'Hard-hitting trap beat with 808s and aggressive hi-hats',
    genre: ['trap', 'hip-hop', 'drill'],
    bpm: 140,
    key: 'F minor',
    duration: 210,
    price: 79.99,
    discount_price: null,
    cover_image: null,
    likes_count: 89,
  },
  {
    id: '3',
    title: 'Future Bounce',
    description: 'Energetic future bass track with soaring melodies',
    genre: ['future-bass', 'edm', 'electronic'],
    bpm: 128,
    key: 'A major',
    duration: 195,
    price: 89.99,
    discount_price: 59.99,
    cover_image: null,
    likes_count: 156,
  },
]

export default function FeaturedBeats() {
  const [playingId, setPlayingId] = useState<string | null>(null)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {mockBeats.map((beat) => (
        <div key={beat.id} className="glass-card group overflow-hidden">
          {/* Cover Image */}
          <div className="relative overflow-hidden rounded-xl mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-dark-700 via-dark-600 to-dark-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <div className="text-center">
                <Music className="w-16 h-16 text-accent mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Audio Preview</p>
              </div>
            </div>
            
            {/* Play Button */}
            <button
              onClick={() => setPlayingId(playingId === beat.id ? null : beat.id)}
              className="absolute bottom-4 right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
            >
              {playingId === beat.id ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-1" />
              )}
            </button>
            
            {/* Sale Badge */}
            {beat.discount_price && (
              <div className="absolute top-4 left-4 badge bg-accent-secondary">
                SALE
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                  {beat.title}
                </h3>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
                  <span>{beat.bpm} BPM</span>
                  <span>•</span>
                  <span>{beat.key}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(beat.duration)}
                  </span>
                </div>
              </div>
              
              <button className="text-gray-500 hover:text-accent-secondary transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2">
              {beat.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {beat.genre.map((g) => (
                <span key={g} className="tag">
                  {g}
                </span>
              ))}
            </div>
            
            {/* Price & Buy */}
            <div className="flex justify-between items-center pt-4 border-t border-dark-500">
              <div>
                {beat.discount_price ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold gradient-text">
                      {formatPrice(beat.discount_price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(beat.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold gradient-text">
                    {formatPrice(beat.price)}
                  </span>
                )}
              </div>
              
              <button className="btn-primary flex items-center space-x-2 text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}