require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('../config/db');
const { getEnv } = require('../utils/env');
const Store = require('../models/Store');
const User = require('../models/User');
const { log } = require('../utils/logger');

async function seed() {
  const env = getEnv();
  await connect(env.mongodbUri);

  const storeId = process.env.SEED_STORE_ID || 'store_demo';
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const store = await Store.findOneAndUpdate(
    { store_id: storeId },
    { $set: { name: 'Loja Demo', store_id: storeId } },
    { upsert: true, new: true }
  );

  const passwordHash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { store_id: storeId, email },
    { $set: { store_id: storeId, email, password_hash: passwordHash, role: 'owner' } },
    { upsert: true }
  );

  log('info', 'Seed completed', { store_id: store.store_id, email });
  process.exit(0);
}

seed().catch((err) => {
  log('error', 'Seed failed', { message: err.message });
  process.exit(1);
});
