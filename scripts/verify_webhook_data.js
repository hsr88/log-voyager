
// scripts/verify-webhook-logic.js
const crypto = require('crypto');

// Mock configuration
const SECRET = 'test-secret-123';
const USER_ID = 'test-user-id-uuid-1234';

// Mock payload (Subscription Created)
const payload = {
    meta: {
        event_name: 'subscription_created',
        custom_data: {
            user_id: USER_ID
        }
    },
    data: {
        id: '1',
        type: 'subscriptions',
        attributes: {
            status: 'active'
        }
    }
};

const rawBody = JSON.stringify(payload);

// Calculate Signature
const hmac = crypto.createHmac('sha256', SECRET);
const signature = hmac.update(rawBody).digest('hex');

console.log('--- Verification Data ---');
console.log('Secret:', SECRET);
console.log('Raw Body:', rawBody);
console.log('Calculated Signature (X-Signature):', signature);
console.log('\n--- Usage ---');
console.log('You can use this signature and body to test the endpoint using Postman or curl.');
console.log(`curl -X POST http://localhost:3000/api/webhook \\`);
console.log(`  -H "Content-Type: application/json" \\`);
console.log(`  -H "X-Signature: ${signature}" \\`);
console.log(`  -d '${rawBody}'`);
