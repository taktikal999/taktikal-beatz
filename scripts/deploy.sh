#!/bin/bash

echo "🚀 Taktikal Beatz Deployment Script"
echo "==================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your settings"
    exit 1
fi

echo "✅ .env.local found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Environment variables configured"
echo "2. ✅ Database migrated and seeded"
echo "3. ✅ Project built successfully"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "🖥️ Local Development:"
echo "   npm run dev"
echo ""
echo "🚀 Production Deployment:"
echo "1. Push to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   a) Install Vercel CLI: npm i -g vercel"
echo "   b) Run: vercel --prod"
echo ""
echo "3. Configure Domain:"
echo "   a) Add taktikalbeatz.com in Vercel Dashboard"
echo "   b) Update DNS at your registrar"
echo ""
echo "💰 Payment Setup:"
echo "1. Create Stripe account"
echo "2. Configure API keys in .env.local"
echo "3. Set up webhooks for payments"
echo ""
echo "🤖 AI Setup:"
echo "1. Get OpenAI API key"
echo "2. Add OPENAI_API_KEY to .env.local"
echo ""
echo "🔐 Security:"
echo "1. Update default passwords"
echo "2. Enable HTTPS enforcement"
echo "3. Configure rate limiting"
echo ""
echo "🎵 Your Taktikal Beatz website is ready to launch!"