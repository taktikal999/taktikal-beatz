# Taktikal Beatz - Premium Music Producer Website & Store

A fully featured, modern music producer website and e-commerce platform built with Next.js 14, React, Tailwind CSS, and Supabase PostgreSQL. Includes AI-powered features, subscription systems, admin dashboard, and comprehensive security.

## Features

### 🎵 Frontend (User-Facing)
- **Homepage**: Hero banner, featured beats carousel, services showcase
- **Beat Store**: Search/filter by genre, BPM, mood; beat preview player
- **Audio Player**: Advanced player with waveform, volume control, loop, share
- **User Accounts**: Dashboard with purchase history, downloads, favorites
- **Subscription Plans**: Monthly/yearly plans with unlimited beats
- **Beat Bundles**: Discounted bundles across genres
- **Contact Form**: Custom beat requests with AI analysis
- **Testimonials**: Client reviews and social proof
- **Newsletter**: Email capture with incentives
- **SEO Optimized**: Metadata, structured data, analytics tracking
- **Social Media**: Integration with Instagram, Twitter, TikTok, YouTube

### ⚡ Backend (Admin Panel)
- **Beat Management**: Upload beats with AI-generated metadata
- **Order Management**: View transactions, track downloads
- **Email Marketing**: AI-assisted campaigns, audience segmentation
- **Subscription Management**: Track recurring payments, deliver content
- **Analytics Dashboard**: Sales metrics, traffic overview, top-selling beats
- **User Management**: Admin can manage accounts, view purchase history
- **Content Management**: Update homepage sections, banners, media
- **Security Controls**: Role-based access, activity monitoring

### 🤖 AI Integrations
- **Beat Metadata**: Auto-generate SEO-friendly descriptions and tags
- **Email Campaigns**: AI-assisted content generation and scheduling
- **Social Media**: Auto-generate captions and posts for new beats
- **SEO Optimization**: AI-generated metadata and structured data
- **Client Analysis**: Suggest custom beat ideas based on requests

### 🔒 Security Features
- **JWT Authentication**: Secure token-based auth with bcrypt
- **Input Sanitization**: Prevent XSS and SQL injection
- **Rate Limiting**: Protect against brute force attacks
- **HTTPS Enforcement**: Site-wide HTTPS via Vercel
- **Password Security**: Strong password validation, optional 2FA
- **Database Security**: PostgreSQL with Supabase, encrypted backups

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React H5 Audio Player** for audio
- **Recharts** for analytics charts

### Backend
- **Next.js API Routes** (serverless)
- **Supabase/PostgreSQL** database
- **Stripe** for payments & subscriptions
- **OpenAI API** for AI integrations
- **Nodemailer** for email automation
- **JSON Web Tokens** for auth

### Infrastructure
- **Vercel** for hosting
- **Supabase Storage** for beat files
- **Cloudflare** for DNS & SSL
- **Stripe** for payment processing

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/taktikal-beatz.git
cd taktikal-beatz
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Stripe Payments
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI AI Integration
OPENAI_API_KEY=your_openai_api_key

# Email (Contact Form & Newsletter)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@taktikalbeatz.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://taktikalbeatz.com
NEXT_PUBLIC_SITE_NAME=Taktikal Beatz
ADMIN_EMAIL=admin@taktikalbeatz.com
```

### 3. Database Setup
Run migrations and seed data:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run start
```

## Database Schema

### Core Tables
- **users**: User accounts (admin/user roles)
- **beats**: Beat metadata, pricing, audio URLs
- **orders**: Purchase transactions
- **subscriptions**: Recurring subscription plans
- **beat_bundles**: Discounted beat packages
- **newsletters**: Email subscribers
- **email_campaigns**: Marketing campaigns
- **testimonials**: Client reviews
- **contact_messages**: Contact form submissions
- **admin_logs**: Admin activity tracking
- **auth_logs**: Authentication events
- **purchase_logs**: Purchase tracking

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect via Vercel dashboard:
# 1. Go to https://vercel.com
# 2. Import your GitHub repository
# 3. Configure environment variables
# 4. Deploy
```

### 3. Configure Domain (taktikalbeatz.com)
1. In Vercel dashboard: Project → Settings → Domains
2. Add your domain `taktikalbeatz.com`
3. Configure DNS at your registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

## Payment Setup (Stripe)

### 1. Create Stripe Account
- Sign up at https://stripe.com
- Get your API keys from Dashboard → Developers → API Keys

### 2. Configure Products
- Create products for:
  - Individual beats
  - Beat bundles
  - Subscription plans (monthly/yearly)

### 3. Webhook Setup
- In Stripe Dashboard: Developers → Webhooks
- Add endpoint: `https://taktikalbeatz.com/api/stripe/webhook`
- Select events: All payment & subscription events

## AI Integration Setup

### 1. OpenAI API
- Sign up at https://openai.com
- Get API key from Dashboard → API Keys
- Add to `.env.local`: `OPENAI_API_KEY=your_key`

### 2. AI Features Available
- **Auto-Metadata**: Generate beat descriptions, tags, SEO content
- **Email Campaigns**: AI-assisted email content generation
- **Social Media**: Auto-captions for Instagram, Twitter, TikTok
- **Client Analysis**: Beat suggestions based on request text

## Admin Dashboard Access

### Default Credentials (after seeding)
```bash
Admin: admin@taktikalbeatz.com / Admin@1234
User: test@example.com / User@1234
```

### Access URLs
- **Admin Dashboard**: `/admin` (requires admin role)
- **User Dashboard**: `/dashboard` (requires login)
- **Store**: `/store`
- **Bundles**: `/bundles`
- **Contact**: `/contact`

## Security Best Practices

### 1. Update Default Credentials
```sql
-- Update admin password
UPDATE users SET password_hash = 'new_hash' WHERE email = 'admin@taktikalbeatz.com';
```

### 2. Enable 2FA (Optional)
Configure in `src/lib/auth.ts`:
```typescript
// Add 2FA methods (Google Authenticator, SMS)
```

### 3. Regular Updates
```bash
npm audit fix
npm update
```

### 4. Database Backups
```bash
# Supabase provides automatic backups
# Enable daily backups in Supabase Dashboard
```

## Monitoring & Analytics

### 1. Google Analytics
Add to `src/app/layout.tsx`:
```typescript
// Add gtag script
```

### 2. Error Tracking
```bash
# Add Sentry or LogRocket
npm install @sentry/nextjs
```

### 3. Performance Monitoring
```bash
# Vercel provides built-in analytics
# Check Vercel Dashboard → Analytics
```

## Scaling Considerations

### 1. Database Scaling
**Supabase Scaling Plans**: 
- Free → Pro → Enterprise
- Configure auto-scaling in Supabase Dashboard

### 2. File Storage
**Supabase Storage Limits**:
- Free: 500MB
- Pro: 100GB
- Enterprise: Custom

### 3. CDN for Audio Files
```bash
# Consider Cloudflare R2 or AWS S3
# Configure in src/lib/storage.ts
```

## Support & Maintenance

### 1. Regular Updates
```bash
# Check for updates weekly
npm outdated
npm update
```

### 2. Security Audits
```bash
npm run security-check
npm audit
```

### 3. Performance Optimization
```bash
# Run Lighthouse audits
# Optimize images with next/image
# Implement caching strategies
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - See LICENSE file

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/taktikal-beatz/issues
- Email: support@taktikalbeatz.com
- Discord: Join our community

---

**Happy Producing! 🎵**

Built with modern web technologies, AI integrations, and comprehensive security features.# taktikal-beatz
# taktikal-beatz
# taktikal-beatz
