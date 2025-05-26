import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../stripe-config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  try {
    const { data: sessionData, error } = await supabase.functions.invoke('stripe-checkout', {
      body: {
        price_id: priceId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/canceled`,
        mode
      }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }

    return sessionData;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
}

/**
 * Get the user's current subscription status
 */
export async function getUserSubscription() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
}

/**
 * Get the product details for a price ID
 */
export function getProductByPriceId(priceId: string) {
  return Object.values(PRODUCTS).find(product => product.priceId === priceId);
}

/**
 * Get the user's order history
 */
export async function getUserOrders() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    return [];
  }
}