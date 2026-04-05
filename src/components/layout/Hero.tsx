'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, ArrowRight, Headphones, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 section-grid opacity-50" />
      
      <div className="container relative mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full mb-8 animate-float">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-gray-300 text-sm font-medium">Now Accepting New Projects</span>
          </div>
          
          {/* Main Title */}
          <h1 className="hero-title mb-8">
            Premium Beats &<br />
            Music Production
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional music production, custom beats, mixing & mastering services for artists worldwide. 
            Elevate your sound with industry-quality production.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/store" className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2">
              <span>Browse Beats</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="glass px-8 py-4 rounded-xl flex items-center justify-center space-x-3 hover:border-accent transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 text-accent" />
                  <span className="text-white">Pause Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 text-accent" />
                  <span className="text-white">Play Latest Beat</span>
                </>
              )}
            </button>
          </div>
          
          {/* Music Visualizer */}
          <div className="flex justify-center items-end space-x-1 h-16 mb-16">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-accent to-accent-secondary rounded-full music-bar"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.7 + Math.random() * 0.3
                }}
              />
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="stat-card">
              <div className="number">500+</div>
              <div className="text-gray-500 mt-2">Beats Produced</div>
            </div>
            <div className="stat-card">
              <div className="number">150+</div>
              <div className="text-gray-500 mt-2">Happy Clients</div>
            </div>
            <div className="stat-card">
              <div className="number">24/7</div>
              <div className="text-gray-500 mt-2">Support</div>
            </div>
            <div className="stat-card">
              <div className="number">100%</div>
              <div className="text-gray-500 mt-2">Royalty Free</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
    </div>
  )
}