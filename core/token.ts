import crypto from 'crypto';

const newToken = crypto.randomBytes(24).toString('hex');

console.log(`🔑 New Token generated for the team: ${newToken}`);
