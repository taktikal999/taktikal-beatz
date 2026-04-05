'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, User, Music } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  client_role: string
  client_image: string | null
  content: string
  rating: number
  project_type: string
  is_featured: boolean
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      
      setTestimonials([
        {
          id: '1',
          client_name: 'Alex Johnson',
          client_role: 'Music Producer',
          client_image: null,
          content: 'The beats from Taktikal Beatz are top-notch. Professional quality, great mixing, and perfect for my projects. Highly recommended!',
          rating: 5,
          project_type: 'Beat Production',
          is_featured: true,
        },
        {
          id: '2',
          client_name: 'Sarah Martinez',
          client_role: 'R&B Artist',
          client_image: null,
          content: 'Their custom production services helped me create my debut album. The attention to detail and creative input was exceptional.',
          rating: 5,
          project_type: 'Album Production',
          is_featured: true,
        },
        {
          id: '3',
          client_name: 'Marcus Williams',
          client_role: 'Record Label Owner',
          client_image: null,
          content: 'We\'ve licensed multiple beats for our artists. Quality is consistent, licensing is clear, and the service is professional.',
          rating: 5,
          project_type: 'Beat Licensing',
          is_featured: true,
        },
        {
          id: '4',
          client_name: 'Jasmine Chen',
          client_role: 'Film Composer',
          client_image: null,
          content: 'Used their beats for a commercial project. The stems were perfect for my needs, and the commercial license was straightforward.',
          rating: 5,
          project_type: 'Commercial Music',
          is_featured: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
        <p className="text-gray-600 mb-8">What our clients say about our work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                {testimonial.client_image ? (
                  <img
                    src={testimonial.client_image}
                    alt={testimonial.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div className="ml-4">
                <h4 className="font-semibold">{testimonial.client_name}</h4>
                <p className="text-sm text-gray-600">{testimonial.client_role}</p>
                <div className="flex mt-2">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">{testimonial.content}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Music className="w-4 h-4 mr-2" />
                <span>{testimonial.project_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p8 md:p12">
        <div className="flex items-center justify-center mb6">
          <div className="inline-flex items-center space-x-2 bg-white text-primary-700 px-4 py-2 rounded-full shadow-sm">
            <Quote className="w-5 h-5" />
            <span className="font-medium">Trusted by Artists Worldwide</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb2">150+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb2">500+</div>
            <div className="text-gray-600">Beats Produced</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb2">99%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}