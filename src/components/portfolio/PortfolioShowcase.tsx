'use client'

import { useState } from 'react'
import { Play, Pause, Music, Video, Star } from 'lucide-react'

export default function PortfolioShowcase() {
  const [playingId, setPlayingId] = useState<string | null>(null)

  const portfolioItems = [
    {
      id: '1',
      title: 'Nike Commercial Production',
      type: 'production',
      client: 'Nike',
      year: 2024,
      description: 'Original music composition for global advertising campaign',
      tags: ['commercial', 'advertising', 'brand'],
    },
    {
      id: '2',
      title: 'R&B Album Collaboration',
      type: 'collaboration',
      client: 'Emerging Artist',
      year: 2023,
      description: 'Production and co-writing for upcoming R&B artist debut album',
      tags: ['r&b', 'collaboration', 'album'],
    },
    {
      id: '3',
      title: 'Chart Hit Remix',
      type: 'remix',
      client: 'Major Label',
      year: 2024,
      description: 'Official remix for top 10 charting single',
      tags: ['remix', 'chart', 'dance'],
    },
  ]

  const handlePlayPreview = (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {portfolioItems.map((item) => (
        <div key={item.id} className="card hover:shadow-xl transition-shadow duration-300">
          <div className="relative overflow-hidden rounded-lg mb-4">
            <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              {item.type === 'production' ? (
                <Music className="w-12 h-12 text-white" />
              ) : item.type === 'collaboration' ? (
                <Star className="w-12 h-12 text-white" />
              ) : (
                <Video className="w-12 h-12 text-white" />
              )}
            </div>
            
            <button
              onClick={() => handlePlayPreview(item.id)}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
            >
              {playingId === item.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <div className="flex items-center space-x-2 text-gray-600 text-sm mb-3">
              <span className="capitalize">{item.type}</span>
              <span>•</span>
              <span>{item.client}</span>
              <span>•</span>
              <span>{item.year}</span>
            </div>
            
            <p className="text-gray-600 mb-4">{item.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}