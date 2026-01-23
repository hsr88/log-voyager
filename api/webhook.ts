import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Admin Client
// note: process.env is used for Vercel Serverless Functions
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Verify Signature
        const rawBody = JSON.stringify(req.body);
        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers['x-signature'] as string || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // 2. Process Event
        const event = req.body;
        const { meta, data } = event;
        const eventName = meta.event_name;
        const customData = data.attributes.test_mode ? data.attributes.urls.receipt : data.attributes.custom_data;

        // LemonSqueezy passes 'custom_data' if we provided it during checkout
        // We need 'user_id' from there.
        // Note: In some webhook events, custom_data might be nested differently or we need to look up the order.
        // For 'subscription_created', it should be in data.attributes.custom_data

        // We also support 'order_created' for one-time payments if you switch later.
        if (eventName === 'subscription_created' || eventName === 'order_created' || eventName === 'subscription_updated') {
            const userId = meta.custom_data?.user_id;

            if (!userId) {
                console.error('No user_id found in custom_data', meta);
                return res.status(400).json({ error: 'No user_id provided in webhook' });
            }

            // 3. Update User Profile
            const { error } = await supabase
                .from('profiles')
                .update({ subscription_tier: 'pro' })
                .eq('id', userId);

            if (error) {
                console.error('Supabase update error:', error);
                return res.status(500).json({ error: 'Database update failed' });
            }

            return res.status(200).json({ message: 'Profile updated to PRO' });
        }

        // Handle cancellations/expirations if needed (optional for MVP)
        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const userId = meta.custom_data?.user_id;
            if (userId) {
                await supabase.from('profiles').update({ subscription_tier: 'free' }).eq('id', userId);
            }
        }

        return res.status(200).json({ message: 'Event ignored' });

    } catch (err: any) {
        console.error('Webhook error:', err);
        return res.status(500).json({ error: err.message });
    }
}
