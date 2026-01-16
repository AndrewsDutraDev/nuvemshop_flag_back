const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'NUVEMSHOP_WEBHOOK_SECRET'
];

function getEnv() {
  required.forEach((key) => {
    if (!process.env[key]) {
      // Allow missing ENCRYPTION_KEY in dev when OAuth isn't used.
      if (key === 'ENCRYPTION_KEY') return;
      throw new Error(`Missing required env var: ${key}`);
    }
  });

  return {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    webhookSecret: process.env.NUVEMSHOP_WEBHOOK_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
    publicIdsLimit: Number(process.env.PUBLIC_IDS_LIMIT || 50),
    publicIdsMaxLength: Number(process.env.PUBLIC_IDS_MAX_LENGTH || 2000),
    cacheTtlSeconds: Number(process.env.PUBLIC_CACHE_TTL_SECONDS || 30)
  };
}

module.exports = { getEnv };
