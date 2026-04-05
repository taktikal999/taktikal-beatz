import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BeatMetadata {
  title: string
  description: string
  genre: string[]
  bpm?: number
  key?: string
  mood?: string[]
  tags: string[]
  license_types: string[]
  seo_description: string
  social_media_captions: {
    instagram: string
    twitter: string
    tiktok: string
  }
}

export interface EmailCampaign {
  subject: string
  body: string
  cta_text: string
  segments: string[]
}

export interface SocialMediaPost {
  platform: 'instagram' | 'twitter' | 'tiktok' | 'youtube'
  caption: string
  hashtags: string[]
  suggested_image_prompt?: string
}

export class AIService {
  static async generateBeatMetadata(beatTitle: string, audioContext?: string): Promise<BeatMetadata> {
    try {
      const prompt = `Generate comprehensive metadata for a music beat titled "${beatTitle}". ${
        audioContext ? `Context: ${audioContext}` : ''
      }

      Provide:
      1. Engaging description (2-3 sentences)
      2. 3-5 relevant genres
      3. Suggested BPM range (if not specified)
      4. Key signature (if not specified)
      5. Mood/atmosphere tags (3-5)
      6. SEO-optimized description (1 sentence)
      7. Social media captions for Instagram, Twitter, and TikTok
      8. Relevant hashtags

      Return as structured JSON.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional music producer and SEO expert. Generate engaging, accurate metadata for music beats.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        title: beatTitle,
        description: result.description || `Premium ${beatTitle} beat available for purchase`,
        genre: result.genres || ['hip-hop'],
        bpm: result.bpm || 120,
        key: result.key || 'C minor',
        mood: result.mood || ['chill', 'energetic'],
        tags: result.tags || [beatTitle.toLowerCase().replace(/\s+/g, '-'), 'beats', 'music'],
        license_types: result.license_types || ['non-exclusive', 'exclusive'],
        seo_description: result.seo_description || `Download ${beatTitle} - professional music production by Taktikal Beatz`,
        social_media_captions: {
          instagram: result.social_media_captions?.instagram || `🔥 New beat drop: ${beatTitle} 🎵 #producer #beatstore`,
          twitter: result.social_media_captions?.twitter || `Just uploaded: ${beatTitle} - check it out! 🎧 #musicproducer`,
          tiktok: result.social_media_captions?.tiktok || `New beat alert! 🚨 ${beatTitle} #fyp #producer`
        }
      }
    } catch (error) {
      console.error('AI metadata generation failed:', error)
      return this.getFallbackMetadata(beatTitle)
    }
  }

  static async generateEmailCampaign(
    campaignType: 'new_beat' | 'newsletter' | 'promotion' | 'abandoned_cart',
    context?: any
  ): Promise<EmailCampaign> {
    try {
      let prompt = ''
      
      switch (campaignType) {
        case 'new_beat':
          prompt = `Write an engaging email announcement for a new beat "${context?.beatTitle}". Include:
          1. Catchy subject line
          2. Engaging body with the beat's features
          3. Call-to-action button text
          4. Target segments (new subscribers, beat buyers, etc.)`
          break
        case 'newsletter':
          prompt = `Create a weekly newsletter email for music producers and artists. Include:
          1. Subject line about music production tips
          2. Body with valuable content
          3. CTA to check new beats
          4. Relevant segments`
          break
        case 'promotion':
          prompt = `Write a promotional email for a ${context?.discount}% discount on beat bundles. Include:
          1. Urgent subject line
          2. Body highlighting benefits
          3. Clear CTA
          4. Target segments`
          break
        case 'abandoned_cart':
          prompt = `Write a cart abandonment email for beats left in cart. Include:
          1. Reminder subject line
          2. Body encouraging purchase
          3. CTA to complete purchase
          4. Maybe offer small discount`
          break
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email copywriter for a music beat store. Write engaging, conversion-focused emails.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        subject: result.subject || 'Check out our latest beats!',
        body: result.body || 'We have new beats waiting for you.',
        cta_text: result.cta_text || 'Listen Now',
        segments: result.segments || ['all_users']
      }
    } catch (error) {
      console.error('AI email generation failed:', error)
      return this.getFallbackEmail(campaignType, context)
    }
  }

  static async generateSocialMediaPosts(
    beatTitle: string,
    platforms: Array<'instagram' | 'twitter' | 'tiktok' | 'youtube'> = ['instagram', 'twitter', 'tiktok']
  ): Promise<SocialMediaPost[]> {
    try {
      const prompt = `Generate social media posts for a beat titled "${beatTitle}" for platforms: ${platforms.join(', ')}.

      For each platform, provide:
      1. Platform-appropriate caption
      2. 5-10 relevant hashtags
      3. For Instagram/TikTok: suggested image/video prompt

      Return as structured JSON array.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a social media manager for a music producer. Create engaging posts for different platforms.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.9,
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      
      return platforms.map(platform => ({
        platform,
        caption: result[platform]?.caption || `New beat: ${beatTitle} 🎵`,
        hashtags: result[platform]?.hashtags || ['#producer', '#beat', '#music'],
        suggested_image_prompt: result[platform]?.image_prompt || 'Music producer in studio with headphones'
      }))
    } catch (error) {
      console.error('AI social media generation failed:', error)
      return this.getFallbackSocialPosts(beatTitle, platforms)
    }
  }

  static async analyzeClientRequest(requestText: string): Promise<{
    genre_suggestions: string[]
    bpm_suggestion: number
    mood_suggestions: string[]
    similar_beats: string[]
    custom_beat_ideas: string[]
  }> {
    try {
      const prompt = `Analyze this custom beat request: "${requestText}"

      Provide:
      1. 3-5 suggested genres
      2. Recommended BPM range
      3. Mood/atmosphere suggestions
      4. Similar existing beats to reference
      5. 3 custom beat ideas based on the request

      Return as structured JSON.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an experienced music producer analyzing client requests. Provide insightful suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })

      return JSON.parse(response.choices[0].message.content || '{}')
    } catch (error) {
      console.error('AI client request analysis failed:', error)
      return {
        genre_suggestions: ['hip-hop', 'trap', 'r&b'],
        bpm_suggestion: 120,
        mood_suggestions: ['chill', 'energetic'],
        similar_beats: [],
        custom_beat_ideas: []
      }
    }
  }

  static async generateSEOContent(
    beatTitle: string,
    keywords: string[] = []
  ): Promise<{
    meta_title: string
    meta_description: string
    og_title: string
    og_description: string
    twitter_card: string
    structured_data: any
  }> {
    try {
      const prompt = `Generate SEO-optimized content for a beat titled "${beatTitle}". Keywords: ${keywords.join(', ') || 'none provided'}

      Provide:
      1. Meta title (50-60 chars)
      2. Meta description (150-160 chars)
      3. Open Graph title
      4. Open Graph description
      5. Twitter card content
      6. JSON-LD structured data for a music product

      Return as structured JSON.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in music e-commerce. Create optimized metadata and structured data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      })

      return JSON.parse(response.choices[0].message.content || '{}')
    } catch (error) {
      console.error('AI SEO generation failed:', error)
      return this.getFallbackSEO(beatTitle)
    }
  }

  private static getFallbackMetadata(beatTitle: string): BeatMetadata {
    return {
      title: beatTitle,
      description: `Premium quality ${beatTitle} beat. Perfect for hip-hop, trap, and R&B artists. Professionally mixed and mastered.`,
      genre: ['hip-hop', 'trap'],
      bpm: 140,
      key: 'C minor',
      mood: ['aggressive', 'dark', 'energetic'],
      tags: [beatTitle.toLowerCase().replace(/\s+/g, '-'), 'beat', 'instrumental', 'hip-hop', 'trap'],
      license_types: ['non-exclusive', 'exclusive'],
      seo_description: `Download ${beatTitle} - professional beat by Taktikal Beatz. High-quality instrumental for your next project.`,
      social_media_captions: {
        instagram: `New beat: ${beatTitle} 🔥 Perfect for your next track! #producer #beatmaker #hiphop`,
        twitter: `Just dropped: ${beatTitle} 🎧 Check it out! #musicproducer #beatstore`,
        tiktok: `🎵 ${beatTitle} #fyp #producer #beat`
      }
    }
  }

  private static getFallbackEmail(campaignType: string, context?: any): EmailCampaign {
    const templates = {
      new_beat: {
        subject: `🔥 New Beat: ${context?.beatTitle || 'Just Added!'}`,
        body: `We just uploaded "${context?.beatTitle || 'a new beat'}" to our store. Check it out and see if it's the perfect fit for your next project!`,
        cta_text: 'Listen Now',
        segments: ['all_users']
      },
      newsletter: {
        subject: '🎵 Music Production Tips & New Beats',
        body: 'This week we\'re sharing production tips and highlighting our latest beats. Perfect for your creative process!',
        cta_text: 'Read More',
        segments: ['subscribers']
      },
      promotion: {
        subject: `🎁 ${context?.discount || '20'}% OFF Beat Bundles!`,
        body: `Limited time offer! Get ${context?.discount || '20'}% off all beat bundles. Stock up on quality beats for your projects.`,
        cta_text: 'Shop Now',
        segments: ['all_users']
      },
      abandoned_cart: {
        subject: '👀 Did you forget something?',
        body: 'You left some beats in your cart. Complete your purchase to get instant access to your downloads!',
        cta_text: 'Complete Purchase',
        segments: ['cart_abandoners']
      }
    }

    return templates[campaignType as keyof typeof templates] || templates.newsletter
  }

  private static getFallbackSocialPosts(beatTitle: string, platforms: string[]): SocialMediaPost[] {
    return platforms.map(platform => ({
      platform: platform as any,
      caption: `New beat alert: ${beatTitle} 🎵`,
      hashtags: ['#producer', '#beat', '#music', '#taktikalbeatz'],
      suggested_image_prompt: 'Studio headphones on mixing console'
    }))
  }

  private static getFallbackSEO(beatTitle: string) {
    return {
      meta_title: `${beatTitle} - Premium Beat by Taktikal Beatz`,
      meta_description: `Download ${beatTitle} professional beat. High-quality instrumental for hip-hop, trap, and R&B. Royalty-free licenses available.`,
      og_title: `${beatTitle} by Taktikal Beatz`,
      og_description: 'Professional music production and beats for artists worldwide.',
      twitter_card: `Check out ${beatTitle} by Taktikal Beatz`,
      structured_data: {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: beatTitle,
        description: `Professional beat: ${beatTitle}`,
        genre: 'Hip-Hop',
        duration: 'PT3M',
        license: 'https://taktikalbeatz.com/licensing'
      }
    }
  }
}