import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('Starting database migration...')
  
  try {
    console.log('Creating users table...')
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(100),
          full_name VARCHAR(255),
          password_hash VARCHAR(255) NOT NULL,
          avatar_url TEXT,
          role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      `
    })
    
    if (usersError) throw usersError
    
    console.log('Creating beats table...')
    const { error: beatsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS beats (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          genre TEXT[] NOT NULL,
          bpm INTEGER NOT NULL CHECK (bpm BETWEEN 60 AND 240),
          key VARCHAR(10) NOT NULL,
          duration INTEGER NOT NULL CHECK (duration BETWEEN 30 AND 600),
          price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
          discount_price DECIMAL(10,2) CHECK (discount_price >= 0),
          preview_url TEXT NOT NULL,
          audio_url TEXT NOT NULL,
          stems_url TEXT,
          cover_image TEXT,
          tags TEXT[] DEFAULT '{}',
          is_featured BOOLEAN DEFAULT false,
          is_published BOOLEAN DEFAULT false,
          downloads_count INTEGER DEFAULT 0,
          likes_count INTEGER DEFAULT 0,
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CHECK (discount_price IS NULL OR discount_price < price)
        );
        
        CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats USING GIN(genre);
        CREATE INDEX IF NOT EXISTS idx_beats_bpm ON beats(bpm);
        CREATE INDEX IF NOT EXISTS idx_beats_price ON beats(price);
        CREATE INDEX IF NOT EXISTS idx_beats_featured ON beats(is_featured);
        CREATE INDEX IF NOT EXISTS idx_beats_published ON beats(is_published);
        CREATE INDEX IF NOT EXISTS idx_beats_created_at ON beats(created_at DESC);
      `
    })
    
    if (beatsError) throw beatsError
    
    console.log('Creating orders table...')
    const { error: ordersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          email VARCHAR(255) NOT NULL,
          beat_id UUID NOT NULL REFERENCES beats(id),
          amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
          currency VARCHAR(3) DEFAULT 'USD',
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          stripe_payment_intent_id VARCHAR(255) UNIQUE,
          stripe_customer_id VARCHAR(255),
          download_url TEXT,
          download_expires_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_beat_id ON orders(beat_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
      `
    })
    
    if (ordersError) throw ordersError
    
    console.log('Creating portfolio_items table...')
    const { error: portfolioError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS portfolio_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          type VARCHAR(50) CHECK (type IN ('beat', 'production', 'collaboration', 'remix')),
          client VARCHAR(255),
          year INTEGER NOT NULL,
          audio_url TEXT,
          video_url TEXT,
          cover_image TEXT,
          tags TEXT[] DEFAULT '{}',
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_portfolio_type ON portfolio_items(type);
        CREATE INDEX IF NOT EXISTS idx_portfolio_year ON portfolio_items(year DESC);
        CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(is_featured);
      `
    })
    
    if (portfolioError) throw portfolioError
    
    console.log('Creating contact_messages table...')
    const { error: contactError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
        CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at DESC);
      `
    })
    
    if (contactError) throw contactError
    
    console.log('Creating admin_logs table...')
    const { error: adminLogsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          action VARCHAR(100) NOT NULL,
          ip_address INET,
          user_agent TEXT,
          details JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
        CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
      `
    })
    
    if (adminLogsError) throw adminLogsError
    
    console.log('Creating auth_logs table...')
    const { error: authLogsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS auth_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          action VARCHAR(100) NOT NULL,
          ip_address INET,
          user_agent TEXT,
          success BOOLEAN NOT NULL,
          error_message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_auth_logs_email ON auth_logs(email);
        CREATE INDEX IF NOT EXISTS idx_auth_logs_action ON auth_logs(action);
        CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at DESC);
      `
    })
    
    if (authLogsError) throw authLogsError
    
    console.log('Creating purchase_logs table...')
    const { error: purchaseLogsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS purchase_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id UUID REFERENCES orders(id),
          beat_id UUID REFERENCES beats(id),
          email VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          ip_address INET,
          action VARCHAR(100) NOT NULL,
          details JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_purchase_logs_order_id ON purchase_logs(order_id);
        CREATE INDEX IF NOT EXISTS idx_purchase_logs_email ON purchase_logs(email);
        CREATE INDEX IF NOT EXISTS idx_purchase_logs_created_at ON purchase_logs(created_at DESC);

        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          stripe_subscription_id VARCHAR(255) UNIQUE,
          stripe_customer_id VARCHAR(255),
          customer_email VARCHAR(255) NOT NULL,
          plan_id VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
          current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
          current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
          cancel_at_period_end BOOLEAN DEFAULT false,
          canceled_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON subscriptions(customer_email);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

        CREATE TABLE IF NOT EXISTS subscription_payments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          subscription_id UUID REFERENCES subscriptions(id),
          stripe_invoice_id VARCHAR(255) UNIQUE,
          stripe_subscription_id VARCHAR(255),
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          status VARCHAR(50) CHECK (status IN ('paid', 'failed', 'pending')),
          paid_at TIMESTAMP WITH TIME ZONE,
          failure_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON subscription_payments(subscription_id);
        CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON subscription_payments(status);
        CREATE INDEX IF NOT EXISTS idx_subscription_payments_created_at ON subscription_payments(created_at DESC);

        CREATE TABLE IF NOT EXISTS beat_bundles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          description TEXT,
          beats UUID[] NOT NULL,
          price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
          discount_price DECIMAL(10,2) CHECK (discount_price >= 0),
          stripe_product_id VARCHAR(255),
          stripe_price_id VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CHECK (discount_price IS NULL OR discount_price < price)
        );
        
        CREATE INDEX IF NOT EXISTS idx_beat_bundles_active ON beat_bundles(is_active);
        CREATE INDEX IF NOT EXISTS idx_beat_bundles_price ON beat_bundles(price);

        CREATE TABLE IF NOT EXISTS bundle_purchases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          bundle_id UUID REFERENCES beat_bundles(id),
          user_id UUID REFERENCES users(id),
          email VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          stripe_payment_intent_id VARCHAR(255) UNIQUE,
          stripe_customer_id VARCHAR(255),
          status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          download_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_bundle_purchases_bundle_id ON bundle_purchases(bundle_id);
        CREATE INDEX IF NOT EXISTS idx_bundle_purchases_user_id ON bundle_purchases(user_id);
        CREATE INDEX IF NOT EXISTS idx_bundle_purchases_email ON bundle_purchases(email);
        CREATE INDEX IF NOT EXISTS idx_bundle_purchases_created_at ON bundle_purchases(created_at DESC);

        CREATE TABLE IF NOT EXISTS newsletters (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          source VARCHAR(100),
          tags TEXT[] DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          unsubscribed_at TIMESTAMP WITH TIME ZONE,
          last_engagement TIMESTAMP WITH TIME ZONE
        );
        
        CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
        CREATE INDEX IF NOT EXISTS idx_newsletters_active ON newsletters(is_active);
        CREATE INDEX IF NOT EXISTS idx_newsletters_subscribed_at ON newsletters(subscribed_at DESC);

        CREATE TABLE IF NOT EXISTS email_campaigns (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          body TEXT NOT NULL,
          campaign_type VARCHAR(50) NOT NULL,
          segments TEXT[] DEFAULT '{}',
          status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
          scheduled_for TIMESTAMP WITH TIME ZONE,
          sent_at TIMESTAMP WITH TIME ZONE,
          open_rate DECIMAL(5,2),
          click_rate DECIMAL(5,2),
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
        CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_for ON email_campaigns(scheduled_for);
        CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);

        CREATE TABLE IF NOT EXISTS testimonials (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          client_role VARCHAR(100),
          client_image TEXT,
          content TEXT NOT NULL,
          rating INTEGER CHECK (rating BETWEEN 1 AND 5),
          project_type VARCHAR(100),
          is_featured BOOLEAN DEFAULT false,
          is_approved BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
        CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
        CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);
      `
    })
    
    if (purchaseLogsError) throw purchaseLogsError
    
    console.log('Creating functions...')
    const { error: functionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_beats_updated_at BEFORE UPDATE ON beats
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio_items
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON contact_messages
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_beat_bundles_updated_at BEFORE UPDATE ON beat_bundles
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
        CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `
    })
    
    if (functionsError) throw functionsError
    
    console.log('Database migration completed successfully!')
    
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()