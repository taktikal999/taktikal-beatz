export interface SEOData {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  ogTitle: string
  ogDescription: string
  canonicalUrl: string
  structuredData?: any
}

export function generateSEOData(
  pageType: 'home' | 'beat' | 'store' | 'contact' | 'portfolio',
  pageData?: any
): SEOData {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taktikalbeatz.com'
  
  const templates = {
    home: {
      title: 'Taktikal Beatz - Premium Music Production & Beat Store',
      description: 'Professional music production services, custom beats, mixing & mastering. Download high-quality beats for hip-hop, trap, R&B, and electronic music.',
      keywords: ['music production', 'beats', 'sound design', 'music', 'producer', 'hip-hop', 'trap', 'R&B'],
      ogTitle: 'Taktikal Beatz - Professional Music Production',
      ogDescription: 'Premium beats and music production services for artists worldwide.',
    },
    beat: {
      title: `${pageData?.title || 'Beat'} - Premium Instrumental by Taktikal Beatz`,
      description: `${pageData?.description || 'Download this premium beat'} - High-quality instrumental for your next project. Available for purchase with commercial license.`,
      keywords: [...pageData?.tags || [], 'beat', 'instrumental', 'music', 'download'],
      ogTitle: `${pageData?.title || 'Beat'} by Taktikal Beatz`,
      ogDescription: pageData?.description || 'Professional music production',
    },
    store: {
      title: 'Beat Store - Premium Beats for Purchase & Licensing',
      description: 'Browse our collection of premium beats available for purchase and licensing. Hip-hop, trap, R&B, lofi, electronic, and more.',
      keywords: ['beat store', 'buy beats', 'music licensing', 'instrumentals', 'download beats'],
      ogTitle: 'Beat Store - Taktikal Beatz',
      ogDescription: 'Purchase premium beats for your music projects',
    },
    contact: {
      title: 'Contact Taktikal Beatz - Music Production Services',
      description: 'Get in touch with Taktikal Beatz for custom beat production, mixing & mastering, and music licensing inquiries.',
      keywords: ['contact', 'music production', 'custom beats', 'mixing', 'mastering'],
      ogTitle: 'Contact Taktikal Beatz',
      ogDescription: 'Get professional music production services',
    },
    portfolio: {
      title: 'Portfolio - Music Production Projects & Collaborations',
      description: 'View our portfolio of music production projects, artist collaborations, and commercial work.',
      keywords: ['portfolio', 'music projects', 'collaborations', 'commercial work'],
      ogTitle: 'Portfolio - Taktikal Beatz',
      ogDescription: 'Music production projects and collaborations',
    },
  }
  
  const template = templates[pageType]
  
  return {
    title: template.title,
   description: template.description,
    keywords: template.keywords,
    ogImage: `${baseUrl}/images/og-image.png`,
    ogTitle: template.ogTitle,
    ogDescription: template.ogDescription,
    canonicalUrl: `${baseUrl}/${pageType === 'home' ? '' : pageType}`,
    structuredData: generateStructuredData(pageType, pageData),
  }
}

function generateStructuredData(pageType: string, pageData?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://taktikalbeatz.com'
  
  switch (pageType) {
    case 'home':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Taktikal Beatz',
        url: baseUrl,
        description: 'Premium music production services and beat store',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/store?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    
    case 'beat':
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: pageData?.title,
        description: pageData?.description,
        url: `${baseUrl}/store/${pageData?.id}`,
        genre: pageData?.genre?.join(', '),
        duration: `PT${Math.floor(pageData?.duration / 60)}M${pageData?.duration % 60}S`,
        byArtist: {
          '@type': 'MusicGroup',
          name: 'Taktikal Beatz'
        },
        offers: {
          '@type': 'Offer',
          price: pageData?.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        }
      }
    
    case 'store':
      return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Beat Store',
        description: 'Collection of premium beats',
        url: `${baseUrl}/store`,
        itemListElement: []
      }
    
    default:
      return null
  }
}

export function trackEvent(eventName: string, eventData?: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData)
  }
  
  console.log('Analytics event:', eventName, eventData)
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

export function trackBeatPreview(beatId: string, beatTitle: string) {
  trackEvent('beat_preview', {
    beat_id: beatId,
    beat_title: beatTitle,
  })
}

export function trackBeatPurchase(beatId: string, beatTitle: string, amount: number) {
  trackEvent('beat_purchase', {
    beat_id: beatId,
    beat_title: beatTitle,
    amount,
    currency: 'USD',
  })
}

export function trackSubscriptionSignup(planId: string, planName: string, amount: number) {
  trackEvent('subscription_signup', {
    plan_id: planId,
    plan_name: planName,
    amount,
    currency: 'USD',
    interval: 'monthly',
  })
}

export function trackEmailSignup(source: string) {
  trackEvent('email_signup', {
    source,
    location: window.location.pathname,
  })
}