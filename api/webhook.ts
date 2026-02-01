import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Disable the default body parser to handle the raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

// Initialize Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to read the raw body from the request
async function getRawBody(req: VercelRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', (err) => reject(err));
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Get Raw Body
        const rawBodyBuffer = await getRawBody(req);
        const rawBody = rawBodyBuffer.toString('utf8');

        // 2. Verify Signature
        const signature = req.headers['x-signature'] as string || '';
        if (!webhookSecret) {
            console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // 3. Parse Event
        const event = JSON.parse(rawBody);
        const { meta, data } = event;
        const eventName = meta.event_name;

        console.log(`Received event: ${eventName}`, meta);

        // 4. Handle Events
        // We handle subscription_created, order_created (one-time), and subscription_updated (renewals/upgrades)
        if (eventName === 'subscription_created' || eventName === 'order_created' || eventName === 'subscription_updated') {
            // custom_data is passed from the checkout
            // structure: payload -> meta -> custom_data -> user_id
            const userId = meta.custom_data?.user_id;

            if (!userId) {
                console.error('No user_id found in custom_data', meta);
                // Return 200 to acknowledge receipt even if we can't process it (to prevent retries if it's a data issue)
                // But if it's a configured error, maybe 400. Let's return 200 but log error.
                return res.status(200).json({ error: 'No user_id provided in webhook' });
            }

            // Update User Profile
            const { error } = await supabase
                .from('profiles')
                .update({ subscription_tier: 'pro' })
                .eq('id', userId);

            if (error) {
                console.error('Supabase update error:', error);
                return res.status(500).json({ error: 'Database update failed' });
            }

            console.log(`Successfully updated user ${userId} to PRO`);
            return res.status(200).json({ message: 'Profile updated to PRO' });
        }

        // Handle cancellations/expirations
        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const userId = meta.custom_data?.user_id;
            if (userId) {
                const { error } = await supabase
                    .from('profiles')
                    .update({ subscription_tier: 'free' })
                    .eq('id', userId);

                if (error) {
                    console.error('Supabase update error (cancellation):', error);
                } else {
                    console.log(`Successfully downgraded user ${userId} to FREE`);
                }
            }
        }

        return res.status(200).json({ message: 'Event ignored' });

    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return res.status(500).json({ error: err.message });
    }
}
