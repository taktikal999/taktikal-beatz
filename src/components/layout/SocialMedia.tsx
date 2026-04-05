'use client'

import { useState } from 'react'
import { Share2, Instagram, Twitter, Youtube, Facebook, Mail } from 'lucide-react'

interface SocialMediaProps {
  beatTitle?: string
  beatUrl?: string
  beatImage?: string
}

export default function SocialMedia({ beatTitle, beatUrl, beatImage }: SocialMediaProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const shareToSocialMedia = (platform: string) => {
    const shareText = beatTitle 
      ? `Check out ${beatTitle} by Taktikal Beatz 🎵`
      : 'Check out Taktikal Beatz - Premium Music Production 🎵'
    
    const shareUrl = beatUrl || window.location.href
    
    const platforms: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/?text=${encodeURIComponent(shareText)}`, // Note: Instagram doesn't have direct share URLs
    }
    
    if (platforms[platform]) {
      window.open(platforms[platform], '_blank')
    }
  }

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: beatTitle || 'Taktikal Beatz',
        text: beatTitle ? `Check out ${beatTitle} by Taktikal Beatz` : 'Premium music production services',
        url: beatUrl || window.location.href,
      })
    } else {
      setShowShareMenu(true)
    }
  }

  const socialLinks = [
    {
      platform: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/taktikalbeatz',
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'hover:bg-pink-50',
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/taktikalbeatz',
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50',
    },
    {
      platform: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/taktikalbeatz',
      color: 'text-red-600 hover:text-red700',
      bgColor: 'hover:bg-red-50',
    },
    {
      platform: 'TikTok',
      icon: Share2,
      url: 'https://tiktok.com/@taktikalbeatz',
      color: 'text-black hover:text-gray-800',
      bgColor: 'hover:bg-gray-50',
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/taktikalbeatz',
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'hover:bg-blue-50',
    },
  ]

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
      
      {socialLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 ${link.color} ${link.bgColor} rounded-lg transition-colors`}
          title={link.platform}
        >
          <link.icon className="w-5 h-5" />
        </a>
      ))}
      
      {showShareMenu && (
        <div className="fixed inset0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p6 max-w-sm">
            <h3 className="text-lg font-semibold mb4">Share Options</h3>
            <div className="space-y-3">
              <button
                onClick={() => shareToSocialMedia('twitter')}
                className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg"
              >
                <Twitter className="w-5 h-5 text-blue-600" />
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => shareToSocialMedia('facebook')}
                className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg"
              >
                <Facebook className="w-5 h-5 text-blue-700" />
                <span>Share on Facebook</span>
              </button>
              <button
                onClick={() => {
                  const text = beatTitle 
                    ? `Check out ${beatTitle} by Taktikal Beatz 🎵`
                    : 'Check out Taktikal Beatz 🎵'
                  window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(window.location.href)}`)
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <Mail className="w-5 h-5 text-gray600" />
                <span>Share via Email</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareMenu(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}