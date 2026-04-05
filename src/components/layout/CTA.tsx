'use client'

import { useState } from 'react'
import { ArrowRight, Mail, Check } from 'lucide-react'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Sound?</h2>
            <p className="text-white/90 mb-6">
              Join thousands of producers and artists who trust Taktikal Beatz for their music production needs. Get started with our premium beats today.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Professional quality beats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Clear licensing options</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
          
          <div>
            {submitted ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">🎉 Thank You for Subscribing!</h3>
                <p className="text-white/90 mb-6">
                  You'll receive your first newsletter shortly. We'll send you music production tips, new beat announcements, and exclusive offers.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-white hover:text-white/90 underline"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Get Free Beat Updates</h3>
                <p className="text-white/90 mb-6">
                  Subscribe to our newsletter for new beat releases, production tips, and exclusive discounts.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white/70"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 bg-white text-primary-700 hover:bg-white/90 font-semibold py-3 rounded-lg transition-colors"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-primary-700 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Subscribe Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
                
                <p className="text-white/70 text-sm mt-4">
                  By subscribing, you agree to receive emails from Taktikal Beatz. We'll never spam you.
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-4 rounded-lg transition-colors">
                <div className="flex items-center justify-center space-x-2">
                  <span>Browse All Beats</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}