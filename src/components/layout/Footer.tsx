import { Music, Mail, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-500">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-secondary rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold gradient-text">Taktikal Beatz</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional music production services, premium beats, and sound design for artists worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-dark-700 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-black" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-700 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-black" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-700 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                <Youtube className="w-5 h-5 text-gray-400 hover:text-black" />
              </a>
              <a href="#" className="w-10 h-10 bg-dark-700 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-black" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/store" className="text-gray-400 hover:text-accent transition-colors">Beat Store</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link href="/bundles" className="text-gray-400 hover:text-accent transition-colors">Bundles</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-accent transition-colors">Admin</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Custom Beat Production</li>
              <li className="text-gray-400">Mixing & Mastering</li>
              <li className="text-gray-400">Sound Design</li>
              <li className="text-gray-400">Music Licensing</li>
              <li className="text-gray-400">Audio Engineering</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 text-accent" />
                <span>contact@taktikalbeatz.com</span>
              </li>
              <li className="text-gray-400">
                Los Angeles, CA
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dark-500 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Taktikal Beatz. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-accent text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-accent text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/licensing" className="text-gray-500 hover:text-accent text-sm transition-colors">
                Licensing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}