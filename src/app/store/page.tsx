'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Play, Pause, ShoppingBag, Heart, Clock, Music, ChevronLeft, ChevronRight } from 'lucide-react'

interface Beat {
  id: string
  title: string
  description: string
  genre: string[]
  bpm: number
  key: string
  duration: number
  price: number
  discount_price: number | null
  preview_url: string
  cover_image: string | null
  tags: string[]
  likes_count: number
  created_at: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const genres = [
  'hip-hop', 'trap', 'r&b', 'pop', 'lofi', 'jazz', 'electronic', 'dance', 'rock', 'alternative'
]

const bpmRanges = [
  { label: 'Slow (60-80)', min: 60, max: 80 },
  { label: 'Medium (80-120)', min: 80, max: 120 },
  { label: 'Fast (120-140)', min: 120, max: 140 },
  { label: 'Very Fast (140+)', min: 140, max: 240 },
]

const sortOptions = [
  { label: 'Newest', value: 'created_at' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'downloads_desc' },
  { label: 'Featured', value: 'featured' },
]

export default function StorePage() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [bpmRange, setBpmRange] = useState<{ min: number; max: number } | null>(null)
  const [sortBy, setSortBy] = useState('created_at')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  })

  const fetchBeats = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sortBy === 'price_asc' ? 'price' : 
                sortBy === 'price_desc' ? 'price' : 
                sortBy === 'downloads_desc' ? 'downloads_count' : 'created_at',
        sortOrder: sortBy === 'price_asc' ? 'asc' : 
                   sortBy === 'price_desc' ? 'desc' : 'desc',
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (selectedGenres.length > 0) {
        selectedGenres.forEach(genre => params.append('genre', genre))
      }

      if (bpmRange) {
        params.append('minBpm', bpmRange.min.toString())
        params.append('maxBpm', bpmRange.max.toString())
      }

      if (sortBy === 'featured') {
        params.append('featured', 'true')
      }

      const response = await fetch(`/api/beats?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setBeats(data.data)
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch beats:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedGenres, bpmRange, sortBy, pagination.page, pagination.limit])

  useEffect(() => {
    fetchBeats()
  }, [fetchBeats])

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleBpmRangeSelect = (range: { min: number; max: number } | null) => {
    setBpmRange(range)
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handlePlayPreview = (beatId: string) => {
    if (playingId === beatId) {
      setPlayingId(null)
    } else {
      setPlayingId(beatId)
    }
  }

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

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenres([])
    setBpmRange(null)
    setSortBy('created_at')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Beat Store</h1>
        <p className="text-gray-600 text-lg">
          Browse our collection of premium beats available for purchase and licensing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search beats..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Genre</h3>
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <label key={genre} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">BPM Range</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleBpmRangeSelect(null)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${!bpmRange ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-50'}`}
                    >
                      All BPMs
                    </button>
                    {bpmRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => handleBpmRangeSelect(range)}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${bpmRange?.min === range.min ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-50'}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Have questions about licensing or custom production? Our team is here to help.
              </p>
              <button className="w-full btn-primary">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : beats.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No beats found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beats.map((beat) => (
                  <div key={beat.id} className="group card hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      {beat.cover_image ? (
                        <img
                          src={beat.cover_image}
                          alt={beat.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <Music className="w-12 h-12 text-white" />
                        </div>
                      )}
                      
                      <button
                        onClick={() => handlePlayPreview(beat.id)}
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
                      >
                        {playingId === beat.id ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </button>
                      
                      {beat.discount_price && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          SALE
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{beat.title}</h3>
                          <div className="flex items-center space-x-2 text-gray-600 text-sm mt-1">
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
                        
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {beat.genre.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full capitalize"
                          >
                            {genre}
                          </span>
                        ))}
                        {beat.genre.length > 2 && (
                          <span className="text-gray-500 text-xs">+{beat.genre.length - 2}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          {beat.discount_price ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(beat.discount_price)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(beat.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(beat.price)}
                            </span>
                          )}
                        </div>
                        
                        <button className="flex items-center space-x-2 btn-primary text-sm px-4 py-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg ${pagination.page === pageNum ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}