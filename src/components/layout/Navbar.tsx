'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Music, ShoppingBag } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Bundles', href: '/bundles' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold gradient-text">Taktikal Beatz</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-accent transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            
            <Link
              href="/store"
              className="btn-primary flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store</span>
            </Link>
            
            <Link
              href="/admin"
              className="text-gray-400 hover:text-accent transition-colors"
            >
              Login
            </Link>
          </div>
          
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-dark-500">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-accent transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/store"
                className="btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Beats
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}