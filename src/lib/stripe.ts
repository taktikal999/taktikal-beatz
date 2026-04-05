import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripe_price_id?: string
  stripe_product_id?: string
}

export interface BeatBundle {
  id: string
  name: string
  description: string
  beats: string[]
  price: number
  discount_price?: number
  stripe_price_id?: string
  stripe_product_id?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly_basic',
    name: 'Basic Producer',
    description: 'Access to 5 exclusive beats per month',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 exclusive beats per month',
      'Basic license for personal use',
      'MP3 downloads',
      'Email support'
    ]
  },
  {
    id: 'monthly_pro',
    name: 'Pro Producer',
    description: 'Unlimited access to exclusive beats',
    price: 49.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited exclusive beats',
      'Commercial license included',
      'WAV + MP3 downloads',
      'Stems available',
      'Priority support',
      'Early access to new beats'
    ]
  },
  {
    id: 'yearly_pro',
    name: 'Pro Producer (Yearly)',
    description: 'Unlimited access with 2 months free',
    price: 499.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'Unlimited exclusive beats',
      'Commercial license included',
      'WAV + MP3 downloads',
      'Stems available',
      'Priority support',
      'Early access to new beats',
      '2 months free compared to monthly'
    ]
  }
]

export const BEAT_BUNDLES: BeatBundle[] = [
  {
    id: 'trap_bundle',
    name: 'Trap Essentials Bundle',
    description: '10 hard-hitting trap beats for your next project',
    beats: [],
    price: 299.99,
    discount_price: 199.99,
  },
  {
    id: 'lofi_bundle',
    name: 'Lofi Chill Bundle',
    description: '15 smooth lofi beats for relaxed vibes',
    beats: [],
    price: 249.99,
    discount_price: 179.99,
  },
  {
    id: 'rnb_bundle',
    name: 'R&B Grooves Bundle',
    description: '12 soulful R&B beats with smooth melodies',
    beats: [],
    price: 279.99,
    discount_price: 189.99,
  }
]

export class StripeService {
  static async initializeProducts() {
    try {
      for (const plan of SUBSCRIPTION_PLANS) {
        if (!plan.stripe_product_id) {
          const product = await stripe.products.create({
            name: plan.name,
            description: plan.description,
            metadata: {
              plan_id: plan.id,
              type: 'subscription'
            }
          })

          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(plan.price * 100),
            currency: plan.currency,
            recurring: {
              interval: plan.interval
            },
            metadata: {
              plan_id: plan.id
            }
          })

          plan.stripe_product_id = product.id
          plan.stripe_price_id = price.id
        }
      }

      for (const bundle of BEAT_BUNDLES) {
        if (!bundle.stripe_product_id) {
          const product = await stripe.products.create({
            name: bundle.name,
            description: bundle.description,
            metadata: {
              bundle_id: bundle.id,
              type: 'bundle'
            }
          })

          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round((bundle.discount_price || bundle.price) * 100),
            currency: 'USD',
            metadata: {
              bundle_id: bundle.id
            }
          })

          bundle.stripe_product_id = product.id
          bundle.stripe_price_id = price.id
        }
      }

      console.log('Stripe products initialized')
    } catch (error) {
      console.error('Failed to initialize Stripe products:', error)
    }
  }

  static async createCheckoutSession(
    customerEmail: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata: Record<string, string> = {}
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: customerEmail,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: priceId.includes('price_') ? 
          (priceId.includes('monthly') || priceId.includes('yearly') ? 'subscription' : 'payment') : 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        allow_promotion_codes: true,
      })

      return session
    } catch (error) {
      console.error('Failed to create checkout session:', error)
      throw error
    }
  }

  static async createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })

      return session
    } catch (error) {
      console.error('Failed to create portal session:', error)
      throw error
    }
  }

  static async handleWebhookEvent(payload: Buffer, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as any)
          break
        
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as any)
          break
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as any)
          break
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as any)
          break
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as any)
          break
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as any)
          break
      }

      return { success: true }
    } catch (error) {
      console.error('Webhook error:', error)
      throw error
    }
  }

  private static async handleCheckoutSessionCompleted(session: any) {
    const { supabase } = await import('./database')
    
    const customerEmail = session.customer_email
    const customerId = session.customer
    const amount = session.amount_total / 100
    
    const metadata = session.metadata || {}
    
    if (session.mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      
      await supabase.from('subscriptions').insert({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        customer_email: customerEmail,
        plan_id: metadata.plan_id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
    } else {
      await supabase.from('orders').insert({
        stripe_payment_intent_id: session.payment_intent,
        stripe_customer_id: customerId,
        email: customerEmail,
        amount,
        currency: session.currency,
        status: 'completed',
        metadata,
      })
    }
    
    await this.sendPurchaseConfirmation(customerEmail, amount, metadata)
  }

  private static async handleSubscriptionCreated(subscription: any) {
    const { supabase } = await import('./database')
    
    await supabase.from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  private static async handleSubscriptionUpdated(subscription: any) {
    const { supabase } = await import('./database')
    
    await supabase.from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  private static async handleSubscriptionDeleted(subscription: any) {
    const { supabase } = await import('./database')
    
    await supabase.from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  private static async handleInvoicePaymentSucceeded(invoice: any) {
    const { supabase } = await import('./database')
    
    const subscriptionId = invoice.subscription
    const amount = invoice.amount_paid / 100
    
    await supabase.from('subscription_payments').insert({
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount,
      currency: invoice.currency,
      status: 'paid',
      paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
    })
    
    await this.sendSubscriptionRenewalConfirmation(invoice.customer_email, amount)
  }

  private static async handleInvoicePaymentFailed(invoice: any) {
    const { supabase } = await import('./database')
    
    const subscriptionId = invoice.subscription
    
    await supabase.from('subscription_payments').insert({
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      failure_reason: invoice.billing_reason,
    })
    
    await this.sendPaymentFailureNotification(invoice.customer_email)
  }

  private static async sendPurchaseConfirmation(email: string, amount: number, metadata: any) {
    const { AIService } = await import('./ai')
    
    const campaign = await AIService.generateEmailCampaign('new_beat', {
      beatTitle: metadata.beat_title || 'Your Purchase',
      amount
    })
    
    console.log('Would send purchase confirmation:', { email, campaign })
  }

  private static async sendSubscriptionRenewalConfirmation(email: string, amount: number) {
    console.log('Subscription renewed:', { email, amount })
  }

  private static async sendPaymentFailureNotification(email: string) {
    console.log('Payment failed for:', email)
  }

  static async getCustomerSubscriptions(customerId: string) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      })

      return subscriptions.data
    } catch (error) {
      console.error('Failed to get customer subscriptions:', error)
      return []
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    }
  }
}