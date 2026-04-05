'use client'

import { useState, useEffect } from 'react'
import { Package, Check, Star, Users, Zap, Crown, ShoppingBag, Play, Pause } from 'lucide-react'
import AudioPlayer from '@/components/store/AudioPlayer'

interface Bundle {
  id: string
  name: string
  description: string
  beats: number
  price: number
  discount_price?: number
  features: string[]
  popular: boolean
}

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: string
  features: string[]
  recommended: boolean
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([
    {
      id: 'trap-bundle',
      name: 'Trap Essentials Bundle',
      description: '10 hard-hitting trap beats with 808s and aggressive hi-hats',
      beats: 10,
      price: 299.99,
      discount_price: 199.99,
      features: [
        '10 exclusive trap beats',
        'WAV + MP3 formats',
        'Stems included',
        'Commercial license',
        'Lifetime updates'
      ],
      popular: true,
    },
    {
      id: 'lofi-bundle',
      name: 'Lofi Chill Bundle',
      description: '15 smooth lofi beats perfect for studying or relaxing',
      beats: 15,
      price: 249.99,
      discount_price: 179.99,
      features: [
        '15 lofi beats',
        'WAV + MP3 formats',
        'Bonus ambient sounds',
        'Commercial license',
        'Unlimited downloads'
      ],
      popular: false,
    },
    {
      id: 'rnb-bundle',
      name: 'R&B Grooves Bundle',
      description: '12 soulful R&B beats with smooth melodies and vocals',
      beats: 12,
      price: 279.99,
      discount_price: 189.99,
      features: [
        '12 R&B beats',
        'WAV + MP3 formats',
        'Vocal samples included',
        'Commercial license',
        'Priority support'
      ],
      popular: false,
    },
    {
      id: 'producer-pack',
      name: 'Producer Mega Pack',
      description: '50+ beats across all genres for serious producers',
      beats: 50,
      price: 899.99,
      discount_price: 599.99,
      features: [
        '50+ multi-genre beats',
        'WAV + MP3 + Stems',
        'Exclusive rights available',
        'Commercial license',
        '1-year free updates',
        'Priority support'
      ],
      popular: true,
    },
  ])

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'monthly-basic',
      name: 'Basic Producer',
      description: 'Perfect for hobbyists and beginners',
      price: 19.99,
      interval: 'month',
      features: [
        '5 exclusive beats per month',
        'Basic license for personal use',
        'MP3 downloads',
        'Email support',
        'Cancel anytime'
      ],
      recommended: false,
    },
    {
      id: 'monthly-pro',
      name: 'Pro Producer',
      description: 'For serious producers and artists',
      price: 49.99,
      interval: 'month',
      features: [
        'Unlimited exclusive beats',
        'Commercial license included',
        'WAV + MP3 downloads',
        'Stems available',
        'Priority support',
        'Early access to new beats',
        'Cancel anytime'
      ],
      recommended: true,
    },
    {
      id: 'yearly-pro',
      name: 'Pro Producer (Yearly)',
      description: 'Best value for dedicated producers',
      price: 499.99,
      interval: 'year',
      features: [
        'Unlimited exclusive beats',
        'Commercial license included',
        'WAV + MP3 downloads',
        'Stems available',
        'Priority support',
        'Early access to new beats',
        '2 months free',
        'Cancel anytime'
      ],
      recommended: false,
    },
  ])

  const [activeBundleAudio, setActiveBundleAudio] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleBundlePurchase = (bundleId: string) => {
    console.log('Purchasing bundle:', bundleId)
  }

  const handleSubscriptionPurchase = (planId: string) => {
    console.log('Subscribing to plan:', planId)
  }

  const calculateSavings = (original: number, discounted: number) => {
    return Math.round(((original - discounted) / original) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Beat Bundles & Subscriptions</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Get more value with our beat bundles and subscription plans. Perfect for producers 
          who need consistent, high-quality beats for their projects.
        </p>
      </div>

      <div className="mb-20">
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full">
            <Package className="w-5 h-5" />
            <span className="font-medium">Beat Bundles</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bundles.map((bundle) => (
            <div 
              key={bundle.id} 
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                bundle.popular 
                  ? 'border-primary-500 shadow-xl' 
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {bundle.popular && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  MOST POPULAR
                </div>
              )}
              
              {bundle.discount_price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {calculateSavings(bundle.price, bundle.discount_price)}% OFF
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{bundle.name}</h3>
                    <p className="text-sm text-gray-600">{bundle.beats} beats</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{bundle.description}</p>

                <div className="space-y-3 mb-6">
                  {bundle.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-2">
                    {bundle.discount_price ? (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(bundle.discount_price)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(bundle.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(bundle.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">One-time payment</p>
                </div>

                <button
                  onClick={() => handleBundlePurchase(bundle.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    bundle.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Purchase Bundle</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveBundleAudio(bundle.id === activeBundleAudio ? null : bundle.id)}
                  className="w-full mt-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {activeBundleAudio === bundle.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Preview Bundle</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
            <Crown className="w-5 h-5" />
            <span className="font-medium">Subscription Plans</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                plan.recommended 
                  ? 'border-purple-500 shadow-xl bg-gradient-to-b from-white to-purple-50' 
                  : 'border-gray-200 shadow-lg bg-white'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  RECOMMENDED
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Billed {plan.interval}ly</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${
                        plan.recommended ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Check className={`w-4 h-4 ${
                          plan.recommended ? 'text-purple-600' : 'text-green-600'
                        }`} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscriptionPurchase(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.recommended
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Subscribe Now</span>
                  </div>
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  {plan.interval === 'year' ? 'Save 17% compared to monthly' : 'No commitment'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 md:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Bundles & Subscriptions?</h2>
          <p className="text-gray-600 mb-8">
            Get the best value for your music production needs with our carefully curated bundles 
            and flexible subscription plans.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Cost Effective</h3>
              <p className="text-gray-600 text-sm">
                Save up to 50% compared to individual purchases
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Consistent Quality</h3>
              <p className="text-gray-600 text-sm">
                All beats are professionally mixed and mastered
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Licensing</h3>
              <p className="text-gray-600 text-sm">
                Commercial licenses included with most plans
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <details className="group bg-white rounded-lg p-4">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium">Can I cancel my subscription anytime?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access 
                  until the end of your billing period.
                </p>
              </details>
              
              <details className="group bg-white rounded-lg p-4">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium">Do bundle purchases include stems?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">
                  Most bundles include stems, and it's clearly indicated in the bundle features. 
                  Check the specific bundle details for stem availability.
                </p>
              </details>
              
              <details className="group bg-white rounded-lg p-4">
                <summary className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium">Can I upgrade or downgrade my subscription?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-gray-600">
                  Yes, you can change your subscription plan at any time. The changes will take 
                  effect at the start of your next billing cycle.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}