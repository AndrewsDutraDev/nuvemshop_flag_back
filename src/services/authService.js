const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const { getEnv } = require('../utils/env');

async function login(email, password, storeId) {
  const filter = storeId ? { email, store_id: storeId } : { email };
  const user = await User.findOne(filter).lean();
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  const env = getEnv();
  const token = jwt.sign(
    { user_id: user._id.toString(), store_id: user.store_id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  const store = await Store.findOne({ store_id: user.store_id }).lean();
  return {
    token,
    user: {
      email: user.email,
      role: user.role,
      store_id: user.store_id
    },
    store: store
      ? { store_id: store.store_id, name: store.name, created_at: store.created_at }
      : null
  };
}

module.exports = { login };
