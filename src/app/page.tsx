import Hero from '@/components/layout/Hero'
import FeaturedBeats from '@/components/store/FeaturedBeats'
import PortfolioShowcase from '@/components/portfolio/PortfolioShowcase'
import CTA from '@/components/layout/CTA'
import Testimonials from '@/components/layout/Testimonials'

export default function HomePage() {
  return (
    <div className="space-y-0">
      <Hero />
      
      <section className="py-20 section-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge mb-4">FEATURED</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Latest Beats</h2>
            <p className="text-gray-400 text-lg">Fresh drops ready for your next hit</p>
          </div>
          <FeaturedBeats />
        </div>
      </section>
      
      <section className="py-20 section-grid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge mb-4">WORK</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Recent Productions</h2>
            <p className="text-gray-400 text-lg">Professional productions and collaborations</p>
          </div>
          <PortfolioShowcase />
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge mb-4">SERVICES</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What I Offer</h2>
            <p className="text-gray-400 text-lg">Professional music production services</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Beat Production</h3>
              <p className="text-gray-400">Custom beats tailored to your style and vision</p>
            </div>
            
            <div className="glass-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Mixing & Mastering</h3>
              <p className="text-gray-400">Professional audio engineering for your tracks</p>
            </div>
            
            <div className="glass-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure Licensing</h3>
              <p className="text-gray-400">Clear rights and protections for your music</p>
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      <CTA />
    </div>
  )
}