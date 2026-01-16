const Store = require('../models/Store');
const { encrypt } = require('../utils/crypto');
const { getEnv } = require('../utils/env');

function getOAuthStartUrl(storeId) {
  // TODO: Fill based on Nuvemshop OAuth docs (client_id, redirect_uri, scopes)
  return `https://www.nuvemshop.com.br/apps/${storeId}/authorize`;
}

async function handleOAuthCallback({ store_id, access_token }) {
  const env = getEnv();
  const encrypted = encrypt(access_token, env.encryptionKey);
  await Store.updateOne(
    { store_id },
    { $set: { access_token: encrypted } },
    { upsert: true }
  );
}

module.exports = { getOAuthStartUrl, handleOAuthCallback };
